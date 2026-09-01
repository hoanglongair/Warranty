"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Users, DollarSign, MapPin, Star, CheckCircle2, Calendar, ArrowRight, Share2, Loader2, Clock } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";
import { useJobStore } from "@/store/job-store";
import { WalletButton } from "@/components/wallet/wallet-button";
import { CustomSelect } from "@/components/ui/custom-select";
import { EscrowActionCard } from "@/components/jobs/escrow-action-card";

interface JobDetailsClientProps {
  id: string;
}

export function JobDetailsClient({ id: jobId }: JobDetailsClientProps) {
  const { connected, address } = useWalletStore();
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deliveryTime, setDeliveryTime] = useState("7");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/jobs/${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.job) {
          setJob(data.job);
        } else {
          setJob(null);
        }
      })
      .catch((err) => {
        console.error("Fetch job error:", err);
        setJob(null);
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-violet-400 mb-4" />
        <p className="text-white/60">Đang tải thông tin chi tiết công việc...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Job not found</h1>
        <Link href="/marketplace" className="mt-4 btn-primary inline-flex items-center gap-2">
          Back to Marketplace
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const allStoreJobs = useJobStore.getState().jobs || [];
  const similarJobs = allStoreJobs.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 3);
  const employer = job.employer || {
    name: job.employer?.name || (job.employerAddress ? `User ${job.employerAddress.slice(0, 6)}...` : "Employer"),
    company: "Decentralized Employer",
    rating: 5.0,
    reviews: 12,
    jobsPosted: 1,
    location: job.location || "Remote",
    memberSince: "2024",
    totalSpent: job.budget || 0,
    verified: true
  };

  const isEmployer = Boolean(
    connected &&
      address &&
      job &&
      ((job.employerAddress && job.employerAddress.toLowerCase() === address.toLowerCase()) ||
        (job.employer?.walletAddress && job.employer.walletAddress.toLowerCase() === address.toLowerCase()))
  );

  // Chỉ cho ứng tuyển khi job đang mở (chưa hire / chưa hoàn thành / chưa hủy)
  const jobStatus = (job.status || "OPEN").toString().toUpperCase();
  const isOpenForApply = jobStatus === "OPEN";
  const jobStatusLabel: Record<string, string> = {
    IN_PROGRESS: "Dự án đã tuyển được freelancer và đang thực hiện.",
    COMPLETED: "Dự án đã hoàn thành và giải ngân. Không còn nhận ứng tuyển.",
    CANCELLED: "Dự án đã bị hủy. Không còn nhận ứng tuyển."
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <ArrowRight className="h-4 w-4 rotate-180" />
          Back to Marketplace
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium ${getCategoryBg(job.category)}`}>
                    <span className="capitalize">{job.category}</span>
                  </span>
                  <span className="text-xs text-white/50">{job.subcategory || job.category}</span>
                </div>
                <h1 className="font-display text-3xl font-bold text-white">
                  {job.title}
                </h1>
              </div>
              <button className="p-2 rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:text-white transition-colors">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="text-white font-semibold">{formatCurrency(job.budget)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{job.duration || job.deadline || "1-2 weeks"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="capitalize">{job.type || job.location || "remote"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Due {new Date(job.deadline || Date.now()).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-white">About This Project</h2>
              <p className="mt-4 leading-relaxed text-white/70 whitespace-pre-line">{job.longDescription || job.description}</p>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-white">Required Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {(job.skills || []).map((skill: string) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {job.requirements && job.requirements.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-bold text-white">Requirements</h2>
                <ul className="mt-4 space-y-3">
                  {job.requirements.map((req: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-violet-400 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {job.deliverables && job.deliverables.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-lg font-bold text-white">Deliverables</h2>
                <ul className="mt-4 space-y-3">
                  {job.deliverables.map((del: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-[10px] font-bold text-violet-300">
                        {i + 1}
                      </div>
                      {del}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h2 className="font-display text-lg font-bold text-white">Similar Jobs</h2>
            <div className="mt-4 space-y-4">
              {similarJobs.map((similarJob) => (
                <Link
                  key={similarJob.id}
                  href={`/jobs/${similarJob.id}`}
                  className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
                >
                  <div>
                    <h3 className="font-medium text-white">{similarJob.title}</h3>
                    <p className="text-xs text-white/50 mt-1">{similarJob.subcategory}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{formatCurrency(similarJob.budget)}</p>
                    <p className="text-xs text-white/50 mt-1">{similarJob.applicants} applicants</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <EscrowActionCard
            job={job}
            onRefresh={() => {
              fetch(`/api/jobs/${jobId}`)
                .then((res) => res.json())
                .then((data) => { if (data.job) setJob(data.job); })
                .catch(() => null);
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6"
          >
            <div className="text-center">
              <p className="text-sm text-white/50">Budget Range</p>
              <p className="mt-2 font-display text-3xl font-bold text-white">
                {formatCurrency(job.budget)}
              </p>
              <p className="mt-1 text-xs text-white/40">Fixed price project</p>
            </div>

            <div className="mt-6 space-y-3">
              {!connected ? (
                <div className="space-y-3">
                  <WalletButton />
                  <p className="text-xs text-center text-white/50">
                    Connect your wallet to apply for this job
                  </p>
                </div>
              ) : isEmployer ? (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-center text-xs text-amber-200">
                  Bạn là chủ bài đăng dự án này.
                </div>
              ) : !isOpenForApply ? (
                <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-center text-xs text-white/60">
                  {jobStatusLabel[jobStatus] || "Dự án hiện không nhận ứng tuyển."}
                </div>
              ) : (
                <a href="#proposal-form" className="btn-primary w-full text-center block">
                  Apply Now
                </a>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{job.applicants ?? (job.proposals?.length || 0)} applicants</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{job.duration || "1-2 weeks"}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="font-display text-lg font-bold text-white mb-4">About the Employer</h3>
            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 font-bold text-white">
                {employer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{employer.name}</p>
                  <CheckCircle2 className="h-4 w-4 text-violet-400" />
                </div>
                <p className="text-xs text-white/50">{employer.company}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="flex items-center justify-center gap-1 font-semibold text-white">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  {employer.rating || 5.0}
                </p>
                <p className="text-xs text-white/50 mt-1">{employer.reviews || 12} reviews</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="font-semibold text-white">{employer.jobsPosted || 1}</p>
                <p className="text-xs text-white/50 mt-1">Jobs posted</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Location</span>
                <span className="text-white">{employer.location || "Global"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Member since</span>
                <span className="text-white">{employer.memberSince || "2024"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Total spent</span>
                <span className="text-white">${((employer.totalSpent || job.budget || 0) / 1000).toFixed(0)}K+</span>
              </div>
            </div>

            {employer.walletAddress && (
              <div className="mt-6">
                <p className="text-xs text-white/40 font-mono truncate">{employer.walletAddress}</p>
              </div>
            )}
          </motion.div>

          {!isEmployer && isOpenForApply ? (
            <motion.div
              id="proposal-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-6"
            >
              <h3 className="font-display text-lg font-bold text-white mb-4">Freelancer Proposal</h3>
              <p className="text-sm text-white/60 mb-4">
                Submit your proposal to apply for this job. Include your approach, timeline, and relevant experience.
              </p>
              <form
                onSubmit={async (e) => {
                e.preventDefault();
                if (!connected || !address) {
                  alert("Vui lòng kết nối ví để nộp đơn ứng tuyển.");
                  return;
                }
                const formData = new FormData(e.currentTarget);
                const bid = formData.get("bid");
                const coverLetter = formData.get("coverLetter");
                const deliveryTime = formData.get("deliveryTime");

                try {
                  const res = await fetch(`/api/jobs/${jobId}/apply`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      freelancerAddress: address,
                      proposalBid: Number(bid || job.budget),
                      coverLetter: coverLetter || "Tôi rất hứng thú với công việc này và muốn ứng tuyển.",
                      estimatedDays: Number(deliveryTime || 7)
                    })
                  });
                  const data = await res.json();
                  if (res.ok && data.success) {
                    alert("Gửi đơn ứng tuyển thành công!");
                  } else {
                    alert(data.error || "Không thể gửi đơn ứng tuyển.");
                  }
                } catch (err) {
                  console.error("Apply error:", err);
                  alert("Lỗi kết nối khi nộp đơn.");
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Your Bid ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    name="bid"
                    type="number"
                    defaultValue={job.budget}
                    placeholder="Enter amount"
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Cover Letter</label>
                <textarea
                  name="coverLetter"
                  placeholder="Describe your approach and why you're the best fit..."
                  rows={4}
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white placeholder-white/40 outline-none focus:border-violet-500/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Delivery Time</label>
                <CustomSelect
                  options={[
                    { value: "7", label: "1 week" },
                    { value: "14", label: "2 weeks" },
                    { value: "21", label: "3 weeks" },
                    { value: "30", label: "1 month" }
                  ]}
                  value={deliveryTime}
                  onChange={(val) => setDeliveryTime(val)}
                />
                <input type="hidden" name="deliveryTime" value={deliveryTime} />
              </div>
              {!connected ? (
                <div className="space-y-2">
                  <WalletButton />
                  <p className="text-xs text-center text-white/50">Connect wallet to submit proposal</p>
                </div>
              ) : (
                <button type="submit" className="btn-primary w-full">
                  Submit Proposal
                </button>
              )}
            </form>
          </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function getCategoryBg(category: string): string {
  const colors: Record<string, string> = {
    design: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    development: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    content: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    marketing: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
  };
  return colors[category] || "bg-violet-500/10 text-violet-300 border-violet-500/20";
}
