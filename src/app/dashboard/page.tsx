"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Briefcase, ShieldAlert, ArrowRight, ShieldCheck, Lock, UserCheck
} from "lucide-react";
import { useWalletStore } from "@/store/wallet-store";
import { WalletButton } from "@/components/wallet/wallet-button";
import { checkAuthStatus } from "@/lib/siwe-auth";

export default function DashboardPage() {
  const { connected, address } = useWalletStore();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    checkAuthStatus().then((user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserRole(user.role || "FREELANCER");
      } else {
        setIsAuthenticated(false);
      }
    });
  }, [connected, address]);

  if (isAuthenticated === null) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent" />
        <p className="mt-4 text-sm text-white/60">Đang kiểm tra xác thực phiên làm việc SIWE...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 border border-violet-500/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-400 border border-violet-500/30 mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
            Yêu Cầu Xác Thực Ví (SIWE Authentication)
          </h1>
          <p className="mt-3 text-base text-white/60 max-w-xl mx-auto">
            Bạn chưa ký xác thực ví hoặc chưa đăng nhập vào hệ thống Warranty. Để bảo mật dữ liệu và quyền sở hữu dự án Escrow, vui lòng kết nối ví và hoàn tất ký chữ ký SIWE.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <WalletButton />
            <Link href="/marketplace" className="btn-secondary px-5 py-3 text-sm">
              Khám Phá Dự Án Công Khai
            </Link>
          </div>

          <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-left text-xs text-white/50 space-y-2">
            <div className="flex items-center gap-2 text-violet-300 font-semibold">
              <ShieldAlert className="h-4 w-4" /> Bảo Vệ 2 Lớp Cho Dashboard
            </div>
            <p>
              • <strong>Bên A (Employer):</strong> Cần xác thực để xem báo cáo tuyển dụng, danh sách ứng viên và nạp cọc Escrow.
            </p>
            <p>
              • <strong>Bên B (Freelancer):</strong> Cần xác thực để xem nơi đã ứng tuyển, tiến độ nghiệm thu và thu nhập ví.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-3">
          <UserCheck className="h-3.5 w-3.5" /> Phiên Xác Thực SIWE Hoạt Động
        </span>
        <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
          Chào Mừng Đến Với Warranty Dashboard
        </h1>
        <p className="mt-3 text-lg text-white/60 max-w-2xl mx-auto">
          Chọn trung tâm quản lý phù hợp với vai trò của bạn trên nền tảng tuyển dụng Web3 tích hợp Escrow.
        </p>
      </motion.div>

      <div className="grid gap-8 sm:grid-cols-2 max-w-4xl mx-auto">
        {/* Employer Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card hover-lift p-8 flex flex-col justify-between border border-violet-500/30">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white font-bold mb-6">
              <Briefcase className="h-7 w-7" />
            </div>
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">Role: Người Thuê (Bên A)</span>
            <h2 className="font-display text-2xl font-bold text-white mt-1">Employer Dashboard</h2>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Quản lý danh sách dự án đã đăng tuyển, theo dõi phễu ứng viên, xem biểu đồ dòng tiền Escrow và nạp cọc cho freelancer.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5">
            <Link href="/dashboard/employer" className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-3">
              Vào Employer Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Freelancer Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card hover-lift p-8 flex flex-col justify-between border border-cyan-500/30">
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white font-bold mb-6">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Role: Người Được Thuê (Bên B)</span>
            <h2 className="font-display text-2xl font-bold text-white mt-1">Freelancer Dashboard</h2>
            <p className="mt-3 text-sm text-white/60 leading-relaxed">
              Theo dõi danh sách các đơn chào thầu đã nộp, tiến độ thực hiện dự án, số dư Escrow đang khoá và thu nhập giải ngân về ví.
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5">
            <Link href="/dashboard/freelancer" className="btn-secondary w-full flex items-center justify-center gap-2 text-sm py-3 border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10">
              Vào Freelancer Dashboard <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
