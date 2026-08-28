"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, TrendingUp, CheckCircle2, 
  Briefcase, ChevronRight, ArrowRight, ShieldCheck, Lock, Loader2, Database,
  PieChart as PieIcon, Award, UserCheck, Search, Star, ShieldAlert
} from "lucide-react";
import { 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, CartesianGrid 
} from "recharts";
import { formatCurrency, formatDateSafe } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";
import { WalletButton } from "@/components/wallet/wallet-button";

export default function FreelancerDashboardPage() {
  const { connected, address } = useWalletStore();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<{ status: number; message: string } | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const fetchDashboardData = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const res = await fetch("/api/dashboard/freelancer");
      const result = await res.json();

      if (!res.ok) {
        setAuthError({
          status: res.status,
          message: result.error || "Không thể truy cập Dashboard Freelancer."
        });
        setData(null);
        return;
      }

      setData(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("Failed to fetch freelancer dashboard API:", msg);
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
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent mb-4" />
        <p className="text-sm text-white/60">Đang kiểm tra xác thực JWT và tải dữ liệu Freelancer Dashboard...</p>
      </div>
    );
  }

  // 1. UNAUTHENTICATED SCREEN (401 Unauthorized)
  if (authError?.status === 401 || !connected) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 border border-cyan-500/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 mb-6">
            <Lock className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Yêu Cầu Đăng Nhập Ví Web3</span>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl mt-1">
            Không Thể Truy Cập Freelancer Dashboard
          </h1>
          <p className="mt-3 text-sm text-white/60 max-w-xl mx-auto">
            {authError?.message || "Bạn chưa kết nối ví hoặc chưa ký xác thực SIWE. Vui lòng kết nối ví để xem danh sách nơi đã ứng tuyển và thu nhập Escrow."}
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

  // 2. FORBIDDEN ROLE SCREEN (403 Forbidden - e.g. Employer trying to access Freelancer Dashboard)
  if (authError?.status === 403) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-10 border border-amber-500/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30 mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">403 Forbidden — Quyền Truy Cập Bị Từ Chối</span>
          <h1 className="font-display text-3xl font-bold text-white sm:text-4xl mt-1">
            Tài Khoản Hiện Tại Không Phải Freelancer
          </h1>
          <p className="mt-3 text-sm text-white/60 max-w-xl mx-auto">
            {authError.message}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/dashboard/employer" className="btn-primary px-5 py-3 text-xs flex items-center gap-2">
              Chuyển Sang Employer Dashboard <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const metrics = data?.metrics || { totalProposalsSent: 0, activeContracts: 0, completedContracts: 0, totalEarned: 0, earningsGrowthPct: 0 };
  const applications = data?.applications || [];
  const timeSeriesData = data?.timeSeriesData || [];
  const escrowBreakdown = data?.escrowBreakdown || [];
  const recentActivity = data?.recentActivity || [];
  const trustBlock = data?.trustBlock || { rating: 5.0, completedJobs: 0, totalEarned: 0, verifiedWallet: true, skills: [] };

  const filteredApplications = applications.filter((app: any) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "funded") return app.job?.status === "IN_PROGRESS" || app.status === "ACCEPTED";
    if (filterStatus === "completed") return app.job?.status === "COMPLETED";
    if (filterStatus === "pending") return app.status === "PENDING";
    return true;
  });

  const isEmptyState = applications.length === 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <TrendingUp className="h-4 w-4" /> Báo Cáo & Thống Kê Bên B (Freelancer Insights)
              <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                <Database className="h-3 w-3" /> Authenticated SIWE
              </span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Freelancer Performance & Earnings Dashboard
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Quản lý chi tiết danh sách đơn ứng tuyển, tiến độ dự án, thu nhập Escrow và chỉ số uy tín ví.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-xs text-white/60 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-mono">
              Ví: {address?.slice(0, 6)}...{address?.slice(-4)}
            </div>
            <Link href="/marketplace" className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4 shadow-lg shadow-cyan-500/20">
              <Search className="h-4 w-4" /> Tìm Việc Làm Mới
            </Link>
            <Link href="/dashboard/employer" className="btn-secondary flex items-center gap-1.5 text-xs py-2.5 px-3">
              Chuyển Xem Bên A <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* 1. Stat Metric Cards with % Period Comparison */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-5 border border-violet-500/20 hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Đơn ứng tuyển</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
              <FileText className="h-3 w-3" /> Tất cả đơn nộp
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{metrics.totalProposalsSent}</p>
              <p className="text-xs text-white/40">Đề xuất đã gửi</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-cyan-500/20 hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Hợp đồng đang Escrow</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              <Lock className="h-3 w-3" /> Đang bảo đảm
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{metrics.activeContracts}</p>
              <p className="text-xs text-white/40">Dự án đang làm</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-green-500/20 hover:border-green-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Đã nghiệm thu</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
              <CheckCircle2 className="h-3 w-3" /> Thành công 100%
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{metrics.completedContracts}</p>
              <p className="text-xs text-white/40">Dự án hoàn thành</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-amber-500/20 hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/50">Tổng thu nhập giải ngân</span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="h-3 w-3" /> +{metrics.earningsGrowthPct}% mo/mo
            </span>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{formatCurrency(metrics.totalEarned)}</p>
              <p className="text-xs text-white/40">Đã rút về ví</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* EMPTY STATE BLOCK WITH PROMINENT CTA */}
      {isEmptyState ? (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-12 text-center border border-cyan-500/30">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400 border border-cyan-500/30 mb-4">
            <Search className="h-8 w-8" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">Bạn chưa gửi đơn ứng tuyển công việc nào</h2>
          <p className="mt-2 text-sm text-white/60 max-w-lg mx-auto">
            Khám phá hàng trăm cơ hội việc làm Web3 hấp dẫn trên Warranty Chợ Việc Làm, gửi chào thầu và nhận thanh toán Escrow an toàn.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link href="/marketplace" className="btn-primary px-6 py-3 text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20">
              <Search className="h-4 w-4" /> Tìm Việc Làm Ngay
            </Link>
            <Link href="/profile" className="btn-secondary px-6 py-3 text-sm">
              Cập Nhật Hồ Sơ Freelancer
            </Link>
          </div>
        </motion.div>
      ) : (
        <>
          {/* 2. Visual Charts Row: Earnings Line Chart & Escrow Breakdown Donut Chart */}
          <div className="grid gap-8 lg:grid-cols-3">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" /> Biểu Đồ Thu Nhập & Số Đơn Ứng Tuyển (7 Ngày Gần Nhất)
                  </h3>
                  <p className="text-xs text-white/50">Theo dõi tốc độ chào thầu và lượng tiền giải ngân thực tế về ví</p>
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
                    <Line type="monotone" dataKey="earnings" name="Thu nhập ($)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="proposals" name="Số đơn nộp" stroke="#06b6d4" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2 mb-1">
                  <PieIcon className="h-5 w-5 text-violet-400" /> Phân Bổ Dòng Tiền Thu Nhập
                </h3>
                <p className="text-xs text-white/50 mb-4">Tỷ lệ tiền đã giải ngân, tiền đang khoá cọc Escrow và chào thầu chờ duyệt</p>

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

          {/* 3. Applications Table & Trust Block */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                      <FileText className="h-5 w-5 text-violet-400" /> Báo Cáo Chi Tiết Đơn Ứng Tuyển ({filteredApplications.length})
                    </h3>
                    <p className="text-xs text-white/50 mt-0.5">Theo dõi trạng thái chấp thuận của Bên A và tiền cọc Escrow</p>
                  </div>

                  <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
                    <button
                      onClick={() => setFilterStatus("all")}
                      className={`rounded-lg px-3 py-1.5 transition-colors ${filterStatus === "all" ? "bg-violet-500/30 text-white font-semibold" : "text-white/50 hover:text-white"}`}
                    >
                      Tất cả ({applications.length})
                    </button>
                    <button
                      onClick={() => setFilterStatus("funded")}
                      className={`rounded-lg px-3 py-1.5 transition-colors ${filterStatus === "funded" ? "bg-cyan-500/30 text-cyan-200 font-semibold" : "text-white/50 hover:text-white"}`}
                    >
                      Đã Cọc Escrow
                    </button>
                    <button
                      onClick={() => setFilterStatus("completed")}
                      className={`rounded-lg px-3 py-1.5 transition-colors ${filterStatus === "completed" ? "bg-green-500/30 text-green-200 font-semibold" : "text-white/50 hover:text-white"}`}
                    >
                      Đã Giải Ngân
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredApplications.map((prop: any) => (
                    <div key={prop.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="capitalize text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                              {prop.job?.category || "development"}
                            </span>
                            <span className="text-xs text-white/50">Người thuê: {prop.job?.employer?.name || "Bên A Web3"}</span>
                          </div>
                          <h4 className="font-semibold text-white text-base mt-1">{prop.job?.title || "Dự án Web3"}</h4>
                        </div>

                        <div className="text-right">
                          <p className="font-display text-lg font-bold text-white">{formatCurrency(prop.proposalBid)} {prop.job?.tokenSymbol || "USDC"}</p>
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border mt-1 ${
                            prop.job?.status === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            prop.job?.status === "IN_PROGRESS" || prop.status === "ACCEPTED" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                            "bg-amber-500/10 text-amber-300 border-amber-500/20"
                          }`}>
                            {prop.job?.status === "COMPLETED" ? "Đã Giải Ngân 100%" : prop.job?.status === "IN_PROGRESS" || prop.status === "ACCEPTED" ? "Đã Khoá Cọc Escrow" : "Đang Chờ Bên A Duyệt"}
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70 italic">
                        "{prop.coverLetter}"
                      </p>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5 text-xs">
                        <span className="text-[11px] text-white/40">Nộp ngày: {formatDateSafe(prop.createdAt)}</span>
                        <Link
                          href={`/jobs/${prop.jobId}`}
                          className="btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {prop.job?.status === "IN_PROGRESS" ? "Bàn Giao Sản Phẩm" : "Xem Chi Tiết Escrow"}
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6 border border-cyan-500/20">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-2">
                  <Award className="h-4 w-4" /> Khối Uy Tín Freelancer (Trust Score)
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-4">Hồ Sơ & Điểm Đánh Giá Ví</h3>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/60">Đánh Giá Trung Bình:</span>
                    <span className="font-bold text-amber-400 flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {trustBlock.rating} / 5.0
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/60">Số Dự Án Hoàn Thành:</span>
                    <span className="font-bold text-white">{trustBlock.completedJobs} dự án</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5">
                    <span className="text-white/60">Xác Thực Ví SIWE:</span>
                    <span className="font-semibold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20 flex items-center gap-1">
                      <UserCheck className="h-3 w-3" /> Đã Xác Thực Chữ Ký
                    </span>
                  </div>

                  <div className="pt-2">
                    <span className="text-[11px] text-white/50 font-medium">Kỹ Năng Đã Xác Minh:</span>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {(trustBlock.skills || []).map((skill: string) => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-white/5 text-[10px] text-cyan-300 border border-white/10">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
                <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-cyan-400" /> Nhật Ký Hoạt Động (Activity Feed)
                </h3>

                <div className="space-y-3">
                  {recentActivity.map((act: any) => (
                    <div key={act.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs space-y-1">
                      <p className="font-semibold text-white">{act.title}</p>
                      <p className="text-white/50 text-[11px]">{act.subtitle}</p>
                      <p className="text-[10px] text-white/40 text-right">{formatDateSafe(act.time)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
