import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Enforce authentication AND role check (FREELANCER or ADMIN)
    const authResult = await requireRole(req, ["FREELANCER", "ADMIN"]);
    if ("errorResponse" in authResult) {
      return authResult.errorResponse;
    }

    const { session } = authResult;
    const freelancerAddress = session.walletAddress.toLowerCase();

    // Query freelancer user profile
    const freelancerUser = await prisma.user.findUnique({
      where: { walletAddress: freelancerAddress }
    });

    // Query applications submitted by freelancer
    const applications = await prisma.application.findMany({
      where: { freelancerAddress },
      include: {
        job: {
          include: {
            employer: {
              select: {
                walletAddress: true,
                name: true,
                avatar: true,
                rating: true
              }
            },
            contract: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Query contracts assigned to freelancer
    const contracts = await prisma.contract.findMany({
      where: { freelancerAddress },
      include: {
        job: true,
        employer: {
          select: {
            name: true,
            walletAddress: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Main Metrics
    const totalProposalsSent = applications.length;
    const activeContracts = contracts.filter((c) => c.status === "FUNDED" || c.status === "IN_PROGRESS").length;
    const completedContracts = contracts.filter((c) => c.status === "COMPLETED").length;
    const totalEarned = contracts
      .filter((c) => c.status === "COMPLETED")
      .reduce((sum, c) => sum + c.totalAmount, 0);

    // Earnings Growth (% comparison vs last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const recentEarned = contracts
      .filter((c) => c.status === "COMPLETED" && new Date(c.updatedAt) >= thirtyDaysAgo)
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const previousEarned = contracts
      .filter((c) => {
        const d = new Date(c.updatedAt);
        return c.status === "COMPLETED" && d >= sixtyDaysAgo && d < thirtyDaysAgo;
      })
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const earningsGrowthPct = previousEarned > 0 
      ? Math.round(((recentEarned - previousEarned) / previousEarned) * 100)
      : recentEarned > 0 ? 100 : 0;

    // Escrow Breakdown
    const activeEscrowAmount = contracts
      .filter((c) => c.status === "FUNDED" || c.status === "IN_PROGRESS")
      .reduce((sum, c) => sum + c.totalAmount, 0);

    const releasedAmount = totalEarned;

    const pendingProposalsAmount = applications
      .filter((a) => a.status === "PENDING")
      .reduce((sum, a) => sum + a.proposalBid, 0);

    const escrowBreakdown = [
      { name: "Đã giải ngân về ví", value: releasedAmount, color: "#10b981" },
      { name: "Đang khoá trong Escrow", value: activeEscrowAmount, color: "#06b6d4" },
      { name: "Đề xuất đang chờ duyệt", value: pendingProposalsAmount, color: "#f59e0b" }
    ];

    // Time-Series Chart Data (Last 7 Days)
    const timeSeriesData = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toLocaleDateString("vi-VN", { month: "numeric", day: "numeric" });
      const dayStart = new Date(d.setHours(0, 0, 0, 0));
      const dayEnd = new Date(d.setHours(23, 59, 59, 999));

      const dayProposals = applications.filter((a) => {
        const t = new Date(a.createdAt);
        return t >= dayStart && t <= dayEnd;
      }).length;

      const dayEarnings = contracts
        .filter((c) => {
          const t = new Date(c.updatedAt);
          return c.status === "COMPLETED" && t >= dayStart && t <= dayEnd;
        })
        .reduce((sum, c) => sum + c.totalAmount, 0);

      return {
        date: dateStr,
        proposals: dayProposals,
        earnings: dayEarnings
      };
    });

    // Recent Activity Feed
    const recentActivity: Array<{ id: string; type: string; title: string; subtitle: string; time: string }> = [];

    applications.slice(0, 5).forEach((app) => {
      recentActivity.push({
        id: `act-app-${app.id}`,
        type: "proposal",
        title: `Đã gửi đề xuất cho công việc "${app.job?.title || app.jobId}"`,
        subtitle: `Giá thầu: $${app.proposalBid} (${app.status})`,
        time: new Date(app.createdAt).toISOString()
      });
    });

    contracts.slice(0, 5).forEach((c) => {
      recentActivity.push({
        id: `act-contract-${c.id}`,
        type: "contract",
        title: `Hợp đồng "${c.job?.title || c.jobId}" ${c.status === "COMPLETED" ? "đã được thanh toán" : "đã đặt cọc Escrow"}`,
        subtitle: `Số tiền $${c.totalAmount} ${c.tokenSymbol}`,
        time: new Date(c.updatedAt).toISOString()
      });
    });

    recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    // Trust Block
    const trustBlock = {
      rating: freelancerUser?.rating || 5.0,
      completedJobs: completedContracts,
      totalEarned: freelancerUser?.totalEarned || totalEarned,
      verifiedWallet: true,
      skills: freelancerUser?.skills || ["Solidity", "React", "Next.js", "Web3.js"]
    };

    return NextResponse.json({
      success: true,
      metrics: {
        totalProposalsSent,
        activeContracts,
        completedContracts,
        totalEarned,
        earningsGrowthPct
      },
      timeSeriesData,
      escrowBreakdown,
      recentActivity: recentActivity.slice(0, 10),
      trustBlock,
      applications
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("GET /api/dashboard/freelancer error:", error);
    return NextResponse.json(
      { error: `Lỗi xử lý API Dashboard Freelancer: ${message}` },
      { status: 500 }
    );
  }
}
