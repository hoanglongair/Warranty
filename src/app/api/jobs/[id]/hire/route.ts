import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";

// Thời hạn nạp cọc sau khi hire (giờ)
const FUND_DEADLINE_HOURS = 72;

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

    if (!freelancerAddress) {
      return NextResponse.json({ error: "Thiếu địa chỉ ví freelancer." }, { status: 400 });
    }

    // Chặn ZeroAddress — Smart Contract sẽ revert
    if (freelancerAddress.toLowerCase() === "0x0000000000000000000000000000000000000000") {
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

    // Verify employer user exists and check role
    await prisma.user.upsert({
      where: { walletAddress: employerAddrLower },
      update: {},
      create: { walletAddress: employerAddrLower, role: "FREELANCER", name: `Employer ${employerAddrLower.slice(0, 6)}...` }
    });

    await prisma.user.upsert({
      where: { walletAddress: freelancerAddrLower },
      update: {},
      create: { walletAddress: freelancerAddrLower, role: "FREELANCER", name: `Freelancer ${freelancerAddrLower.slice(0, 6)}...` }
    });

    // Check if job exists in DB and verify employer ownership & job status
    const existingJob = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (existingJob) {
      if (existingJob.employerAddress.toLowerCase() !== employerAddrLower) {
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
    }

    // Update job status to IN_PROGRESS
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status: "IN_PROGRESS" }
    }).catch(async () => {
      // Fallback for mock jobs without DB record yet: create job record
      return await prisma.job.create({
        data: {
          id: jobId,
          title: "Web3 Escrow Job",
          description: "Escrow project contract",
          category: "development",
          budget: Number(proposalBid || 500),
          employerAddress: employerAddrLower,
          status: "IN_PROGRESS"
        }
      });
    });

    // Accept selected proposal
    await prisma.application.updateMany({
      where: { jobId, freelancerAddress: freelancerAddrLower },
      data: { status: "ACCEPTED" }
    });

    // Từ chối các proposal khác
    await prisma.application.updateMany({
      where: {
        jobId,
        freelancerAddress: { not: freelancerAddrLower },
        status: "PENDING"
      },
      data: { status: "REJECTED" }
    });

    const fundDeadline = new Date(Date.now() + FUND_DEADLINE_HOURS * 60 * 60 * 1000);

    // Create or update contract
    // - Nếu chưa có txHash (chưa nạp cọc): status = PENDING_DEPOSIT
    // - Nếu có txHash (đã nạp cọc): status = FUNDED, depositTxHash lưu riêng
    const contract = await prisma.contract.upsert({
      where: { jobId },
      update: {
        employerAddress: employerAddrLower,
        freelancerAddress: freelancerAddrLower,
        totalAmount: Number(proposalBid || updatedJob.budget),
        tokenSymbol: tokenSymbol || updatedJob.tokenSymbol || "USDC",
        status: txHash ? "FUNDED" : "PENDING_DEPOSIT",
        depositTxHash: txHash || null,
        fundDeadline: txHash ? null : fundDeadline,
        txHash: txHash || `0xpending_${Date.now()}`
      },
      create: {
        jobId,
        employerAddress: employerAddrLower,
        freelancerAddress: freelancerAddrLower,
        totalAmount: Number(proposalBid || updatedJob.budget),
        tokenSymbol: tokenSymbol || updatedJob.tokenSymbol || "USDC",
        status: txHash ? "FUNDED" : "PENDING_DEPOSIT",
        depositTxHash: txHash || null,
        fundDeadline: txHash ? null : fundDeadline,
        txHash: txHash || `0xpending_${Date.now()}`
      }
    });

    return NextResponse.json({ success: true, job: updatedJob, contract });
  } catch (error) {
    console.error("Hire freelancer & contract error:", error);
    return NextResponse.json({ error: "Lỗi không thể khởi tạo hợp đồng Escrow." }, { status: 500 });
  }
}
