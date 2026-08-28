import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json(
        { authenticated: false, error: "Chưa đăng nhập hoặc phiên đã hết hạn." },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: session.walletAddress },
      select: {
        walletAddress: true,
        role: true,
        employerStatus: true,
        name: true,
        email: true,
        avatar: true,
        bio: true,
        skills: true,
        rating: true,
        totalEarned: true,
        createdAt: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { authenticated: false, error: "Người dùng không tồn tại trong hệ thống." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      authenticated: true,
      user
    });
  } catch (error) {
    console.error("GET /api/auth/me error:", error);
    return NextResponse.json(
      { authenticated: false, error: "Lỗi hệ thống khi kiểm tra trạng thái xác thực." },
      { status: 500 }
    );
  }
}
