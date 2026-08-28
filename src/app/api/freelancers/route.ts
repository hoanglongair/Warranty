import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    const whereClause: Record<string, unknown> = {
      role: { in: ["FREELANCER"] }
    };

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
        { skills: { hasSome: [search] } }
      ];
    }

    const freelancers = await prisma.user.findMany({
      where: whereClause,
      orderBy: { rating: "desc" }
    });

    const formatted = freelancers.map((f) => ({
      id: f.walletAddress,
      name: f.name || `Freelancer ${f.walletAddress.slice(0, 6)}...`,
      role: f.bio || "Web3 Developer & Specialist",
      avatar: f.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${f.walletAddress}`,
      rating: f.rating || 5.0,
      reviewsCount: 12,
      hourlyRate: 85,
      totalEarned: f.totalEarned || 15000,
      successRate: 98,
      location: "Remote",
      skills: f.skills && f.skills.length > 0 ? f.skills : ["Web3", "Smart Contracts", "React"],
      verified: true,
      bio: f.bio || "Chuyên gia phát triển ứng dụng Web3 và Smart Contract Escrow."
    }));

    return NextResponse.json({ success: true, freelancers: formatted });
  } catch (error) {
    console.error("Get freelancers error:", error);
    return NextResponse.json({ error: "Không thể lấy danh sách Freelancers." }, { status: 500 });
  }
}
