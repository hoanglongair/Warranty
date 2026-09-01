import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getAuthSession, verifyOwnership } from "@/lib/auth-guard";

const profileUpdateSchema = z.object({
  name: z.string().trim().min(1).max(80).optional(),
  avatar: z.string().trim().url().max(500).optional(),
  bio: z.string().trim().max(1000).optional(),
  skills: z.array(z.string().trim().min(1).max(50)).max(30).optional(),
  email: z.string().trim().email().max(254).nullable().optional()
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ walletAddress: string }> }
) {
  try {
    const { walletAddress } = await params;
    const address = walletAddress.toLowerCase();

    const session = await getAuthSession(req);
    const isSelf = session?.walletAddress.toLowerCase() === address;
    const isAdmin = session?.role.toUpperCase() === "ADMIN";
    const canSeePrivate = isSelf || isAdmin;

    const user = await prisma.user.findUnique({
      where: { walletAddress: address },
      include: {
        postedJobs: {
          orderBy: { createdAt: "desc" }
        },
        applications: canSeePrivate
          ? {
              include: { job: true },
              orderBy: { createdAt: "desc" }
            }
          : false,
        employerRequest: canSeePrivate
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy hồ sơ người dùng." }, { status: 404 });
    }

    // Che thông tin nhạy cảm với người xem không phải chủ sở hữu / admin
    const profile = canSeePrivate
      ? user
      : { ...user, email: null };

    return NextResponse.json({ success: true, profile });
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

    const parsed = profileUpdateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dữ liệu hồ sơ không hợp lệ.", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    const { name, avatar, bio, skills, email } = parsed.data;

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
