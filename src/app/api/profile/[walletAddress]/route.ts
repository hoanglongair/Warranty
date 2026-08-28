import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession, verifyOwnership } from "@/lib/auth-guard";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress } = await params;
    const address = walletAddress.toLowerCase();

    // Tự động tạo bản ghi User mới vào CSDL nếu chưa tồn tại
    const user = await prisma.user.upsert({
      where: { walletAddress: address },
      update: {},
      create: {
        walletAddress: address,
        name: `User ${address.slice(0, 6)}...${address.slice(-4)}`,
        avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
        bio: "Web3 Ecosystem Member & Freelancer",
        skills: ["Web3", "Smart Contracts"],
        role: "FREELANCER",
        rating: 5.0
      },
      include: {
        postedJobs: {
          orderBy: { createdAt: "desc" }
        },
        applications: {
          include: { job: true },
          orderBy: { createdAt: "desc" }
        },
        employerRequest: true
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

    // Enforce JWT Session & Ownership Verification
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập ví để cập nhật hồ sơ cá nhân." }, { status: 401 });
    }

    const ownershipCheck = verifyOwnership(session, address);
    if (!ownershipCheck.isOwner && ownershipCheck.errorResponse) {
      return ownershipCheck.errorResponse;
    }

    const body = await req.json();
    const { name, avatar, bio, skills, email } = body;

    const updatedUser = await prisma.user.upsert({
      where: { walletAddress: address },
      update: {
        ...(name && { name }),
        ...(avatar && { avatar }),
        ...(bio && { bio }),
        ...(skills && { skills: Array.isArray(skills) ? skills : [] }),
        ...(email !== undefined && { email })
      },
      create: {
        walletAddress: address,
        name: name || `User ${address.slice(0, 6)}...${address.slice(-4)}`,
        avatar: avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${address}`,
        bio: bio || "",
        skills: Array.isArray(skills) ? skills : [],
        role: "FREELANCER",
        email: email || null
      },
      include: {
        employerRequest: true
      }
    });

    return NextResponse.json({ success: true, profile: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Không thể cập nhật hồ sơ cá nhân vào CSDL." }, { status: 500 });
  }
}
