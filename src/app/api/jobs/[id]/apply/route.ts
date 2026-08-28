import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: jobId } = await params;
    const body = await req.json();
    const { proposalBid, coverLetter, estimatedDays } = body;

    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập ví để nộp đơn ứng tuyển." }, { status: 401 });
    }

    const walletAddress = session.walletAddress.toLowerCase();

    if (!proposalBid || !coverLetter) {
      return NextResponse.json({ error: "Vui lòng nhập đầy đủ giá đề xuất và thư giới thiệu." }, { status: 400 });
    }

    if (Number(proposalBid) <= 0) {
      return NextResponse.json({ error: "Giá đề xuất chào thầu phải lớn hơn 0." }, { status: 400 });
    }

    // 1. Kiểm tra Job có tồn tại và ngăn Employer tự ứng tuyển dự án của chính mình
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return NextResponse.json({ error: "Không tìm thấy bài đăng dự án này." }, { status: 404 });
    }

    if (job.employerAddress.toLowerCase() === walletAddress) {
      return NextResponse.json(
        { error: "Bạn là chủ bài đăng dự án này (Employer). Không thể tự ứng tuyển bài đăng của chính mình." },
        { status: 400 }
      );
    }

    // 2. Check duplicate application
    const existingApp = await prisma.application.findFirst({
      where: {
        jobId,
        freelancerAddress: walletAddress
      }
    });

    if (existingApp) {
      return NextResponse.json(
        { error: "Bạn đã gửi ứng tuyển cho dự án này rồi. Không thể gửi trùng lặp." },
        { status: 400 }
      );
    }

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
