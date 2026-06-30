"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Briefcase, Users, DollarSign, Clock, MapPin, Star, CheckCircle2, Calendar, ArrowRight, Share2 } from "lucide-react";
import { jobs } from "@/data/jobs";
import { formatCurrency } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";
import { WalletButton } from "@/components/wallet/wallet-button";

interface JobDetailsClientProps {
  id: string;
}

export function JobDetailsClient({ id: jobId }: JobDetailsClientProps) {
  const job = jobs.find((j) => j.id === jobId);
  const { connected } = useWalletStore();

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

  const similarJobs = jobs.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 3);

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
                  <span className="text-xs text-white/50">{job.subcategory}</span>
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
                <span>{job.duration}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="capitalize">{job.type}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Due {new Date(job.deadline).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-white">About This Project</h2>
              <p className="mt-4 leading-relaxed text-white/70">{job.longDescription}</p>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-white">Required Skills</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-white">Requirements</h2>
              <ul className="mt-4 space-y-3">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-violet-400 mt-0.5" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h2 className="font-display text-lg font-bold text-white">Deliverables</h2>
              <ul className="mt-4 space-y-3">
                {job.deliverables.map((del, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-[10px] font-bold text-violet-300">
                      {i + 1}
                    </div>
                    {del}
                  </li>
                ))}
              </ul>
            </div>
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
              ) : (
                <button className="btn-primary w-full">
                  Apply Now
                </button>
              )}
            </div>

            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-white/50">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{job.applicants} applicants</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{job.duration}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6"
          >
            <h3 className="font-display text-lg font-bold text-white mb-4">About the Client</h3>
            
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 font-bold text-white">
                {job.employer.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-white">{job.employer.name}</p>
                  {job.employer.verified && (
                    <CheckCircle2 className="h-4 w-4 text-violet-400" />
                  )}
                </div>
                <p className="text-xs text-white/50">{job.employer.company}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="flex items-center justify-center gap-1 font-semibold text-white">
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  {job.employer.rating}
                </p>
                <p className="text-xs text-white/50 mt-1">{job.employer.reviews} reviews</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <p className="font-semibold text-white">{job.employer.jobsPosted}</p>
                <p className="text-xs text-white/50 mt-1">Jobs posted</p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/50">Location</span>
                <span className="text-white">{job.employer.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Member since</span>
                <span className="text-white">{job.employer.memberSince}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/50">Total spent</span>
                <span className="text-white">${(job.employer.totalSpent / 1000).toFixed(0)}K+</span>
              </div>
            </div>

            <div className="mt-6">
              <p className="text-xs text-white/40 font-mono truncate">{job.employer.walletAddress}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6"
          >
            <h3 className="font-display text-lg font-bold text-white mb-4">Freelancer Proposal</h3>
            <p className="text-sm text-white/60 mb-4">
              Submit your proposal to apply for this job. Include your approach, timeline, and relevant experience.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Your Bid</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="number"
                    placeholder="Enter amount"
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] pl-10 pr-4 text-sm text-white placeholder-white/40 outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Cover Letter</label>
                <textarea
                  placeholder="Describe your approach and why you're the best fit..."
                  rows={4}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white placeholder-white/40 outline-none focus:border-violet-500/50 resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/60 mb-2">Delivery Time</label>
                <select className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-white outline-none focus:border-violet-500/50">
                  <option value="">Select delivery time</option>
                  <option value="1">1 week</option>
                  <option value="2">2 weeks</option>
                  <option value="3">3 weeks</option>
                  <option value="4">1 month</option>
                </select>
              </div>
              <button className="btn-primary w-full">
                Submit Proposal
              </button>
            </div>
          </motion.div>
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
