import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SiweMessage } from "siwe";
import { ethers } from "ethers";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/auth-guard";

// Chữ ký SIWE chỉ hợp lệ trong khoảng thời gian này kể từ "Issued At"
const SIWE_MAX_AGE_MS = 10 * 60 * 1000; // 10 phút

/**
 * Xác thực thủ công thông điệp SIWE hand-built (parser strict của `siwe` v3 từ chối
 * định dạng này). Vẫn siết đủ ràng buộc bảo mật: khôi phục địa chỉ từ chữ ký,
 * khớp domain + URI với host của request, khớp nonce, và kiểm tra độ tươi.
 */
function verifySiweManually(
  message: string,
  signature: string,
  nonce: string,
  expectedHost: string
): { ok: true; address: string } | { ok: false; error: string } {
  let recovered: string;
  try {
    recovered = ethers.verifyMessage(message, signature);
  } catch {
    return { ok: false, error: "Chữ ký ví không hợp lệ." };
  }

  const lines = message.split("\n");

  // Dòng 1: "<domain> wants you to sign in with your Ethereum account:"
  const domainMatch = lines[0]?.match(/^(\S+) wants you to sign in with your Ethereum account:$/);
  if (!domainMatch) {
    return { ok: false, error: "Thông điệp SIWE sai định dạng dòng mở đầu." };
  }
  if (domainMatch[1].toLowerCase() !== expectedHost.toLowerCase()) {
    return { ok: false, error: "Domain trong thông điệp không khớp với máy chủ." };
  }

  // URI phải cùng host
  const uriLine = lines.find((l) => l.startsWith("URI: "));
  try {
    const uriHost = new URL(uriLine!.slice(5).trim()).host;
    if (uriHost.toLowerCase() !== expectedHost.toLowerCase()) {
      return { ok: false, error: "URI trong thông điệp không khớp với máy chủ." };
    }
  } catch {
    return { ok: false, error: "URI trong thông điệp SIWE không hợp lệ." };
  }

  // Nonce phải khớp cookie (single-use, chống replay)
  if (!lines.some((l) => l.trim() === `Nonce: ${nonce}`)) {
    return { ok: false, error: "Mã nonce trong chữ ký không khớp phiên làm việc." };
  }

  // Độ tươi: Issued At trong vòng SIWE_MAX_AGE_MS
  const issuedLine = lines.find((l) => l.startsWith("Issued At: "));
  const issuedAt = issuedLine ? Date.parse(issuedLine.slice(11).trim()) : NaN;
  if (Number.isNaN(issuedAt) || Math.abs(Date.now() - issuedAt) > SIWE_MAX_AGE_MS) {
    return { ok: false, error: "Chữ ký đăng nhập đã hết hạn. Vui lòng thử lại." };
  }

  return { ok: true, address: recovered.toLowerCase() };
}

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();
    const nonceCookie = req.cookies.get("siwe_nonce")?.value;

    if (!message || !signature) {
      return NextResponse.json({ error: "Thiếu thông điệp hoặc chữ ký ví." }, { status: 400 });
    }

    // 1. Kiểm tra bắt buộc phải có nonceCookie (chống Replay Attack)
    if (!nonceCookie) {
      return NextResponse.json(
        { error: "Mã khởi tạo (nonce) đã hết hạn hoặc không tồn tại. Vui lòng đăng nhập lại." },
        { status: 401 }
      );
    }

    let walletAddress: string = "";

    // Domain hợp lệ = host của chính request này (chống chấp nhận chữ ký ký cho domain phishing khác)
    const expectedHost = req.headers.get("host") || new URL(req.url).host;

    // 2. Ưu tiên xác thực bằng thư viện `siwe` chuẩn EIP-4361;
    //    nếu parser strict từ chối định dạng (thông điệp hand-built) thì xác thực thủ công có siết ràng buộc.
    let siweParsed = false;
    try {
      const siweMessage = new SiweMessage(message);
      siweParsed = true;
      const verifyResult = await siweMessage.verify({
        signature,
        nonce: nonceCookie,
        domain: expectedHost
      });
      if (!verifyResult.success) {
        const errDetail = verifyResult.error ? String(verifyResult.error.type || verifyResult.error) : "Chữ ký SIWE không hợp lệ hoặc mã nonce không khớp.";
        return NextResponse.json({ error: `Xác thực SIWE thất bại: ${errDetail}` }, { status: 401 });
      }
      walletAddress = siweMessage.address.toLowerCase();
    } catch (siweErr) {
      if (siweParsed) {
        // Parse được nhưng verify ném lỗi → coi là chữ ký không hợp lệ
        console.warn("[SIWE] verify threw:", siweErr instanceof Error ? siweErr.message : String(siweErr));
        return NextResponse.json({ error: "Chữ ký SIWE không hợp lệ." }, { status: 401 });
      }
      const manual = verifySiweManually(message, signature, nonceCookie, expectedHost);
      if (!manual.ok) {
        return NextResponse.json({ error: manual.error }, { status: 401 });
      }
      walletAddress = manual.address;
    }

    // Upsert User vào Database (nếu chưa có thì tạo mới)
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: { updatedAt: new Date() },
      create: {
        walletAddress,
        role: "FREELANCER",
        name: `User ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
        rating: 5.0
      }
    });

    // Tạo JWT Token.
    // Lưu ý: `role` chỉ mang tính tham khảo cho client — server luôn xác thực
    // role theo DB ở mỗi request (xem getAuthSession). TTL ngắn để giảm cửa sổ
    // rủi ro nếu token bị lộ.
    const token = jwt.sign(
      {
        walletAddress: user.walletAddress,
        role: user.role
      },
      getJwtSecret(),
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      success: true,
      user,
      token
    });

    response.cookies.set("warranty_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 giờ (khớp TTL của JWT)
      path: "/"
    });

    // Xóa nonce cookie để phòng chống tái sử dụng (single-use nonce)
    response.cookies.set("siwe_nonce", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/"
    });

    return response;
  } catch (error: unknown) {
    console.error("SIWE Verify Server Error Detail:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xác thực chữ ký ví Web3. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}
