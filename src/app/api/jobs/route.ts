import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jobs as JOBS_DATA } from "@/data/jobs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const whereClause: Record<string, unknown> = {};

    if (category && category.toLowerCase() !== "all") {
      whereClause.category = { equals: category, mode: "insensitive" };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    const jobs = await prisma.job.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      include: { client: true, applications: true }
    });

  // Gộp dữ liệu thật từ CSDL với Dữ liệu Mock để giao diện luôn đông đúc sinh động cho demo
    const formattedDbJobs = (jobs || []).map((j: any) => ({
      id: j.id,
      title: j.title,
      description: j.description,
      category: j.category,
      budget: j.budget,
      budgetType: j.budgetType || "fixed",
      tokenSymbol: j.tokenSymbol || "ETH",
      clientAddress: j.clientAddress,
      skills: j.skills || [],
      requirements: j.requirements && j.requirements.length > 0 ? j.requirements : [
        "Kinh nghiệm làm việc Web3 / Software Development",
        "Giao tiếp tốt và bàn giao công việc đúng thời hạn",
        "Cam kết hoàn thành theo yêu cầu mô tả dự án"
      ],
      deliverables: j.deliverables && j.deliverables.length > 0 ? j.deliverables : [
        "Mã nguồn dự án hoàn chỉnh",
        "Báo cáo hoặc tài liệu hướng dẫn bàn giao"
      ],
      deadline: j.deadline || "1-2 weeks",
      experience: "intermediate",
      location: j.location || "remote",
      postedAt: j.createdAt ? j.createdAt.toISOString() : new Date().toISOString(),
      applicants: j.applications ? j.applications.length : 0,
      employer: {
        id: j.client?.id || "client-1",
        name: j.client?.name || `User ${j.clientAddress.slice(0, 6)}...`,
        avatar: j.client?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${j.clientAddress}`,
        rating: j.client?.rating || 5.0,
        jobsPosted: 1,
        verified: true
      }
    }));

    // Lọc bỏ những bài mock trùng id với DB nếu có
    const dbJobIds = new Set(formattedDbJobs.map((j) => j.id));
    const remainingMocks = JOBS_DATA.filter((m) => !dbJobIds.has(m.id));

    const combinedJobs = [...formattedDbJobs, ...remainingMocks];

    return NextResponse.json({ jobs: combinedJobs, source: "combined" });
  } catch (error) {
    console.warn("DB query warning (Fallback to mock data):", error);
    return NextResponse.json({ jobs: JOBS_DATA, source: "mock_fallback" });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, budget, budgetType, tokenSymbol, clientAddress, skills, requirements, deliverables, deadline, location } = body;

    if (!title || !description || !category || !budget || !clientAddress) {
      return NextResponse.json({ error: "Thiếu các thông tin bắt buộc của bài đăng." }, { status: 400 });
    }

    // Đảm bảo client user tồn tại
    await prisma.user.upsert({
      where: { walletAddress: clientAddress.toLowerCase() },
      update: {},
      create: {
        walletAddress: clientAddress.toLowerCase(),
        name: `User ${clientAddress.slice(0, 6)}...`
      }
    });

    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        category,
        budget: Number(budget),
        budgetType: budgetType || "fixed",
        tokenSymbol: tokenSymbol || "ETH",
        clientAddress: clientAddress.toLowerCase(),
        skills: Array.isArray(skills) ? skills : [],
        requirements: Array.isArray(requirements) ? requirements : [],
        deliverables: Array.isArray(deliverables) ? deliverables : [],
        deadline: deadline || "14 days",
        location: location || "Remote"
      } as any
    });

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    console.error("Create job error:", error);
    return NextResponse.json({ error: "Không thể khởi tạo công việc vào CSDL." }, { status: 500 });
  }
}
