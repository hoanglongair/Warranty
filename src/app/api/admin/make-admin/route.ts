import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

import { getAuthSession } from "@/lib/auth-guard";

const VALID_ROLES: Role[] = ["FREELANCER", "EMPLOYER", "ADMIN"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { walletAddress, role } = body;

    if (!walletAddress || typeof walletAddress !== "string") {
      return NextResponse.json({ error: "Thiếu địa chỉ ví." }, { status: 400 });
    }

    const addressLower = walletAddress.toLowerCase();
    const targetRole = (role || "ADMIN") as Role;

    if (!VALID_ROLES.includes(targetRole)) {
      return NextResponse.json({ error: "Role không hợp lệ." }, { status: 400 });
    }

    // Cho phép bootstrap admin đầu tiên qua env ADMIN_BOOTSTRAP_ADDRESS
    const bootstrapAddr = process.env.ADMIN_BOOTSTRAP_ADDRESS?.toLowerCase();
    const isBootstrap =
      !!bootstrapAddr &&
      bootstrapAddr === addressLower &&
      targetRole === "ADMIN";

    if (!isBootstrap) {
      const session = await getAuthSession(req);
      if (!session || session.role !== "ADMIN") {
        return NextResponse.json(
          { error: "Từ chối truy cập. Chỉ tài khoản ADMIN hệ thống mới có quyền thực hiện." },
          { status: 403 }
        );
      }
    }

    const updatedUser = await prisma.user.upsert({
      where: { walletAddress: addressLower },
      update: { role: targetRole },
      create: {
        walletAddress: addressLower,
        role: targetRole,
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
