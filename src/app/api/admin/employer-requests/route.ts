import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

import { getAuthSession } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Từ chối truy cập. Yêu cầu quyền ADMIN." }, { status: 403 });
    }

    const requests = await prisma.employerRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            walletAddress: true,
            name: true,
            email: true,
            role: true,
            employerStatus: true,
            createdAt: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, requests });
  } catch (error) {
    console.error("Admin fetch employer requests error:", error);
    return NextResponse.json(
      { error: "Không thể lấy danh sách yêu cầu cấp role Employer." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Từ chối truy cập. Yêu cầu quyền ADMIN." }, { status: 403 });
    }

    const body = await req.json();
    const { requestId, walletAddress, action } = body;

    const request = await prisma.employerRequest.findFirst({
      where: requestId ? { id: requestId } : { walletAddress: walletAddress.toLowerCase() }
    });

    if (!request) {
      return NextResponse.json({ error: "Không tìm thấy bản ghi yêu cầu." }, { status: 404 });
    }

    const targetAddress = request.walletAddress.toLowerCase();

    if (action === "APPROVE") {
      await prisma.employerRequest.update({
        where: { id: request.id },
        data: { status: "APPROVED", updatedAt: new Date() }
      });

      await prisma.user.update({
        where: { walletAddress: targetAddress },
        data: {
          role: "EMPLOYER",
          employerStatus: "APPROVED"
        }
      });

      return NextResponse.json({
        success: true,
        message: `Đã phê duyệt thành công role EMPLOYER cho địa chỉ ví ${targetAddress}`
      });
    } else if (action === "REJECT") {
      await prisma.employerRequest.update({
        where: { id: request.id },
        data: { status: "REJECTED", updatedAt: new Date() }
      });

      await prisma.user.update({
        where: { walletAddress: targetAddress },
        data: {
          employerStatus: "REJECTED"
        }
      });

      return NextResponse.json({
        success: true,
        message: `Đã từ chối yêu cầu của ví ${targetAddress}`
      });
    }

    return NextResponse.json({ error: "Hành động không hợp lệ." }, { status: 400 });
  } catch (error) {
    console.error("Admin decision error:", error);
    return NextResponse.json(
      { error: "Không thể xử lý yêu cầu." },
      { status: 500 }
    );
  }
}
