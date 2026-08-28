import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthSession } from "@/lib/auth-guard";

// Rate limit: prevent spam submissions (one request per hour per wallet)
const RATE_LIMIT_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập ví để gửi yêu cầu nâng cấp Employer." }, { status: 401 });
    }

    const body = await req.json();
    const { companyName, reason } = body;
    const addressLower = session.walletAddress.toLowerCase();

    if (!companyName || !reason) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ thông tin tên công ty/tổ chức và lý do." },
        { status: 400 }
      );
    }

    // Validate input lengths
    if (companyName.length < 2 || companyName.length > 200) {
      return NextResponse.json(
        { error: "Tên công ty phải từ 2 đến 200 ký tự." },
        { status: 400 }
      );
    }

    if (reason.length < 10 || reason.length > 1000) {
      return NextResponse.json(
        { error: "Lý do phải từ 10 đến 1000 ký tự." },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { walletAddress: addressLower }
    });

    if (!user) {
      return NextResponse.json({ error: "Không tìm thấy người dùng." }, { status: 404 });
    }

    if (user.role === "EMPLOYER" || user.role === "ADMIN") {
      return NextResponse.json(
        { error: "Tài khoản của bạn đã là Employer hoặc Admin." },
        { status: 400 }
      );
    }

    // Check for existing PENDING request
    const existingRequest = await prisma.employerRequest.findFirst({
      where: {
        walletAddress: addressLower,
        status: "PENDING"
      }
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "Bạn đã có yêu cầu đang chờ duyệt. Vui lòng chờ Admin xử lý trước khi gửi yêu cầu mới." },
        { status: 400 }
      );
    }

    // Check rate limit: reject if recent request exists (within 1 hour)
    const recentRequest = await prisma.employerRequest.findFirst({
      where: {
        walletAddress: addressLower,
        createdAt: {
          gte: new Date(Date.now() - RATE_LIMIT_MS)
        }
      },
      orderBy: { createdAt: "desc" }
    });

    if (recentRequest) {
      const waitTime = Math.ceil((RATE_LIMIT_MS - (Date.now() - recentRequest.createdAt.getTime())) / 60000);
      return NextResponse.json(
        { error: `Vui lòng đợi ${waitTime} phút trước khi gửi yêu cầu mới.` },
        { status: 429 }
      );
    }

    // Create new employer request
    const request = await prisma.employerRequest.create({
      data: {
        walletAddress: addressLower,
        companyName,
        reason,
        status: "PENDING"
      }
    });

    // Update user status to PENDING
    await prisma.user.update({
      where: { walletAddress: addressLower },
      data: { employerStatus: "PENDING" }
    });

    return NextResponse.json({
      success: true,
      message: "Đã gửi yêu cầu cấp role Employer thành công. Vui lòng chờ Admin phê duyệt.",
      request
    });
  } catch (error) {
    console.error("Employer request error:", error);
    return NextResponse.json(
      { error: "Không thể gửi yêu cầu cấp role Employer." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: "Vui lòng đăng nhập ví để xem thông tin yêu cầu." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const targetWallet = searchParams.get("walletAddress") || session.walletAddress;

    const request = await prisma.employerRequest.findUnique({
      where: { walletAddress: targetWallet.toLowerCase() },
      include: { user: true }
    });

    return NextResponse.json({ success: true, request });
  } catch (error) {
    console.error("Get employer request error:", error);
    return NextResponse.json({ error: "Không thể lấy thông tin yêu cầu." }, { status: 500 });
  }
}
