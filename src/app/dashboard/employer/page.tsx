"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, DollarSign, CheckCircle2, 
  ShieldCheck, ChevronRight, Loader2, Database,
  TrendingUp, Activity, PieChart as PieIcon, Award, UserCheck, Plus, Sparkles, Filter, Lock, ShieldAlert
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";
import { formatCurrency, formatDateSafe } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";
import { WalletButton } from "@/components/wallet/wallet-button";

export default function EmployerDashboardPage() {
  const { connected, address } = useWalletStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<{ status: number; message: string } | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string>("all");

  const fetchDashboardData = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/dashboard/employer");
      const result = await res.json();

      if (!res.ok) {
        setAuthError({
          status: res.status,
          message: result.error || "Không thể truy cập Dashboard Employer."
        });
        setData(null);
        return;
      }

      setData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch employer dashboard API:", msg);
      setAuthError({
        status: 401,
        message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn."
      });
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [address, connected]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-violet-500 border-t-transparent mb-4" />
        <p className="text-sm text-white/60">Đang kiểm tra xác thực JWT và tải dữ liệu Employer Dashboard...</p>
      </div>
    );
  }

  // 1. UNAUTHENTICATED SCREEN (401 Unauthorized)
  if (authError?.status === 401 || !connected) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 border border-violet-500/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30 mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-violet-400">Yêu Cầu Đăng Nhập Ví Web3</span>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl mt-1">
            Không Thể Truy Cập Employer Dashboard
          </h1>
          <p className="mt-3 text-sm text-white/60 max-w-xl mx-auto">
            {authError?.message || "Bạn chưa kết nối ví hoặc chưa ký xác thực SIWE. Vui lòng kết nối ví để xem báo cáo tuyển dụng và danh sách ứng viên."}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <WalletButton />
            <Link href="/dashboard" className="btn-secondary px-5 py-3 text-xs">
              Về Trang Dashboard Tổng
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. FORBIDDEN ROLE SCREEN (403 Forbidden - e.g. Freelancer trying to access Employer Dashboard)
  if (authError?.status === 403) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 border border-amber-500/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">403 Forbidden — Quyền Truy Cập Bị Từ Chối</span>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl mt-1">
            Tài Khoản Hiện Tại Không Phải Employer
          </h1>
          <p className="mt-3 text-sm text-white/60 max-w-xl mx-auto">
            {authError.message}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard/freelancer" className="btn-primary px-5 py-3 text-xs flex items-center gap-2">
              Chuyển Sang Freelancer Dashboard <ChevronRight className="h-4 w-4" />
            </Link>
            <Link href="/profile" className="btn-secondary px-5 py-3 text-xs">
              Gửi Yêu Cầu Nâng Cấp Role Employer
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const metrics = data?.metrics || { totalJobsPosted: 0, totalApplicants: 0, totalHired: 0, totalBudgetSpent: 0, jobsGrowthPct: 0 };
  const jobsList = data?.jobs || [];
  const timeSeriesData = data?.timeSeriesData || [];
  const escrowBreakdown = data?.escrowBreakdown || [];
  const applicantFunnel = data?.applicantFunnel || [];
  const recentActivity = data?.recentActivity || [];
  const trustBlock = data?.trustBlock || { rating: 5.0, verifiedWallet: true, identityStatus: "APPROVED", totalJobsPosted: 0 };

  const allApplications = jobsList.flatMap((j: any) => 
    (j.applications || []).map((app: any) => ({
      ...app,
      jobId: j.id,
      jobTitle: j.title
    }))
  );

  const filteredApplications = allApplications.filter((app: any) => 
    selectedJobId === "all" || app.jobId === selectedJobId
  );

  const isEmptyState = jobsList.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner & Action Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
              <Activity className="h-4 w-4" /> Báo Cáo & Thống Kê Bên A (Employer Insights)
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                <Database className="h-3 w-3" /> Authenticated SIWE
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Employer Analytical Dashboard
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Quản lý chi tiết bài đăng, phễu ứng viên, xu hướng tuyển dụng và trạng thái tiền Escrow on-chain.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-white/60 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-mono">
              Ví: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <Link href="/post-job" className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4 shadow-lg shadow-violet-500/20">
              <Plus className="h-4 w-4" /> Đăng Bài Tuyển Dụng Mới
            </Link>
            <Link href="/dashboard/freelancer" className="btn-secondary flex items-center gap-1.5 text-xs py-2.5 px-3">
              Chuyển Xem Bên B <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 1. Stat Cards with % Period Comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-5 border border-violet-500/20 hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Dự án đã đăng</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="h-3 w-3" /> +{metrics.jobsGrowthPct}% mo/mo
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{metrics.totalJobsPosted}</p>
              <p className="text-xs text-white/40">Dự án tuyển dụng</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Tổng số ứng viên</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              <Users className="h-3 w-3" /> Live Data
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{metrics.totalApplicants}</p>
              <p className="text-xs text-white/40">Hồ sơ ứng tuyển</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-green-500/20 hover:border-green-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Đã tuyển chọn</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              <CheckCircle2 className="h-3 w-3" /> {metrics.totalJobsPosted > 0 ? Math.round((metrics.totalHired / metrics.totalJobsPosted) * 100) : 0}% tỉ lệ chọn
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{metrics.totalHired}</p>
              <p className="text-xs text-white/40">Ứng viên nhận việc</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-amber-500/20 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Tổng ngân sách bảo đảm</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
              <ShieldCheck className="h-3 w-3" /> Escrow 100%
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{formatCurrency(metrics.totalBudgetSpent)}</p>
              <p className="text-xs text-white/40">Tổng giá trị hợp đồng</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* EMPTY STATE BLOCK WITH PROMINENT CTA */}
      {isEmptyState ? (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center border border-violet-500/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-violet-400 border border-violet-500/30 mb-4">
            <Briefcase className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Bạn chưa có bài đăng tuyển dụng nào</h2>
          <p className="mt-2 text-sm text-white/60 max-w-lg mx-auto">
            Hãy bắt đầu đăng dự án tuyển dụng Web3 đầu tiên của bạn để kết nối với hàng nghìn Freelancer chất lượng cao và giao dịch cọc Escrow an toàn.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/post-job" className="btn-primary px-6 py-3 text-sm flex items-center gap-2 shadow-lg shadow-violet-500/20">
              <Plus className="h-4 w-4" /> Đăng Dự Án Đầu Tiên Ngay
            </Link>
            <Link href="/marketplace" className="btn-secondary px-6 py-3 text-sm">
              Xem Bài Đăng Mẫu
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* 2. Visual Charts Row: Time Series Line Chart & Escrow Breakdown Donut Chart */}
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-violet-400" /> Biểu Đồ Xu Hướng Tuyển Dụng & Dòng Tiền (7 Ngày Gần Nhất)
                  </h3>
                  <p className="text-xs text-white/50">Theo dõi sự tăng trưởng của số công việc đăng tuyển, ứng viên và cọc Escrow theo thời gian</p>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="date" stroke="#ffffff60" tick={{ fontSize: 12 }} />
                    <YAxis stroke="#ffffff60" tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }}
                    />
                    <Line type="monotone" dataKey="applicants" name="Số ứng viên" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="jobs" name="Số bài đăng" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <PieIcon className="h-5 w-5 text-cyan-400" /> Phân Bổ Trạng Thái Escrow
                </h3>
                <p className="text-xs text-white/50 mb-4">Tỷ lệ ngân sách đang khoá, đã giải ngân hoặc tranh chấp</p>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={escrowBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {escrowBreakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff" }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                {escrowBreakdown.map((item: any) => (
                  <div key={item.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-white/70">{item.name}</span>
                    </div>
                    <span className="font-semibold text-white">{formatCurrency(item.value)}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* 3. Applicant Funnel & Trust Block */}
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 lg:col-span-2">
              <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-1">
                <Sparkles className="h-5 w-5 text-amber-400" /> Phễu Chuyển Đổi Ứng Viên (Applicant Funnel)
              </h3>
              <p className="text-xs text-white/50 mb-6">Đo lường từ giai đoạn nộp đơn đến nhận việc và hoàn thành dự án</p>

              <div className="grid gap-3 sm:grid-cols-4">
                {applicantFunnel.map((stage: any, idx: number) => (
                  <div key={stage.stage} className="relative p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                    <span className="text-[10px] uppercase font-bold text-violet-400 tracking-wider">Bước {idx + 1}</span>
                    <h4 className="text-xs font-semibold text-white mt-1">{stage.stage}</h4>
                    <p className="font-display text-2xl font-bold text-white mt-2">{stage.count}</p>
                    <div className="mt-2 text-[11px] text-emerald-400 font-semibold">
                      {stage.percentage}% giữ lại
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 flex flex-col justify-between border border-violet-500/20">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-violet-400 uppercase tracking-wider mb-2">
                  <Award className="h-4 w-4" /> Khối Uy Tín Bên A (Trust & Reputation)
                </div>
                <h3 className="font-display text-lg font-bold text-white">Chỉ Số Đánh Giá Đáng Tin Cậy</h3>

                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-white/60">Điểm Uy Tín Trung Bình:</span>
                    <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                      ★ {trustBlock.rating} / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-white/60">Xác Minh Danh Tính (KYC):</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" /> {trustBlock.identityStatus === "APPROVED" ? "Đã Xác Minh" : "Đang Chờ"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-xs text-white/60">Bảo Đảm Ví On-Chain:</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Ví Đã Ký SIWE
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 4. Applicants List & Recent Activity */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                      <Users className="h-5 w-5 text-cyan-400" /> Danh Sách Ứng Viên Theo Dự Án ({filteredApplications.length})
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">Duyệt sơ yếu lý lịch, ký hợp đồng và mở khoá cọc Escrow</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-white/40" />
                    <select
                      value={selectedJobId}
                      onChange={(e) => setSelectedJobId(e.target.value)}
                      className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500"
                    >
                      <option value="all">Tất cả bài đăng ({allApplications.length})</option>
                      {jobsList.map((j: any) => (
                        <option key={j.id} value={j.id}>{j.title.substring(0, 30)}...</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredApplications.length === 0 ? (
                    <div className="p-8 text-center text-xs text-white/50 bg-white/[0.01] rounded-xl border border-white/5">
                      Chưa có đơn ứng tuyển nào cho dự án đã chọn.
                    </div>
                  ) : (
                    filteredApplications.map((app: any) => (
                      <div key={app.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Image 
                              src={app.freelancer?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${app.freelancerAddress || "freelancer"}`} 
                              alt={app.freelancer?.name || "Freelancer"} 
                              width={40} 
                              height={40} 
                              className="h-10 w-10 rounded-full border border-violet-500/30 object-cover" 
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-white text-sm">{app.freelancer?.name || `Freelancer ${app.freelancerAddress?.slice(0, 6)}...`}</h4>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                  ★ {app.freelancer?.rating || 5.0}
                                </span>
                              </div>
                              <p className="text-xs text-white/50">Dự án: <span className="text-cyan-300 font-medium">{app.jobTitle}</span></p>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="font-display text-base font-bold text-white">{formatCurrency(app.proposalBid)}</p>
                            <p className="text-xs text-white/40">Thời gian: {app.estimatedDays} ngày</p>
                          </div>
                        </div>

                        <p className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70 italic">
                          "{app.coverLetter}"
                        </p>

                        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                          <span className="text-[11px] text-white/40">Thời gian gửi: {formatDateSafe(app.createdAt)}</span>
                          <Link 
                            href={`/dashboard/employer/jobs/${app.jobId}`}
                            className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1 border-violet-500/30 text-violet-300"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" /> Quản Lý & Thuê Freelancer
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-violet-400" /> Nhật Ký Hoạt Động Mới (Recent Activity)
                </h3>

                <div className="space-y-3">
                  {recentActivity.length === 0 ? (
                    <p className="text-xs text-white/40 italic">Chưa có nhật ký hoạt động gần đây.</p>
                  ) : (
                    recentActivity.map((act: any) => (
                      <div key={act.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
                        <p className="font-semibold text-white">{act.title}</p>
                        <p className="text-white/50 text-[11px]">{act.subtitle}</p>
                        <p className="text-[10px] text-white/40 text-right">{formatDateSafe(act.time)}</p>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
