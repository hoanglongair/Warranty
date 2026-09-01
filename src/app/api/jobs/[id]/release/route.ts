import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";
import { verifyEscrowTxOnChain, verifyEscrowStateOnChain } from "@/lib/escrow-verify";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

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

    const contract = await prisma.contract.findUnique({ where: { jobId } });

    if (!contract) {
      return NextResponse.json({ error: "Không tìm thấy hợp đồng cho dự án này." }, { status: 404 });
    }

    if (contract.employerAddress.toLowerCase() !== callerAddress) {
      return NextResponse.json({ error: "Chỉ Người thuê (Bên A) mới có quyền nghiệm thu và giải ngân." }, { status: 403 });
    }

    if (contract.status === "COMPLETED") {
      return NextResponse.json({ error: "Hợp đồng này đã được giải ngân trước đó." }, { status: 409 });
    }

    if (contract.status !== "FUNDED" && contract.status !== "IN_PROGRESS") {
      return NextResponse.json(
        { error: `Hợp đồng không ở trạng thái có thể giải ngân (hiện tại: ${contract.status}).` },
        { status: 400 }
      );
    }

    // ─── Bắt buộc xác minh việc giải ngân đã thực sự xảy ra on-chain ───
    if (!releaseTxHash || typeof releaseTxHash !== "string" || !releaseTxHash.startsWith("0x") || releaseTxHash.length !== 66) {
      return NextResponse.json(
        { error: "Thiếu hash giao dịch giải ngân on-chain hợp lệ (releaseTxHash)." },
        { status: 400 }
      );
    }

    const txVerification = await verifyEscrowTxOnChain(releaseTxHash, {
      expectedEvent: "PaymentReleased",
      expectedJobId: jobId,
      expectedFrom: callerAddress
    });

    if (!txVerification.success) {
      return NextResponse.json(
        { error: `Giao dịch giải ngân chưa được xác thực trên blockchain: ${txVerification.error}` },
        { status: 400 }
      );
    }

    // Kiểm tra chéo trạng thái escrow trên contract (phải là COMPLETED = 2)
    const stateVerification = await verifyEscrowStateOnChain(jobId, contract.employerAddress);
    if (!stateVerification.completed) {
      return NextResponse.json(
        { error: `Trạng thái escrow on-chain chưa phải COMPLETED: ${stateVerification.error || `status=${stateVerification.status}`}.` },
        { status: 400 }
      );
    }

    const [updatedContract, updatedJob] = await prisma.$transaction(async (tx) => {
      const c = await tx.contract.update({
        where: { jobId },
        data: {
          status: "COMPLETED",
          txHash: releaseTxHash
        }
      });

      const j = await tx.job.update({
        where: { id: jobId },
        data: { status: "COMPLETED" }
      });

      if (contract.freelancerAddress && contract.freelancerAddress.toLowerCase() !== ZERO_ADDRESS) {
        await tx.user.update({
          where: { walletAddress: contract.freelancerAddress.toLowerCase() },
          data: { totalEarned: { increment: contract.totalAmount } }
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
