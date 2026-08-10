import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const { clientAddress, releaseTxHash } = body;

    if (!clientAddress) {
      return NextResponse.json({ error: "Xác thực địa chỉ ví Bên A thất bại." }, { status: 400 });
    }

    const contract = await prisma.contract.findUnique({
      where: { jobId }
    });

    if (!contract) {
      return NextResponse.json({ error: "Không tìm thấy hợp đồng cho dự án này." }, { status: 404 });
    }

    if (contract.clientAddress.toLowerCase() !== clientAddress.toLowerCase()) {
      return NextResponse.json({ error: "Chỉ Người thuê (Bên A) mới có quyền nghiệm thu và giải ngân." }, { status: 403 });
    }

    // Update contract & job to COMPLETED
    const updatedContract = await prisma.contract.update({
      where: { jobId },
      data: {
        status: "COMPLETED",
        txHash: releaseTxHash || contract.txHash
      }
    });

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status: "COMPLETED" }
    });

    // Increase freelancer's totalEarned
    await prisma.user.update({
      where: { walletAddress: contract.freelancerAddress.toLowerCase() },
      data: {
        totalEarned: { increment: contract.totalAmount }
      }
    }).catch(() => null);

    return NextResponse.json({ success: true, contract: updatedContract, job: updatedJob });
  } catch (error) {
    console.error("Release payment error:", error);
    return NextResponse.json({ error: "Lỗi không thể nghiệm thu & giải ngân." }, { status: 500 });
  }
}
