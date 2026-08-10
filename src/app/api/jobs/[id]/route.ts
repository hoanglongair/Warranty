import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobs as JOBS_DATA } from "@/data/jobs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const dbJob = await prisma.job.findUnique({
      where: { id },
      include: {
        client: true,
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
        proposals: dbJob.applications || [],
        employer: {
          id: dbJob.client?.walletAddress || "client-1",
          name: dbJob.client?.name || `User ${dbJob.clientAddress.slice(0, 6)}...`,
          avatar: dbJob.client?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${dbJob.clientAddress}`,
          walletAddress: dbJob.clientAddress,
          rating: dbJob.client?.rating || 5.0,
          reviews: 12,
          jobsPosted: 1,
          totalSpent: dbJob.budget,
          memberSince: "Mar 2024",
          verified: true,
          company: "Decentralized Client",
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

    // Fallback nếu chưa có trong DB thì tìm trong Mock Data
    const mockJob = JOBS_DATA.find((j) => j.id === id);
    if (mockJob) {
      return NextResponse.json({ job: mockJob, source: "mock" });
    }

    return NextResponse.json({ error: "Không tìm thấy công việc." }, { status: 404 });
  } catch (error) {
    console.error("Get job details error:", error);
    return NextResponse.json({ error: "Lỗi tải thông tin chi tiết công việc." }, { status: 500 });
  }
}
