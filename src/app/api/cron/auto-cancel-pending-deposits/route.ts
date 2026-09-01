import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * Cron endpoint: Tự động hủy các hợp đồng PENDING_DEPOSIT đã quá hạn nạp cọc.
 *
 * Quy ước gọi: Mỗi giờ 1 lần, hoặc có thể chạy thủ công qua cron service
 * (VD: Vercel Cron, GitHub Actions, easycron.com, cron-job.org).
 *
 * Authorization: Header `x-cron-secret` phải trùng với env `CRON_SECRET`
 * để tránh bị abuse từ bên ngoài.
 *
 * Hành vi:
 * 1. Tìm tất cả Contract có status = PENDING_DEPOSIT và fundDeadline < now
 * 2. Với mỗi contract:
 *    - Contract.status = CANCELLED, cancelledReason = "Employer không nạp cọc trong thời hạn"
 *    - Job.status = OPEN (mở lại marketplace)
 *    - Application(ACCEPTED) -> REJECTED (để freelancer biết)
 *
 * Lưu ý: Hàm này KHÔNG hoàn lại tiền vì escrow chưa được funded on-chain.
 */
export async function POST(req: NextRequest) {
  try {
    // Mandatory secret verification — luôn bắt buộc, kể cả môi trường dev
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
      return NextResponse.json(
        { error: "LỖI BẢO MẬT: Biến môi trường CRON_SECRET chưa được cấu hình trên server." },
        { status: 500 }
      );
    }

    const providedHeader = req.headers.get("x-cron-secret");
    const authHeader = req.headers.get("authorization");
    const providedToken = providedHeader || (authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null);
    if (providedToken !== cronSecret) {
      return NextResponse.json(
        { error: "Unauthorized: Mã xác thực Cron Secret không hợp lệ." },
        { status: 401 }
      );
    }

    const now = new Date();

    const expiredContracts = await prisma.contract.findMany({
      where: {
        status: "PENDING_DEPOSIT",
        fundDeadline: { lt: now }
      },
      include: {
        job: true,
      }
    });

    if (expiredContracts.length === 0) {
      return NextResponse.json({
        success: true,
        cancelled: 0,
        message: "Không có hợp đồng nào quá hạn nạp cọc."
      });
    }

    const cancelledJobs: string[] = [];

    for (const contract of expiredContracts) {
      try {
        await prisma.$transaction([
          prisma.contract.update({
            where: { id: contract.id },
            data: {
              status: "CANCELLED",
              cancelledReason: "Employer không nạp cọc trong thời hạn quy định (72 giờ).",
              fundDeadline: null,
            }
          }),
          prisma.job.update({
            where: { id: contract.jobId },
            data: { status: "OPEN" }
          }),
          prisma.application.updateMany({
            where: {
              jobId: contract.jobId,
              status: "ACCEPTED"
            },
            data: { status: "REJECTED" }
          }),
          // (Optional) Gửi notification cho freelancer ở đây
        ]);
        cancelledJobs.push(contract.jobId);
      } catch (err) {
        console.error(`Failed to cancel contract ${contract.id}:`, err);
      }
    }

    console.log(`[CRON] Auto-cancelled ${cancelledJobs.length} expired contracts:`, cancelledJobs);

    return NextResponse.json({
      success: true,
      cancelled: cancelledJobs.length,
      jobIds: cancelledJobs,
      message: `Đã tự động hủy ${cancelledJobs.length} hợp đồng quá hạn nạp cọc.`
    });
  } catch (error) {
    console.error("Cron auto-cancel error:", error);
    return NextResponse.json(
      { error: "Lỗi khi chạy cron auto-cancel." },
      { status: 500 }
    );
  }
}

// GET cũng yêu cầu CRON_SECRET (một số cron service chỉ gửi GET)
export async function GET(req: NextRequest) {
  return POST(req);
}
