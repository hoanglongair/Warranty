import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const { freelancerAddress, proposalBid, coverLetter, estimatedDays } = body;

    if (!freelancerAddress || !proposalBid || !coverLetter) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ giá đề xuất và thư giới thiệu." }, { status: 400 });
    }

    const walletAddress = freelancerAddress.toLowerCase();

    // Đảm bảo Freelancer User tồn tại trong CSDL
    await prisma.user.upsert({
      where: { walletAddress },
      update: {},
      create: {
        walletAddress,
        role: "FREELANCER",
        name: `Freelancer ${walletAddress.slice(0, 6)}...`
      }
    });

    const application = await prisma.application.create({
      data: {
        jobId,
        freelancerAddress: walletAddress,
        proposalBid: Number(proposalBid),
        coverLetter,
        estimatedDays: Number(estimatedDays || 7)
      }
    });

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Apply to job error:", error);
    return NextResponse.json({ error: "Không thể gửi đơn ứng tuyển vào CSDL." }, { status: 500 });
  }
}
