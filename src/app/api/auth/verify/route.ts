import { NextRequest, NextResponse } from "next/server";
import { SiweMessage } from "siwe";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "warranty_super_secret_jwt_key_2026";

export async function POST(req: NextRequest) {
  try {
    const { message, signature } = await req.json();
    const nonceCookie = req.cookies.get("siwe_nonce")?.value;

    if (!message || !signature) {
      return NextResponse.json({ error: "Thiếu thông điệp hoặc chữ ký ví." }, { status: 400 });
    }

    const siweMessage = new SiweMessage(message);
    const fields = await siweMessage.verify({
      signature,
      nonce: nonceCookie
    });

    if (!fields.success) {
      return NextResponse.json({ error: "Chữ ký không hợp lệ hoặc đã hết hạn." }, { status: 401 });
    }

    const walletAddress = fields.data.address.toLowerCase();

    // Upsert User vào Database (nếu chưa có thì tạo mới)
    const user = await prisma.user.upsert({
      where: { walletAddress },
      update: { updatedAt: new Date() },
      create: {
        walletAddress,
        role: "BOTH",
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
      JWT_SECRET,
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

    return response;
  } catch (error: unknown) {
    console.error("SIWE Verify Error:", error);
    return NextResponse.json(
      { error: "Lỗi xác thực chữ ký ví Web3." },
      { status: 500 }
    );
  }
}
