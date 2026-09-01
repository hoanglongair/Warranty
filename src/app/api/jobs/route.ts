import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const status = (searchParams.get("status") || "OPEN").toUpperCase();
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};

    // Mặc định marketplace chỉ hiển thị job đang mở tuyển; truyền ?status=all để lấy hết
    if (status !== "ALL") {
      whereClause.status = ["OPEN", "IN_PROGRESS", "COMPLETED", "CANCELLED"].includes(status)
        ? status
        : "OPEN";
    }

    if (category && category.toLowerCase() !== "all") {
      whereClause.category = { equals: category, mode: "insensitive" };
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      ];
    }

    const [jobs, totalJobs] = await Promise.all([
      prisma.job.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: skip,
        include: {
          employer: true,
          applications: {
            include: { freelancer: true },
            orderBy: { createdAt: "desc" }
          }
        }
      }),
      prisma.job.count({ where: whereClause })
    ]);

    const formattedDbJobs = (jobs || []).map((j: any) => ({
      id: j.id,
      title: j.title,
      description: j.description,
      category: j.category,
      budget: j.budget,
      budgetType: j.budgetType || "fixed",
      tokenSymbol: j.tokenSymbol || "USDC",
      employerAddress: j.employerAddress,
      clientAddress: j.employerAddress, // Backward compatibility alias
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
      applications: j.applications || [],
      employer: {
        id: j.employer?.walletAddress || j.employerAddress,
        name: j.employer?.name || `User ${j.employerAddress.slice(0, 6)}...`,
        avatar: j.employer?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${j.employerAddress}`,
        walletAddress: j.employerAddress,
        rating: j.client?.rating || 5.0,
        jobsPosted: 1,
        verified: true
      }
    }));

    return NextResponse.json({
      jobs: formattedDbJobs,
      pagination: { page, limit, total: totalJobs, totalPages: Math.ceil(totalJobs / limit) },
      source: "database"
    });
  } catch (error) {
    console.error("DB query error in GET /api/jobs:", error);
    return NextResponse.json({ jobs: [], error: "Không thể kết nối CSDL." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, category, budget, budgetType, tokenSymbol, skills, requirements, deliverables, deadline, location } = body;

    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập để đăng bài tuyển dụng." }, { status: 401 });
    }

    const employerAddress = session.walletAddress;

    if (!title || !description || !category || !budget || !employerAddress) {
      return NextResponse.json({ error: "Thiếu các thông tin bắt buộc của bài đăng." }, { status: 400 });
    }

    if (Number(budget) <= 0) {
      return NextResponse.json({ error: "Ngân sách bài đăng phải lớn hơn 0." }, { status: 400 });
    }

    const employerAddrLower = employerAddress.toLowerCase();

    // Đảm bảo employer user tồn tại & kiểm tra role
    const user = await prisma.user.upsert({
      where: { walletAddress: employerAddrLower },
      update: {},
      create: {
        walletAddress: employerAddrLower,
        role: "FREELANCER",
        name: `User ${employerAddrLower.slice(0, 6)}...`
      }
    });

    if (user.role !== "EMPLOYER" && user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Tài khoản của bạn hiện là Freelancer. Vui lòng gửi yêu cầu nâng cấp thành Employer và chờ Admin phê duyệt để có thể đăng tuyển công việc." },
        { status: 403 }
      );
    }

    // Luồng chuẩn: Tạo Job ở trạng thái OPEN, KHÔNG tạo Contract.
    // Tiền cọc Escrow sẽ được nạp vào Smart Contract SAU khi Employer chọn được freelancer
    // và nhấn "Nạp cọc" trên trang chi tiết công việc.
    const newJob = await prisma.job.create({
      data: {
        title,
        description,
        category,
        budget: Number(budget),
        budgetType: budgetType || "fixed",
        tokenSymbol: tokenSymbol || "USDC",
        status: "OPEN",
        employerAddress: employerAddrLower,
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
