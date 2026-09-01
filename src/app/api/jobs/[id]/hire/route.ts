import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";
import { verifyEscrowStateOnChain } from "@/lib/escrow-verify";

// Thời hạn nạp cọc sau khi hire (giờ)
const FUND_DEADLINE_HOURS = 72;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const { freelancerAddress, proposalBid, tokenSymbol, txHash } = body;

    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để thuê freelancer." }, { status: 401 });
    }

    const role = session.role.toUpperCase();
    if (role !== "EMPLOYER" && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Chỉ tài khoản Employer mới có quyền thuê freelancer." },
        { status: 403 }
      );
    }

    if (!freelancerAddress || typeof freelancerAddress !== "string") {
      return NextResponse.json({ error: "Thiếu địa chỉ ví freelancer." }, { status: 400 });
    }

    if (freelancerAddress.toLowerCase() === ZERO_ADDRESS) {
      return NextResponse.json(
        { error: "Địa chỉ ví freelancer không hợp lệ (ZeroAddress)." },
        { status: 400 }
      );
    }

    const employerAddrLower = session.walletAddress.toLowerCase();
    const freelancerAddrLower = freelancerAddress.toLowerCase();

    if (employerAddrLower === freelancerAddrLower) {
      return NextResponse.json(
        { error: "Bạn không thể tự thuê chính mình làm freelancer." },
        { status: 400 }
      );
    }

    // Job BẮT BUỘC phải tồn tại — không tạo job "ma".
    const existingJob = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existingJob) {
      return NextResponse.json({ error: "Không tìm thấy bài đăng công việc." }, { status: 404 });
    }

    if (existingJob.employerAddress.toLowerCase() !== employerAddrLower && role !== "ADMIN") {
      return NextResponse.json(
        { error: "Chỉ người đăng tuyển dự án này mới có quyền chọn thuê Freelancer." },
        { status: 403 }
      );
    }

    if (existingJob.status !== "OPEN") {
      return NextResponse.json(
        { error: `Công việc này không ở trạng thái mở tuyển dụng (hiện tại: ${existingJob.status}).` },
        { status: 400 }
      );
    }

    // Freelancer phải đã ứng tuyển job này
    const application = await prisma.application.findFirst({
      where: { jobId, freelancerAddress: freelancerAddrLower }
    });
    if (!application) {
      return NextResponse.json(
        { error: "Freelancer này chưa ứng tuyển dự án — không thể chọn thuê." },
        { status: 400 }
      );
    }

    const totalAmount = Number(proposalBid || application.proposalBid || existingJob.budget);
    const finalTokenSymbol = tokenSymbol || existingJob.tokenSymbol || "USDC";

    // Nếu client báo đã nạp cọc on-chain (txHash), xác minh trạng thái escrow thật sự
    // trước khi đánh dấu FUNDED. KHÔNG tin txHash một cách mù quáng.
    let contractStatus: "PENDING_DEPOSIT" | "FUNDED" = "PENDING_DEPOSIT";
    let depositTxHash: string | null = null;

    if (txHash && typeof txHash === "string" && txHash.startsWith("0x") && txHash.length === 66) {
      const onChain = await verifyEscrowStateOnChain(jobId, employerAddrLower);
      if (!onChain.funded) {
        return NextResponse.json(
          {
            error: `Không xác minh được escrow đã được nạp cọc on-chain: ${onChain.error || "escrow chưa ở trạng thái FUNDED"}.`
          },
          { status: 400 }
        );
      }
      if (
        onChain.freelancer &&
        onChain.freelancer.toLowerCase() !== freelancerAddrLower
      ) {
        return NextResponse.json(
          { error: "Địa chỉ freelancer trong escrow on-chain không khớp." },
          { status: 400 }
        );
      }
      contractStatus = "FUNDED";
      depositTxHash = txHash;
    }

    const fundDeadline =
      contractStatus === "FUNDED"
        ? null
        : new Date(Date.now() + FUND_DEADLINE_HOURS * 60 * 60 * 1000);

    const result = await prisma.$transaction(async (tx) => {
      // Đảm bảo user tồn tại
      await tx.user.upsert({
        where: { walletAddress: freelancerAddrLower },
        update: {},
        create: {
          walletAddress: freelancerAddrLower,
          role: "FREELANCER",
          name: `Freelancer ${freelancerAddrLower.slice(0, 6)}...`
        }
      });

      const updatedJob = await tx.job.update({
        where: { id: jobId },
        data: { status: "IN_PROGRESS" }
      });

      await tx.application.updateMany({
        where: { jobId, freelancerAddress: freelancerAddrLower },
        data: { status: "ACCEPTED" }
      });

      await tx.application.updateMany({
        where: {
          jobId,
          freelancerAddress: { not: freelancerAddrLower },
          status: "PENDING"
        },
        data: { status: "REJECTED" }
      });

      const contract = await tx.contract.upsert({
        where: { jobId },
        update: {
          employerAddress: employerAddrLower,
          freelancerAddress: freelancerAddrLower,
          totalAmount,
          tokenSymbol: finalTokenSymbol,
          status: contractStatus,
          depositTxHash,
          fundDeadline
        },
        create: {
          jobId,
          employerAddress: employerAddrLower,
          freelancerAddress: freelancerAddrLower,
          totalAmount,
          tokenSymbol: finalTokenSymbol,
          status: contractStatus,
          depositTxHash,
          fundDeadline
        }
      });

      return { job: updatedJob, contract };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error("Hire freelancer & contract error:", error);
    return NextResponse.json({ error: "Lỗi không thể khởi tạo hợp đồng Escrow." }, { status: 500 });
  }
}
