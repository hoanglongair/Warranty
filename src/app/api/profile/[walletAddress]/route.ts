import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress } = await params;
    const address = walletAddress.toLowerCase();

    // Tự động tạo bản ghi User mới vào Neon DB nếu chưa tồn tại
    const user = await prisma.user.upsert({
      where: { walletAddress: address },
      update: {},
      create: {
        walletAddress: address,
        name: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
        bio: "Web3 Ecosystem Member & Freelancer",
        skills: ["Web3", "Smart Contracts"],
        role: "BOTH",
        rating: 5.0
      },
      include: {
        postedJobs: {
          orderBy: { createdAt: "desc" }
        },
        applications: {
          include: { job: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    return NextResponse.json({ success: true, profile: user });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Không thể lấy thông tin hồ sơ." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress } = await params;
    const address = walletAddress.toLowerCase();
    const body = await req.json();
    const { name, avatar, bio, skills, role, email } = body;

    const updatedUser = await prisma.user.upsert({
      where: { walletAddress: address },
      update: {
        ...(name && { name }),
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(skills && { skills: Array.isArray(skills) ? skills : [] }),
        ...(role && { role }),
        ...(email && { email })
      },
      create: {
        walletAddress: address,
        name: name || `User ${address.slice(0, 6)}...${address.slice(-4)}`,
        avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
        bio: bio || "",
        skills: Array.isArray(skills) ? skills : [],
        role: role || "BOTH",
        email: email || null
      }
    });

    return NextResponse.json({ success: true, profile: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Không thể cập nhật hồ sơ cá nhân vào CSDL." }, { status: 500 });
  }
}
