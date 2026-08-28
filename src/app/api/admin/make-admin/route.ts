import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getAuthSession } from "@/lib/auth-guard";

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Từ chối truy cập. Chỉ tài khoản ADMIN hệ thống mới có quyền thực hiện." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { walletAddress, role } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: "Thiếu địa chỉ ví." }, { status: 400 });
    }

    const addressLower = walletAddress.toLowerCase();
    const targetRole = role || "ADMIN";

    const updatedUser = await prisma.user.upsert({
      where: { walletAddress: addressLower },
      update: { role: targetRole as any },
      create: {
        walletAddress: addressLower,
        role: targetRole as any,
        name: `Admin ${addressLower.slice(0, 6)}...`
      }
    });

    return NextResponse.json({
      success: true,
      message: `Đã cập nhật role của ví ${addressLower} thành ${targetRole}`,
      user: updatedUser
    });
  } catch (error) {
    console.error("Make admin error:", error);
    return NextResponse.json({ error: "Không thể thay đổi role." }, { status: 500 });
  }
}
