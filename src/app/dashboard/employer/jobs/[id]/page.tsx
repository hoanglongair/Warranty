"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Briefcase,
  Users,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  ExternalLink,
  Loader2,
  Database
} from "lucide-react";
import { formatCurrency, formatDateSafe } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";
import { EscrowActionCard } from "@/components/jobs/escrow-action-card";
import { use } from "react";

export default function EmployerJobManagementPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: jobId } = use(params);
  const { connected, address } = useWalletStore();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadJobDetails = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      const data = await res.json();
      if (res.ok && data.job) {
        setJob(data.job);
      } else {
        setError(data.error || "Không tìm thấy dự án.");
      }
    } catch (err) {
      console.error("Load job details error:", err);
      setError("Lỗi kết nối khi tải chi tiết dự án.");
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    loadJobDetails();
  }, [loadJobDetails]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-400 mb-4" />
        <p className="text-white/60">Đang tải bảng quản lý dự án Employer...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-white mb-2">{error || "Không tìm thấy công việc"}</h1>
        <Link href="/dashboard/employer" className="btn-primary inline-flex items-center gap-2 mt-4">
          <ArrowLeft className="h-4 w-4" /> Bảng Quản Lý Employer
        </Link>
      </div>
    );
  }

  const currentAddr = (address || "").toLowerCase();
  const employerAddr = (job.employerAddress || job.employer?.walletAddress || "").toLowerCase();
  const isOwner = connected && currentAddr !== "" && currentAddr === employerAddr;

  const applications = job.applications || [];
  const contract = job.contract;

  // Xử lý Chấp nhận ứng viên (Hire)
  const handleHireApplicant = async (freelancerAddress: string, bidAmount: number) => {
    if (!isOwner) {
      alert("Chỉ chủ dự án mới có quyền chọn ứng viên.");
      return;
    }

    if (!confirm(`Xác nhận tuyển dụng Freelancer (${freelancerAddress.slice(0, 6)}...) với mức ngân sách $${bidAmount}?`)) {
      return;
    }

    setActionLoading(freelancerAddress);
    try {
      const res = await fetch(`/api/jobs/${jobId}/hire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employerAddress: address,
          freelancerAddress,
          totalAmount: bidAmount
        })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        alert("Tuyển chọn thành công! Hợp đồng Escrow đã được khởi tạo. Hãy thực hiện nạp cọc Escrow.");
        loadJobDetails();
      } else {
        alert(data.error || "Không thể thực hiện phê duyệt.");
      }
    } catch (err) {
      console.error("Hire applicant error:", err);
      alert("Lỗi kết nối khi duyệt nhận việc.");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Back Link */}
      <div className="mb-6">
        <Link
          href="/dashboard/employer"
          className="inline-flex items-center gap-2 text-xs font-medium text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Quay lại Bảng Quản Lý Employer
        </Link>
      </div>

      {/* Header Overview */}
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 sm:p-8 mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                {job.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                <Database className="h-3.5 w-3.5" /> Quản Lý Nội Bộ Bên A
              </span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                job.status === "COMPLETED" || job.status === "completed"
                  ? "bg-green-500/10 text-green-300 border-green-500/20"
                  : job.status === "IN_PROGRESS" || job.status === "in_progress"
                  ? "bg-amber-500/10 text-amber-300 border-amber-500/20"
                  : "bg-blue-500/10 text-blue-300 border-blue-500/20"
              }`}>
                {job.status}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mt-2">
              {job.title}
            </h1>
            <p className="text-sm text-white/60 line-clamp-2">
              {job.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <span className="text-xs text-white/50 block">Ngân sách bài đăng</span>
              <span className="font-display text-2xl font-bold text-white">
                {formatCurrency(job.budget)} <span className="text-sm font-normal text-white/60">{job.tokenSymbol || "USDC"}</span>
              </span>
            </div>
            <Link
              href={`/jobs/${jobId}`}
              target="_blank"
              className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 underline underline-offset-4 mt-1"
            >
              Xem giao diện công khai <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main Grid Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Applicants & Submissions */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section 1: Escrow Smart Contract Manager */}
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-bold text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-cyan-400" /> Bảng Điều Khiển Escrow Smart Contract
            </h3>
            <EscrowActionCard job={job} onRefresh={loadJobDetails} />
          </div>

          {/* Section 2: Applicants List */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-lg font-bold text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-cyan-400" /> Danh Sách Hồ Sơ Ứng Tuyển ({applications.length})
                </h3>
                <p className="text-xs text-white/50 mt-0.5">
                  Xem hồ sơ thầu, chọn ứng viên xuất sắc và khởi tạo hợp đồng Escrow
                </p>
              </div>
            </div>

            {applications.length === 0 ? (
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-8 text-center">
                <Users className="h-10 w-10 text-white/20 mx-auto mb-3" />
                <p className="text-sm font-medium text-white/70">Chưa có ứng viên nào nộp hồ sơ vào dự án này.</p>
                <p className="text-xs text-white/40 mt-1">Bài đăng vẫn đang hiển thị công khai trên Marketplace.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app: any) => {
                  const isHiredThisApp = contract && contract.freelancerAddress.toLowerCase() === app.freelancerAddress.toLowerCase();
                  return (
                    <div
                      key={app.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isHiredThisApp
                          ? "border-green-500/40 bg-green-500/5 shadow-lg shadow-green-500/5"
                          : "border-white/10 bg-white/[0.02] hover:border-violet-500/30"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={app.freelancer?.avatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${app.freelancerAddress}`}
                            alt="Freelancer"
                            className="h-12 w-12 rounded-xl object-cover bg-white/10 border border-white/10"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-white text-base">
                                {app.freelancer?.name || `Freelancer ${app.freelancerAddress.slice(0, 6)}...`}
                              </h4>
                              {isHiredThisApp && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                                  <UserCheck className="h-3 w-3" /> Đã Nhận Việc
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-white/50 font-mono mt-0.5">{app.freelancerAddress}</p>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-xs text-white/40 block">Giá thầu đề xuất</span>
                          <span className="font-display text-lg font-bold text-cyan-300">
                            {formatCurrency(app.proposalBid)}
                          </span>
                          <span className="text-xs text-white/50 block mt-0.5">
                            Thời hạn cam kết: {app.estimatedDays} ngày
                          </span>
                        </div>
                      </div>

                      {/* Cover letter */}
                      <div className="mt-4 p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-white/80 leading-relaxed">
                        <span className="font-medium text-white/90 block mb-1">Thư chào thầu (Cover Letter):</span>
                        <p className="italic text-white/70">"{app.coverLetter}"</p>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
                        <span className="text-[11px] text-white/40">Nộp đơn: {formatDateSafe(app.createdAt)}</span>
                        
                        {!contract && isOwner && (
                          <button
                            onClick={() => handleHireApplicant(app.freelancerAddress, app.proposalBid)}
                            disabled={actionLoading === app.freelancerAddress}
                            className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
                          >
                            {actionLoading === app.freelancerAddress ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <ShieldCheck className="h-4 w-4" />
                            )}
                            Chấp Nhận & Nạp Cọc Escrow
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right 1 Column: Job Metadata Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-display text-base font-bold text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-violet-400" /> Thông Tin Bài Đăng
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-white/40 block mb-1">Địa chỉ chủ bài đăng (Employer):</span>
                <span className="font-mono text-white/80 break-all bg-white/[0.03] p-2 rounded-lg block border border-white/5">
                  {job.employerAddress}
                </span>
              </div>

              <div>
                <span className="text-white/40 block mb-1">Kỹ năng yêu cầu:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {job.skills && job.skills.length > 0 ? (
                    job.skills.map((skill: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-white/5 text-white/70 border border-white/10 text-[11px]">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-white/50">Chưa ghi nhận</span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-white/40 block mb-1">Hình thức & Địa điểm:</span>
                <span className="text-white/80 font-medium capitalize">{job.location || "Remote"}</span>
              </div>

              <div>
                <span className="text-white/40 block mb-1">Thời gian tạo:</span>
                <span className="text-white/80 font-medium">{formatDateSafe(job.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
