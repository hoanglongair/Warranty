import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const { freelancerAddress, deliverableNote, deliverableLink } = body;

    if (!freelancerAddress) {
      return NextResponse.json({ error: "Xác thực địa chỉ ví Bên B thất bại." }, { status: 400 });
    }

    const contract = await prisma.contract.findUnique({
      where: { jobId }
    });

    if (!contract) {
      return NextResponse.json({ error: "Không tìm thấy hợp đồng cho công việc này." }, { status: 404 });
    }

    if (contract.freelancerAddress.toLowerCase() !== freelancerAddress.toLowerCase()) {
      return NextResponse.json({ error: "Chỉ Freelancer (Bên B) của hợp đồng mới được phép nộp sản phẩm." }, { status: 403 });
    }

    // Update contract status to IN_PROGRESS (submitted state)
    const updatedContract = await prisma.contract.update({
      where: { jobId },
      data: {
        status: "IN_PROGRESS"
      }
    });

    return NextResponse.json({
      success: true,
      contract: updatedContract,
      note: deliverableNote || "Sản phẩm đã được bàn giao thành công.",
      link: deliverableLink || null
    });
  } catch (error) {
    console.error("Submit deliverable error:", error);
    return NextResponse.json({ error: "Lỗi không thể bàn giao sản phẩm." }, { status: 500 });
  }
}
