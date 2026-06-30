"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  ArrowLeft, Clock, DollarSign, Users, CheckCircle2, Star,
  Calendar, MapPin, Shield, Zap, FileText, Upload, Send,
  AlertCircle, Timer, Award, Bookmark, Share2, Eye
} from "lucide-react";
import { tasks } from "@/data/tasks";
import { formatCurrency, timeAgo } from "@/lib/utils";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useWalletStore } from "@/store/wallet-store";

interface TaskDetailsClientProps {
  id: string;
}

const difficultyConfig = {
  easy: { label: "Easy", color: "text-green-400 bg-green-400/10", desc: "Under 1 hour" },
  medium: { label: "Medium", color: "text-amber-400 bg-amber-400/10", desc: "1-3 hours" },
  hard: { label: "Hard", color: "text-red-400 bg-red-400/10", desc: "3+ hours" }
};

export function TaskDetailsClient({ id }: TaskDetailsClientProps) {
  const [activeTab, setActiveTab] = useState<"details" | "submissions" | "employer">("details");
  const [submissionContent, setSubmissionContent] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { connected } = useWalletStore();

  const task = tasks.find(t => t.id === id);
  
  if (!task) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold text-white">Task not found</h1>
        <Link href="/tasks" className="mt-4 btn-primary inline-flex items-center gap-2">
          Back to Tasks
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const difficulty = difficultyConfig[task.difficulty];
  const spotsLeft = task.maxSubmissions - task.currentSubmissions;
  const isFull = spotsLeft <= 0;
  const isUrgent = new Date(task.deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000;

  const handleSubmit = async () => {
    if (!submissionContent.trim()) return;
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Back Link */}
      <Link
        href="/tasks"
        className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tasks
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-medium text-pink-300 capitalize">
                {task.category}
              </span>
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${difficulty.color}`}>
                {difficulty.label}
              </span>
              {task.status === "open" && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                  Open
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl font-bold text-white">
              {task.title}
            </h1>

            {/* Quick Stats */}
            <div className="mt-6 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-400" />
                <span className="text-white font-semibold">{formatCurrency(task.reward)}</span>
                <span className="text-white/50">reward</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-white/50" />
                <span className="text-white/70">{task.timeEstimate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-white/50" />
                <span className={`${isUrgent ? "text-amber-400" : "text-white/70"}`}>
                  Due {new Date(task.deadline).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-white/50" />
                <span className={spotsLeft <= 3 ? "text-red-400" : "text-white/70"}>
                  {spotsLeft} spots left
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8 flex items-center gap-1 border-b border-white/5">
              {[
                { id: "details", label: "Details" },
                { id: "employer", label: "About Employer" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-3 px-4 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-white border-b-2 border-violet-500"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "details" && (
              <div className="mt-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-white mb-3">Description</h3>
                  <p className="text-white/70 leading-relaxed whitespace-pre-line">
                    {task.description}
                  </p>
                </div>

                {/* Detailed Instructions */}
                <div className="p-4 rounded-xl bg-violet-500/5 border border-violet-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-5 w-5 text-violet-400" />
                    <h4 className="font-semibold text-white">Detailed Instructions</h4>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line">
                    {task.detailedInstructions}
                  </p>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-white mb-3">Requirements</h3>
                  <ul className="space-y-2">
                    {task.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-violet-400 mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Deliverables */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-white mb-3">What to Deliver</h3>
                  <ul className="space-y-2">
                    {task.deliverables.map((del, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-white/70">
                        <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 text-[10px] font-bold text-violet-300">
                          {i + 1}
                        </div>
                        {del}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="font-display text-lg font-semibold text-white mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {task.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "employer" && (
              <div className="mt-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 font-bold text-white text-xl">
                    {task.employer.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white">{task.employer.name}</p>
                      {task.employer.verified && (
                        <CheckCircle2 className="h-4 w-4 text-violet-400" />
                      )}
                    </div>
                    <p className="text-sm text-white/50">{task.employer.company}</p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="flex items-center justify-center gap-1 font-semibold text-white">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      {task.employer.rating}
                    </p>
                    <p className="text-xs text-white/50 mt-1">{task.employer.reviews} reviews</p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-center">
                    <p className="font-semibold text-white">{task.employer.tasksCompleted}</p>
                    <p className="text-xs text-white/50 mt-1">Tasks Done</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Location</span>
                    <span className="text-white flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {task.employer.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Member since</span>
                    <span className="text-white">{task.employer.memberSince}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Submit Work Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 sticky top-24"
          >
            {/* Reward */}
            <div className="text-center mb-6">
              <p className="text-sm text-white/50">Reward</p>
              <p className="font-display text-4xl font-bold text-green-400">
                {formatCurrency(task.reward)}
              </p>
              <p className="text-xs text-white/40 mt-1">Instant payment after approval</p>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs text-white/50 mb-2">
                <span>{task.currentSubmissions} submissions</span>
                <span>{task.maxSubmissions} max</span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                  style={{ width: `${(task.currentSubmissions / task.maxSubmissions) * 100}%` }}
                />
              </div>
            </div>

            {/* Submit Form */}
            {isFull ? (
              <div className="text-center py-6">
                <AlertCircle className="mx-auto h-10 w-10 text-amber-400 mb-3" />
                <p className="text-white font-medium">Task is Full</p>
                <p className="text-sm text-white/50 mt-1">All submission spots have been filled</p>
              </div>
            ) : submitted ? (
              <div className="text-center py-6">
                <CheckCircle2 className="mx-auto h-10 w-10 text-green-400 mb-3" />
                <p className="text-white font-medium">Submission Received!</p>
                <p className="text-sm text-white/50 mt-1">Your work is being reviewed</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Your Submission
                  </label>
                  <textarea
                    value={submissionContent}
                    onChange={(e) => setSubmissionContent(e.target.value)}
                    placeholder="Describe your work or paste your deliverable..."
                    rows={5}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white placeholder-white/40 outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                {!connected ? (
                  <div className="space-y-3">
                    <WalletButton />
                    <p className="text-xs text-center text-white/50">
                      Connect wallet to submit work
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={!submissionContent.trim() || submitting}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Send className="h-4 w-4" />
                        Submit Work
                      </span>
                    )}
                  </button>
                )}
              </div>
            )}

            {/* Benefits */}
            <div className="mt-6 pt-6 border-t border-white/5 space-y-3">
              {[
                { icon: Shield, text: "Escrow protected payment" },
                { icon: Zap, text: "Instant release after approval" },
                { icon: Award, text: "Build your reputation" }
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-white/60">
                  <item.icon className="h-4 w-4 text-violet-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button className="btn-secondary flex-1">
              <Bookmark className="h-4 w-4" />
            </button>
            <button className="btn-secondary flex-1">
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>

          {/* Quick Info */}
          <div className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Posted</span>
              <span className="text-white">{timeAgo(task.postedAt)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Deadline</span>
              <span className={`${isUrgent ? "text-amber-400" : "text-white"}`}>
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/50">Est. Time</span>
              <span className="text-white">{task.timeEstimate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
