import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { SiweMessage } from "siwe";
import { ethers } from "ethers";
import { prisma } from "@/lib/prisma";
import { getJwtSecret } from "@/lib/auth-guard";

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

    // 2. Xác thực bằng chuẩn SIWE (EIP-4361)
    try {
      const siweMessage = new SiweMessage(message);
      const verifyResult = await siweMessage.verify({ signature, nonce: nonceCookie });
      if (!verifyResult.success) {
        const errDetail = verifyResult.error ? String(verifyResult.error.type || verifyResult.error) : "Chữ ký SIWE không hợp lệ hoặc mã nonce không khớp.";
        return NextResponse.json(
          { error: `Xác thực SIWE thất bại: ${errDetail}` },
          { status: 401 }
        );
      }
      walletAddress = siweMessage.address.toLowerCase();
    } catch {
      // Fallback: Phục hồi địa chỉ bằng ethers và kiểm tra nonce thủ công
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (!recoveredAddress) {
        return NextResponse.json({ error: "Chữ ký ví không hợp lệ." }, { status: 401 });
      }
      if (!message.includes(`Nonce: ${nonceCookie}`)) {
        return NextResponse.json({ error: "Mã khởi tạo (nonce) trong chữ ký không khớp với phiên làm việc." }, { status: 401 });
      }
      walletAddress = recoveredAddress.toLowerCase();
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

    // Tạo JWT Token
    const token = jwt.sign(
      {
        walletAddress: user.walletAddress,
        role: user.role
      },
      getJwtSecret(),
      { expiresIn: "7d" }
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
      maxAge: 7 * 24 * 60 * 60, // 7 ngày
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
    const errMessage = error instanceof Error ? error.message : String(error);
    console.error("SIWE Verify Server Error Detail:", error);
    return NextResponse.json(
      { error: `Lỗi xác thực chữ ký ví Web3: ${errMessage}` },
      { status: 500 }
    );
  }
}
