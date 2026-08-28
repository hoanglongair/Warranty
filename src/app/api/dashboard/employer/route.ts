import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Enforce authentication AND role check (EMPLOYER or ADMIN)
    const authResult = await requireRole(req, ["EMPLOYER", "ADMIN"]);
    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const { session } = authResult;
    const employerAddress = session.walletAddress.toLowerCase();

    // Query user profile
    const employerUser = await prisma.user.findUnique({
      where: { walletAddress: employerAddress }
    });

    // Query employer's jobs with applications & contract
    const jobs = await prisma.job.findMany({
      where: { employerAddress },
      include: {
        applications: {
          include: {
            freelancer: {
              select: {
                walletAddress: true,
                name: true,
                avatar: true,
                rating: true,
                skills: true
              }
            }
          },
          orderBy: { createdAt: "desc" }
        },
        contract: true
      },
      orderBy: { createdAt: "desc" }
    });

    // Calculate main metrics
    const totalJobsPosted = jobs.length;
    const allApplications = jobs.flatMap((j) => j.applications);
    const totalApplicants = allApplications.length;

    const hiredApplications = allApplications.filter((a) => a.status === "ACCEPTED");
    const totalHired = hiredApplications.length;

    const totalBudgetSpent = jobs.reduce((sum, j) => sum + (j.budget || 0), 0);

    // Period Comparison (% change calculation)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const jobsRecentPeriod = jobs.filter((j) => new Date(j.createdAt) >= thirtyDaysAgo).length;
    const jobsPreviousPeriod = jobs.filter((j) => {
      const d = new Date(j.createdAt);
      return d >= sixtyDaysAgo && d < thirtyDaysAgo;
    }).length;

    const jobsGrowthPct = jobsPreviousPeriod > 0 
      ? Math.round(((jobsRecentPeriod - jobsPreviousPeriod) / jobsPreviousPeriod) * 100)
      : jobsRecentPeriod > 0 ? 100 : 0;

    // Escrow Breakdown
    const contracts = await prisma.contract.findMany({
      where: { employerAddress }
    });

    const escrowLocked = contracts
      .filter((c) => c.status === "FUNDED" || c.status === "IN_PROGRESS")
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const escrowReleased = contracts
      .filter((c) => c.status === "COMPLETED")
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const escrowDisputed = contracts
      .filter((c) => c.status === "DISPUTED")
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const escrowPending = contracts
      .filter((c) => c.status === "PENDING_DEPOSIT")
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const escrowBreakdown = [
      { name: "Đang khoá Escrow", value: escrowLocked, color: "#06b6d4" },
      { name: "Đã giải ngân", value: escrowReleased, color: "#10b981" },
      { name: "Đang tranh chấp", value: escrowDisputed, color: "#ef4444" },
      { name: "Chờ nạp cọc", value: escrowPending, color: "#f59e0b" }
    ];

    // Time-Series Chart Data (Last 7 Days)
    const timeSeriesData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString("vi-VN", { month: "numeric", day: "numeric" });
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const dayJobs = jobs.filter((j) => {
        const t = new Date(j.createdAt);
        return t >= dayStart && t <= dayEnd;
      }).length;

      const dayApplicants = allApplications.filter((a) => {
        const t = new Date(a.createdAt);
        return t >= dayStart && t <= dayEnd;
      }).length;

      const dayEscrow = contracts.filter((c) => {
        const t = new Date(c.createdAt);
        return t >= dayStart && t <= dayEnd;
      }).reduce((sum, c) => sum + c.totalAmount, 0);

      return {
        date: dateStr,
        jobs: dayJobs,
        applicants: dayApplicants,
        escrow: dayEscrow
      };
    });

    // Applicant Funnel
    const funnelApplied = totalApplicants;
    const funnelReviewed = allApplications.filter((a) => a.status === "PENDING" || a.status === "ACCEPTED").length;
    const funnelHired = totalHired;
    const funnelCompleted = jobs.filter((j) => j.status === "COMPLETED").length;

    const applicantFunnel = [
      { stage: "Đã nộp hồ sơ", count: funnelApplied, percentage: 100 },
      { stage: "Đã xem hồ sơ", count: funnelReviewed, percentage: funnelApplied > 0 ? Math.round((funnelReviewed / funnelApplied) * 100) : 0 },
      { stage: "Đã nhận việc (Hired)", count: funnelHired, percentage: funnelApplied > 0 ? Math.round((funnelHired / funnelApplied) * 100) : 0 },
      { stage: "Hoàn thành dự án", count: funnelCompleted, percentage: funnelApplied > 0 ? Math.round((funnelCompleted / funnelApplied) * 100) : 0 }
    ];

    // Recent Activity Feed
    const recentActivity: Array<{ id: string; type: string; title: string; subtitle: string; time: string }> = [];

    allApplications.slice(0, 5).forEach((app) => {
      recentActivity.push({
        id: `act-app-${app.id}`,
        type: "application",
        title: `Ứng viên ${app.freelancer?.name || app.freelancerAddress.slice(0, 6)} vừa nộp hồ sơ`,
        subtitle: `Chào giá $${app.proposalBid} cho công việc "${app.jobId}"`,
        time: new Date(app.createdAt).toISOString()
      });
    });

    contracts.slice(0, 5).forEach((c) => {
      recentActivity.push({
        id: `act-contract-${c.id}`,
        type: "contract",
        title: `Hợp đồng Escrow ${c.status === "FUNDED" ? "đã khoá cọc" : c.status === "COMPLETED" ? "đã giải ngân" : "được tạo"}`,
        subtitle: `Số tiền $${c.totalAmount} ${c.tokenSymbol}`,
        time: new Date(c.updatedAt).toISOString()
      });
    });

    recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Trust Block
    const trustBlock = {
      rating: employerUser?.rating || 5.0,
      verifiedWallet: true,
      identityStatus: employerUser?.employerStatus || "NONE",
      totalJobsPosted
    };

    return NextResponse.json({
      success: true,
      metrics: {
        totalJobsPosted,
        totalApplicants,
        totalHired,
        totalBudgetSpent,
        jobsGrowthPct
      },
      timeSeriesData,
      escrowBreakdown,
      applicantFunnel,
      recentActivity: recentActivity.slice(0, 10),
      trustBlock,
      jobs
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("GET /api/dashboard/employer error:", error);
    return NextResponse.json(
      { error: `Lỗi xử lý API Dashboard Employer: ${message}` },
      { status: 500 }
    );
  }
}
