"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, DollarSign, Users, Star, TrendingUp, Clock, 
  CheckCircle2, XCircle, ArrowRight, FileText, Eye, MoreVertical
} from "lucide-react";
import { jobs } from "@/data/jobs";
import { freelancers } from "@/data/freelancers";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { useWalletStore } from "@/store/wallet-store";

type Tab = "employer" | "freelancer";
type Status = "active" | "completed" | "hired" | "proposals";

export default function DashboardPage() {
  const [tab, setTab] = useState<Tab>("employer");
  const [status, setStatus] = useState<Status>("active");
  const { connected, address } = useWalletStore();

  const mockEmployerJobs = jobs.slice(0, 4);
  const mockProposals = jobs[0].proposals.length > 0 ? jobs[0].proposals : [
    { id: "prop-1", freelancerId: "fre-001", freelancer: freelancers[0], jobId: "job-001", coverLetter: "I'd love to work on this project!", bidAmount: 1200, deliveryDays: 7, submittedAt: "2026-06-14T10:00:00Z", status: "pending" as const },
    { id: "prop-2", freelancerId: "fre-002", freelancer: freelancers[1], jobId: "job-001", coverLetter: "I have extensive experience in Web3 design.", bidAmount: 1500, deliveryDays: 5, submittedAt: "2026-06-13T15:00:00Z", status: "shortlisted" as const },
    { id: "prop-3", freelancerId: "fre-003", freelancer: freelancers[2], jobId: "job-001", coverLetter: "Let me show you my portfolio.", bidAmount: 1000, deliveryDays: 10, submittedAt: "2026-06-12T09:00:00Z", status: "pending" as const },
  ];

  const mockFreelancerProjects = [
    { id: "proj-1", title: "Web3 Landing Page Design", client: "Aurora Labs", status: "in_progress", earned: 750, progress: 50 },
    { id: "proj-2", title: "Brand Identity Package", client: "Prism Studio", status: "completed", earned: 4000, progress: 100 },
    { id: "proj-3", title: "React Dashboard", client: "Nebula DAO", status: "in_progress", earned: 1750, progress: 30 },
  ];

  const stats = tab === "employer" ? [
    { label: "Active Jobs", value: "3", icon: Briefcase, color: "from-violet-500 to-purple-500" },
    { label: "Total Applicants", value: "48", icon: Users, color: "from-cyan-500 to-blue-500" },
    { label: "Hired", value: "12", icon: CheckCircle2, color: "from-green-500 to-emerald-500" },
    { label: "Total Spent", value: "$24.5K", icon: DollarSign, color: "from-amber-500 to-orange-500" },
  ] : [
    { label: "Active Projects", value: "2", icon: Briefcase, color: "from-violet-500 to-purple-500" },
    { label: "Proposals Sent", value: "15", icon: FileText, color: "from-pink-500 to-rose-500" },
    { label: "Total Earned", value: "$124K", icon: TrendingUp, color: "from-green-500 to-emerald-500" },
    { label: "Avg. Rating", value: "4.9", icon: Star, color: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Dashboard
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          Manage your projects, track earnings, and connect with {tab === "employer" ? "freelancers" : "clients"}.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 max-w-md">
          <button
            onClick={() => setTab("employer")}
            className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === "employer" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab === "employer" && (
              <motion.div
                layoutId="dashboard-tab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 ring-1 ring-white/10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">Người Thuê (Employer)</span>
          </button>
          <button
            onClick={() => setTab("freelancer")}
            className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === "freelancer" ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {tab === "freelancer" && (
              <motion.div
                layoutId="dashboard-tab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 ring-1 ring-white/10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">Người Được Thuê (Freelancer)</span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/50">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {tab === "employer" ? (
          <motion.div
            key="employer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 border-b border-white/5">
              {(["active", "hired", "proposals", "completed"] as Status[]).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`pb-3 text-sm font-medium capitalize transition-colors ${
                    status === s ? "text-white border-b-2 border-violet-500" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {status === "proposals" ? (
              <div className="space-y-4">
                {mockProposals.map((proposal) => (
                  <div key={proposal.id} className="glass-card p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 font-bold text-white">
                          {proposal.freelancer.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{proposal.freelancer.name}</h3>
                          <p className="text-sm text-white/50">{proposal.freelancer.title}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-white">{formatCurrency(proposal.bidAmount)}</p>
                        <p className="text-xs text-white/50">{proposal.deliveryDays} days</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-white/60">{proposal.coverLetter}</p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-white/50">
                        <span className="flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                          {proposal.freelancer.rating}
                        </span>
                        <span>{proposal.freelancer.completedJobs} projects</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors">
                          View Profile
                        </button>
                        <button className="btn-primary px-3 py-1.5 text-xs">
                          Hire
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2">
                {mockEmployerJobs.slice(0, status === "active" ? 3 : status === "hired" ? 1 : 2).map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`}>
                    <div className="glass-card hover-lift p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-display text-lg font-semibold text-white">{job.title}</h3>
                          <p className="text-sm text-white/50 mt-1">{job.subcategory}</p>
                        </div>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                          status === "completed" ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                        }`}>
                          {status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {status === "active" ? "Active" : status === "hired" ? "In Progress" : "Completed"}
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <p className="font-display text-xl font-bold text-white">{formatCurrency(job.budget)}</p>
                        <div className="flex items-center gap-1 text-sm text-white/50">
                          <Users className="h-4 w-4" />
                          <span>{job.applicants} applicants</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="freelancer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {mockFreelancerProjects.map((project) => (
                <div key={project.id} className="glass-card hover-lift p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">{project.title}</h3>
                      <p className="text-sm text-white/50 mt-1">{project.client}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${
                      project.status === "completed" ? "bg-green-500/10 text-green-300 border border-green-500/20" : "bg-violet-500/10 text-violet-300 border border-violet-500/20"
                    }`}>
                      {project.status === "completed" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      {project.status === "completed" ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-white/50 mb-1">
                      <span>Progress</span>
                      <span>{project.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-white/50">
                      Earned: <span className="text-white font-semibold">{formatCurrency(project.earned)}</span>
                    </p>
                    <button className="flex items-center gap-1 text-xs text-violet-300 hover:text-violet-200">
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card p-6">
              <h3 className="font-display text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  { action: "New proposal received", job: "Web3 Landing Page Design", time: "2 hours ago" },
                  { action: "Milestone completed", job: "Brand Identity Package", time: "1 day ago" },
                  { action: "Payment received", job: "React Dashboard", time: "3 days ago" },
                ].map((activity, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                      <FileText className="h-5 w-5 text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{activity.action}</p>
                      <p className="text-xs text-white/50">{activity.job}</p>
                    </div>
                    <span className="text-xs text-white/40">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
