import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";
import { verifyEscrowTxOnChain } from "@/lib/escrow-verify";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const { releaseTxHash } = body;

    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để nghiệm thu và giải ngân." }, { status: 401 });
    }

    const callerAddress = session.walletAddress.toLowerCase();

    const contract = await prisma.contract.findUnique({
      where: { jobId }
    });

    if (!contract) {
      return NextResponse.json({ error: "Không tìm thấy hợp đồng cho dự án này." }, { status: 404 });
    }

    if (contract.employerAddress.toLowerCase() !== callerAddress) {
      return NextResponse.json({ error: "Chỉ Người thuê (Bên A) mới có quyền nghiệm thu và giải ngân." }, { status: 403 });
    }

    // Verify release transaction trên blockchain nếu có txHash thực
    if (releaseTxHash && releaseTxHash.startsWith("0x") && releaseTxHash.length === 66) {
      const verification = await verifyEscrowTxOnChain(releaseTxHash);
      if (!verification.success) {
        return NextResponse.json(
          { error: `Giao dịch giải ngân chưa được xác thực trên blockchain: ${verification.error}` },
          { status: 400 }
        );
      }
    }

    // Wrap in Prisma transaction for atomic completion
    const [updatedContract, updatedJob] = await prisma.$transaction(async (tx) => {
      const c = await tx.contract.update({
        where: { jobId },
        data: {
          status: "COMPLETED",
          txHash: releaseTxHash || contract.txHash
        }
      });

      const j = await tx.job.update({
        where: { id: jobId },
        data: { status: "COMPLETED" }
      });

      if (contract.freelancerAddress && contract.freelancerAddress !== "0x0000000000000000000000000000000000000000") {
        await tx.user.update({
          where: { walletAddress: contract.freelancerAddress.toLowerCase() },
          data: {
            totalEarned: { increment: contract.totalAmount }
          }
        }).catch(() => null);
      }

      return [c, j];
    });

    return NextResponse.json({ success: true, contract: updatedContract, job: updatedJob });
  } catch (error) {
    console.error("Release payment error:", error);
    return NextResponse.json({ error: "Lỗi không thể nghiệm thu & giải ngân." }, { status: 500 });
  }
}
