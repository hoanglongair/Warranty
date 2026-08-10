import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const { freelancerAddress, clientAddress, proposalBid, tokenSymbol, txHash, status } = body;

    if (!freelancerAddress || !clientAddress) {
      return NextResponse.json({ error: "Thiếu địa chỉ ví Bên A hoặc Bên B." }, { status: 400 });
    }

    const clientAddrLower = clientAddress.toLowerCase();
    const freelancerAddrLower = freelancerAddress.toLowerCase();

    // Ensure Client & Freelancer users exist in DB
    await prisma.user.upsert({
      where: { walletAddress: clientAddrLower },
      update: {},
      create: { walletAddress: clientAddrLower, role: "CLIENT", name: `Client ${clientAddrLower.slice(0, 6)}...` }
    });

    await prisma.user.upsert({
      where: { walletAddress: freelancerAddrLower },
      update: {},
      create: { walletAddress: freelancerAddrLower, role: "FREELANCER", name: `Freelancer ${freelancerAddrLower.slice(0, 6)}...` }
    });

    // Update job status to IN_PROGRESS
    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status: "IN_PROGRESS" }
    });

    // Accept selected proposal
    await prisma.application.updateMany({
      where: { jobId, freelancerAddress: freelancerAddrLower },
      data: { status: "ACCEPTED" }
    });

    // Create or update contract
    const contract = await prisma.contract.upsert({
      where: { jobId },
      update: {
        clientAddress: clientAddrLower,
        freelancerAddress: freelancerAddrLower,
        totalAmount: Number(proposalBid || updatedJob.budget),
        tokenSymbol: tokenSymbol || updatedJob.tokenSymbol || "ETH",
        status: status || "FUNDED",
        txHash: txHash || `0xmock_escrow_${Date.now()}`
      },
      create: {
        jobId,
        clientAddress: clientAddrLower,
        freelancerAddress: freelancerAddrLower,
        totalAmount: Number(proposalBid || updatedJob.budget),
        tokenSymbol: tokenSymbol || updatedJob.tokenSymbol || "ETH",
        status: status || "FUNDED",
        txHash: txHash || `0xmock_escrow_${Date.now()}`
      }
    });

    return NextResponse.json({ success: true, job: updatedJob, contract });
  } catch (error) {
    console.error("Hire freelancer & contract error:", error);
    return NextResponse.json({ error: "Lỗi không thể khởi tạo hợp đồng Escrow." }, { status: 500 });
  }
}
