"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Users, Briefcase, DollarSign, CheckCircle2, 
  ArrowRight, Filter, Search, Clock, Award, 
  TrendingUp, BarChart3, ShieldCheck, Eye, ExternalLink, ChevronRight, Loader2, Database
} from "lucide-react";
import { jobs as staticJobs } from "@/data/jobs";
import { formatCurrency } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";
import { WalletButton } from "@/components/wallet/wallet-button";

export default function ClientDashboardPage() {
  const { connected, address } = useWalletStore();
  const [filterCategory, setFilterCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobId, setSelectedJobId] = useState<string>("all");
  
  const [realJobs, setRealJobs] = useState<any[]>([]);
  const [loadingRealData, setLoadingRealData] = useState<boolean>(true);
  const [isUsingRealData, setIsUsingRealData] = useState<boolean>(false);

  useEffect(() => {
    setLoadingRealData(true);
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.jobs && Array.isArray(data.jobs) && data.jobs.length > 0) {
          setRealJobs(data.jobs);
          setIsUsingRealData(true);
        } else {
          setRealJobs(staticJobs);
        }
      })
      .catch((err) => {
        console.warn("Could not load API jobs, fallback to static:", err);
        setRealJobs(staticJobs);
      })
      .finally(() => setLoadingRealData(false));
  }, [address]);

  // Filter client's jobs if wallet is connected
  const userAddrLower = (address || "").toLowerCase();
  const myJobs = connected && userAddrLower
    ? realJobs.filter((j) => (j.clientAddress || "").toLowerCase() === userAddrLower || (j.employer?.walletAddress || "").toLowerCase() === userAddrLower)
    : [];

  // Display jobs list (my real jobs if connected & exists, or all real/demo jobs)
  const displayJobs = myJobs.length > 0 ? myJobs : realJobs;

  const clientJobs = displayJobs.map((job) => ({
    ...job,
    applicantsCount: job.applicants ?? (job.applications ? job.applications.length : (job.proposals ? job.proposals.length : Math.floor(Math.random() * 8) + 2)),
    escrowStatus: job.status === "completed" || job.status === "COMPLETED" ? "COMPLETED" : job.status === "in_progress" || job.status === "IN_PROGRESS" ? "FUNDED" : "OPEN"
  }));

  const filteredJobs = clientJobs.filter((job) => {
    const matchesCat = filterCategory === "all" || job.category === filterCategory;
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Calculate overall metrics
  const totalJobsPosted = clientJobs.length;
  const totalApplicants = clientJobs.reduce((acc, j) => acc + (j.applicantsCount || 0), 0);
  const totalHired = clientJobs.filter((j) => j.status === "in_progress" || j.status === "IN_PROGRESS" || j.status === "completed" || j.status === "COMPLETED").length;
  const totalBudgetSpent = clientJobs.reduce((acc, j) => acc + (j.budget || 0), 0);

  // Extract real or fallback applicants
  const extractedApplicants: any[] = [];
  clientJobs.forEach((job) => {
    if (job.applications && Array.isArray(job.applications) && job.applications.length > 0) {
      job.applications.forEach((app: any) => {
        extractedApplicants.push({
          id: app.id,
          freelancerName: app.freelancer?.name || `Freelancer ${(app.freelancerAddress || "0x0000").slice(0, 6)}...`,
          avatar: app.freelancer?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${app.freelancerAddress}`,
          role: "Web3 Specialist",
          rating: app.freelancer?.rating || 5.0,
          jobTitle: job.title,
          jobId: job.id,
          bidAmount: app.proposalBid || job.budget,
          deliveryDays: app.estimatedDays || 7,
          appliedAt: app.createdAt || new Date().toISOString(),
          status: app.status || "pending",
          coverLetter: app.coverLetter || "Tôi rất hứng thú với công việc này và muốn ứng tuyển."
        });
      });
    }
  });

  // Fallback mock applicants if no real applicants yet
  const fallbackApplicants = [
    {
      id: "app-101",
      freelancerName: "Alex Rivera",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Alex",
      role: "Senior Web3 Developer",
      rating: 4.9,
      jobTitle: clientJobs[0]?.title || "Smart Contract Escrow Integration",
      jobId: clientJobs[0]?.id || "job-001",
      bidAmount: clientJobs[0]?.budget || 1500,
      deliveryDays: 5,
      appliedAt: "2026-08-08T14:30:00Z",
      status: "pending",
      coverLetter: "Tôi có 4 năm kinh nghiệm lập trình Solidity và Next.js. Đã từng triển khai Escrow contract thành công."
    },
    {
      id: "app-102",
      freelancerName: "Elena Rostova",
      avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=Elena",
      role: "UI/UX Designer",
      rating: 5.0,
      jobTitle: clientJobs[1]?.title || "Web3 Landing Page Redesign",
      jobId: clientJobs[1]?.id || "job-002",
      bidAmount: clientJobs[1]?.budget || 800,
      deliveryDays: 3,
      appliedAt: "2026-08-09T09:15:00Z",
      status: "accepted",
      coverLetter: "Chuyên thiết kế Dark Mode, Glassmorphism chuẩn phong cách Web3 hiện đại."
    }
  ];

  const allApplicants = extractedApplicants.length > 0 ? extractedApplicants : fallbackApplicants;

  const filteredApplicants = allApplicants.filter((app) => 
    selectedJobId === "all" || app.jobId === selectedJobId
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400 mb-1">
              <BarChart3 className="h-4 w-4" /> Báo Cáo & Thống Kê Bên A Real-Time
              {isUsingRealData && (
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-300 border border-green-500/20">
                  <Database className="h-3 w-3" /> Live Data DB
                </span>
              )}
            </div>
            <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
              Employer Dashboard & Applicants Report
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Theo dõi chi tiết lượng ứng viên, ngân sách Escrow đã khóa và tiến độ tuyển dụng từ CSDL.
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
            <Link href="/post-job" className="btn-primary flex items-center gap-2 text-xs py-2.5 px-4">
              <Briefcase className="h-4 w-4" /> Đăng Bài Mới
            </Link>
            <Link href="/dashboard/freelancer" className="btn-secondary flex items-center gap-1.5 text-xs py-2.5 px-3">
              Bên B <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Loading state indicator */}
      {loadingRealData && (
        <div className="mb-6 flex items-center gap-2 text-xs text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-xl">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Đang đồng bộ dữ liệu thật từ CSDL PostgreSQL...</span>
        </div>
      )}

      {/* Metric Cards Row */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div className="glass-card p-5 border border-violet-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 text-violet-400">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{totalJobsPosted}</p>
              <p className="text-xs text-white/50">Dự án đã đăng tuyển</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-cyan-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{totalApplicants}</p>
              <p className="text-xs text-white/50">Tổng số ứng viên nộp hồ sơ</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-green-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{totalHired}</p>
              <p className="text-xs text-white/50">Ứng viên đã tuyển & Escrow</p>
            </div>
          </div>
        </div>

        <div className="glass-card p-5 border border-amber-500/20">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-2xl font-bold text-white">{formatCurrency(totalBudgetSpent)}</p>
              <p className="text-xs text-white/50">Tổng ngân sách bảo đảm</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid: Posted Jobs & Applicant Management Table */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Applicants Tracking & Management */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-400" /> Danh Sách Ứng Viên Theo Dự Án ({filteredApplicants.length})
                </h3>
                <p className="text-xs text-white/50 mt-0.5">Quản lý hồ sơ, phê duyệt nhận việc và nạp cọc Escrow cho ứng viên</p>
              </div>

              {/* Job Selector Dropdown */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-white/40" />
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500"
                >
                  <option value="all" className="bg-slate-900">Tất cả dự án ({allApplicants.length})</option>
                  {clientJobs.map((j) => (
                    <option key={j.id} value={j.id} className="bg-slate-900">{j.title.substring(0, 30)}...</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Applicants List */}
            <div className="space-y-4">
              {filteredApplicants.map((app) => (
                <div key={app.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={app.avatar} alt={app.freelancerName} className="h-10 w-10 rounded-full border border-violet-500/30 object-cover" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white text-sm">{app.freelancerName}</h4>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                            ★ {app.rating}
                          </span>
                        </div>
                        <p className="text-xs text-white/50">{app.role}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-display text-base font-bold text-white">{formatCurrency(app.bidAmount)}</p>
                      <p className="text-xs text-white/40">Thời gian: {app.deliveryDays} ngày</p>
                    </div>
                  </div>

                  <div className="mt-3 p-3 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-white/70 leading-relaxed">
                    <span className="font-medium text-white/90">Dự án ứng tuyển:</span> <span className="text-cyan-300">{app.jobTitle}</span>
                    <p className="mt-1 text-white/60 italic">"{app.coverLetter}"</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                    <span className="text-[11px] text-white/40">Gửi lúc: {new Date(app.appliedAt).toLocaleDateString()}</span>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/jobs/${app.jobId}`}
                        className="btn-secondary text-[11px] py-1.5 px-3 flex items-center gap-1"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                        Chấp Nhận & Nạp Cọc Escrow
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right 1 Column: Posted Jobs Summary & Escrow Status Report */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
            <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-violet-400" /> Danh Sách Bài Đăng ({clientJobs.length})
            </h3>

            <div className="space-y-3">
              {clientJobs.slice(0, 5).map((job) => (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="block p-3.5 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="capitalize text-[10px] font-semibold px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {job.category}
                    </span>
                    <span className="text-[11px] text-cyan-400 font-medium flex items-center gap-1">
                      <Users className="h-3 w-3" /> {job.applicantsCount} ứng viên
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-white truncate mt-1.5">{job.title}</h4>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-white/50">
                    <span>{formatCurrency(job.budget)}</span>
                    <span className="flex items-center gap-1 text-violet-300">
                      Chi tiết <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
