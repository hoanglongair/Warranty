import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, verifyOwnership } from "@/lib/auth-guard";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dbJob = await prisma.job.findUnique({
      where: { id },
      include: {
        employer: true,
        applications: {
          include: { freelancer: true },
          orderBy: { createdAt: "desc" }
        },
        contract: true
      }
    });

    if (dbJob) {
      const formattedJob = {
        id: dbJob.id,
        title: dbJob.title,
        description: dbJob.description,
        longDescription: dbJob.description,
        category: dbJob.category,
        subcategory: dbJob.category,
        budget: dbJob.budget,
        budgetType: dbJob.budgetType || "fixed",
        tokenSymbol: dbJob.tokenSymbol || "USDC",
        skills: dbJob.skills || [],
        experience: "intermediate",
        duration: dbJob.deadline || "1-2 weeks",
        type: dbJob.location || "remote",
        status: dbJob.status || "open",
        deadline: dbJob.deadline || "2026-12-31",
        postedAt: dbJob.createdAt ? dbJob.createdAt.toISOString() : new Date().toISOString(),
        applicants: dbJob.applications ? dbJob.applications.length : 0,
        applications: dbJob.applications || [],
        proposals: dbJob.applications || [],
        employer: {
          id: dbJob.employer?.walletAddress || "employer-1",
          name: dbJob.employer?.name || `User ${dbJob.employerAddress.slice(0, 6)}...`,
          avatar: dbJob.employer?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${dbJob.employerAddress}`,
          walletAddress: dbJob.employerAddress,
          rating: dbJob.employer?.rating || 5.0,
          reviews: 12,
          jobsPosted: 1,
          totalSpent: dbJob.budget,
          memberSince: "Mar 2024",
          verified: true,
          company: "Decentralized Employer",
          location: dbJob.location || "Global"
        },
        requirements: (dbJob as any).requirements && (dbJob as any).requirements.length > 0
          ? (dbJob as any).requirements
          : [
              "Kinh nghiệm làm việc Web3 / Software Development",
              "Giao tiếp tốt và bàn giao công việc đúng thời hạn",
              "Cam kết hoàn thành theo yêu cầu mô tả dự án"
            ],
        deliverables: (dbJob as any).deliverables && (dbJob as any).deliverables.length > 0
          ? (dbJob as any).deliverables
          : [
              "Mã nguồn dự án hoàn chỉnh",
              "Báo cáo hoặc tài liệu hướng dẫn bàn giao"
            ],
        contract: dbJob.contract
      };

      return NextResponse.json({ job: formattedJob, source: "database" });
    }

    return NextResponse.json({ error: "Không tìm thấy công việc." }, { status: 404 });
  } catch (error) {
    console.error("Get job details error:", error);
    return NextResponse.json({ error: "Lỗi tải thông tin chi tiết công việc." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để xoá công việc." }, { status: 401 });
    }

    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      return NextResponse.json({ error: "Công việc không tồn tại." }, { status: 404 });
    }

    const ownershipCheck = verifyOwnership(session, job.employerAddress);
    if (!ownershipCheck.isOwner && ownershipCheck.errorResponse) {
      return ownershipCheck.errorResponse;
    }

    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Đã xoá bài đăng công việc thành công." });
  } catch (error) {
    console.error("Delete job error:", error);
    return NextResponse.json({ error: "Không thể xoá công việc." }, { status: 500 });
  }
}
