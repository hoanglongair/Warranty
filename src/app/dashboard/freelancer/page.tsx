"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FileText, TrendingUp, CheckCircle2, Clock, 
  DollarSign, Briefcase, Award, Send, 
  ChevronRight, ArrowRight, ShieldCheck, Lock, AlertCircle, Loader2, Database
} from "lucide-react";
import { jobs as staticJobs } from "@/data/jobs";
import { formatCurrency } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";
import { WalletButton } from "@/components/wallet/wallet-button";

export default function FreelancerDashboardPage() {
  const { connected, address } = useWalletStore();
  const [filterStatus, setFilterStatus] = useState("all");
  
  const [realApplications, setRealApplications] = useState<any[]>([]);
  const [loadingRealData, setLoadingRealData] = useState<boolean>(true);
  const [isUsingRealData, setIsUsingRealData] = useState<boolean>(false);

  useEffect(() => {
    setLoadingRealData(true);
    if (address) {
      fetch(`/api/profile/${address}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.profile?.applications && Array.isArray(data.profile.applications) && data.profile.applications.length > 0) {
            setRealApplications(data.profile.applications);
            setIsUsingRealData(true);
          } else {
            setRealApplications([]);
          }
        })
        .catch((err) => {
          console.warn("Could not load freelancer profile applications:", err);
        })
        .finally(() => setLoadingRealData(false));
    } else {
      setLoadingRealData(false);
    }
  }, [address]);

  // Fallback mock proposals for demo presentation if no real applications submitted yet
  const fallbackProposals = [
    {
      id: "prop-201",
      jobId: "job-001",
      jobTitle: "Smart Contract Escrow Integration",
      category: "development",
      clientName: "Warranty Labs",
      bidAmount: 1500,
      tokenSymbol: "ETH",
      estimatedDays: 7,
      submittedAt: "2026-08-08T14:30:00Z",
      status: "FUNDED",
      deliverableStatus: "IN_PROGRESS",
      coverLetter: "Tôi có 4 năm kinh nghiệm lập trình Solidity và Next.js. Đã từng triển khai Escrow contract thành công."
    },
    {
      id: "prop-202",
      jobId: "job-002",
      jobTitle: "Web3 Landing Page Redesign",
      category: "design",
      clientName: "Aurora DAO",
      bidAmount: 800,
      tokenSymbol: "USDC",
      estimatedDays: 5,
      submittedAt: "2026-08-05T09:15:00Z",
      status: "COMPLETED",
      deliverableStatus: "RELEASED",
      coverLetter: "Chuyên thiết kế Dark Mode, Glassmorphism chuẩn phong cách Web3 hiện đại."
    },
    {
      id: "prop-203",
      jobId: "job-003",
      jobTitle: "DeFi Staking Protocol Frontend",
      category: "development",
      clientName: "Nebula Protocol",
      bidAmount: 2200,
      tokenSymbol: "ETH",
      estimatedDays: 10,
      submittedAt: "2026-08-09T18:45:00Z",
      status: "PENDING",
      deliverableStatus: "PENDING_HIRE",
      coverLetter: "Thành thạo Ethers.js, Wagmi và Tailwind CSS. Cam kết hoàn thành đúng hạn."
    }
  ];

  // Map real applications from DB
  const mappedRealProposals = realApplications.map((app) => ({
    id: app.id,
    jobId: app.jobId,
    jobTitle: app.job?.title || "Dự án Web3",
    category: app.job?.category || "development",
    clientName: `Client ${(app.job?.clientAddress || "0x0000").slice(0, 6)}...`,
    bidAmount: app.proposalBid || app.job?.budget || 1000,
    tokenSymbol: app.job?.tokenSymbol || "ETH",
    estimatedDays: app.estimatedDays || 7,
    submittedAt: app.createdAt || new Date().toISOString(),
    status: app.job?.status === "COMPLETED" ? "COMPLETED" : app.job?.status === "IN_PROGRESS" ? "FUNDED" : app.status === "ACCEPTED" ? "FUNDED" : "PENDING",
    deliverableStatus: app.status || "PENDING",
    coverLetter: app.coverLetter || "Đơn ứng tuyển từ ví kết nối."
  }));

  const displayProposals = mappedRealProposals.length > 0 ? mappedRealProposals : fallbackProposals;

  const filteredProposals = displayProposals.filter((p) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "funded") return p.status === "FUNDED";
    if (filterStatus === "completed") return p.status === "COMPLETED";
    if (filterStatus === "pending") return p.status === "PENDING";
    return true;
  });

  // Calculate Metrics for Freelancer
  const totalSubmitted = displayProposals.length;
  const activeContracts = displayProposals.filter((p) => p.status === "FUNDED").length;
  const completedContracts = displayProposals.filter((p) => p.status === "COMPLETED").length;
  const totalEarned = displayProposals
    .filter((p) => p.status === "COMPLETED")
    .reduce((acc, p) => acc + (p.bidAmount || 0), 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-400 mb-1">
              <TrendingUp className="h-4 w-4" /> Báo Cáo & Thống Kê Bên B Real-Time
              {isUsingRealData && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                  <Database className="h-3 w-3" /> Live DB Profile Data
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Freelancer Applications & Earnings Report
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Quản lý danh sách các nơi/dự án đã ứng tuyển, tiến độ bàn giao và thu nhập Escrow từ CSDL.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!connected ? (
              <WalletButton />
            ) : (
              <div className="text-xs text-white/60 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl font-mono">
                Ví: {address?.slice(0, 6)}...{address?.slice(-4)}
              </div>
            )}
            <Link href="/marketplace" className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4">
              <Briefcase className="h-4 w-4" /> Tìm Việc Làm Mới
            </Link>
            <Link href="/dashboard/client" className="btn-secondary flex items-center gap-1.5 text-xs py-2.5 px-3">
              Bên A <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Loading state */}
      {loadingRealData && (
        <div className="mb-6 flex items-center gap-2 text-xs text-violet-400 bg-violet-500/10 border border-violet-500/20 p-3 rounded-xl">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Đang truy vấn danh sách đơn ứng tuyển thật từ CSDL PostgreSQL...</span>
        </div>
      )}

      {/* Metrics Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="glass-card p-5 border border-violet-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-400">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{totalSubmitted}</p>
              <p className="text-xs text-white/50">Đơn ứng tuyển đã nộp</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-cyan-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{activeContracts}</p>
              <p className="text-xs text-white/50">Hợp đồng đang Escrow cọc</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-green-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{completedContracts}</p>
              <p className="text-xs text-white/50">Hợp đồng đã hoàn thành</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{formatCurrency(totalEarned)}</p>
              <p className="text-xs text-white/50">Tổng thu nhập giải ngân</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Applications List Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-400" /> Báo Cáo Nơi & Đơn Đã Ứng Tuyển ({filteredProposals.length})
            </h3>
            <p className="text-xs text-white/50 mt-0.5">Theo dõi trạng thái duyệt của Bên A và bàn giao sản phẩm</p>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1 text-xs">
            <button
              onClick={() => setFilterStatus("all")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${filterStatus === "all" ? "bg-violet-500/30 text-white font-semibold" : "text-white/50 hover:text-white"}`}
            >
              Tất cả ({displayProposals.length})
            </button>
            <button
              onClick={() => setFilterStatus("funded")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${filterStatus === "funded" ? "bg-cyan-500/30 text-cyan-200 font-semibold" : "text-white/50 hover:text-white"}`}
            >
              Đã Khóa Cọc ({activeContracts})
            </button>
            <button
              onClick={() => setFilterStatus("completed")}
              className={`rounded-lg px-3 py-1.5 transition-colors ${filterStatus === "completed" ? "bg-green-500/30 text-green-200 font-semibold" : "text-white/50 hover:text-white"}`}
            >
              Đã Giải Ngân ({completedContracts})
            </button>
          </div>
        </div>

        {/* Proposals List */}
        <div className="space-y-4">
          {filteredProposals.map((prop) => (
            <div key={prop.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="capitalize text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {prop.category}
                    </span>
                    <span className="text-xs text-white/50">Đăng bởi: {prop.clientName}</span>
                  </div>
                  <h4 className="font-semibold text-white text-base mt-1">{prop.jobTitle}</h4>
                </div>

                <div className="text-right">
                  <p className="font-display text-lg font-bold text-white">{formatCurrency(prop.bidAmount)} {prop.tokenSymbol}</p>
                  <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border mt-1 ${
                    prop.status === "COMPLETED" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                    prop.status === "FUNDED" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                    "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  }`}>
                    {prop.status === "COMPLETED" ? "Đã Giải Ngân 100%" : prop.status === "FUNDED" ? "Đã Khóa Cọc Escrow" : "Đang Chờ Bên A Duyệt"}
                  </span>
                </div>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70">
                <p className="font-medium text-white/90">Thư giới thiệu của bạn:</p>
                <p className="mt-1 text-white/60 italic">"{prop.coverLetter}"</p>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                <span className="text-[11px] text-white/40">Nộp ngày: {new Date(prop.submittedAt).toLocaleDateString()}</span>
                <Link
                  href={`/jobs/${prop.jobId}`}
                  className="btn-primary text-[11px] py-1.5 px-3 flex items-center gap-1"
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {prop.status === "FUNDED" ? "Bàn Giao Sản Phẩm" : "Xem Chi Tiết Escrow"}
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
