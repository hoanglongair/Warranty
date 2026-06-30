"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Clock, Users, DollarSign, Star, CheckCircle2, 
  Bookmark, BookmarkCheck, Zap, Shield, Timer
} from "lucide-react";
import type { Task } from "@/types/task";
import { formatCurrency, timeAgo } from "@/lib/utils";

interface TaskCardProps {
  task: Task;
  index?: number;
}

const difficultyConfig = {
  easy: { label: "Easy", color: "text-green-400 bg-green-400/10 border-green-400/20" },
  medium: { label: "Medium", color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
  hard: { label: "Hard", color: "text-red-400 bg-red-400/10 border-red-400/20" }
};

const categoryConfig = {
  design: { color: "bg-pink-500/10 text-pink-300 border-pink-500/20" },
  development: { color: "bg-violet-500/10 text-violet-300 border-violet-500/20" },
  content: { color: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
  marketing: { color: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20" },
  data: { color: "bg-emerald-500/10 text-emerald-300 border-emerald-500/20" },
  other: { color: "bg-slate-500/10 text-slate-300 border-slate-500/20" }
};

export function TaskCard({ task, index = 0 }: TaskCardProps) {
  const difficulty = difficultyConfig[task.difficulty];
  const category = categoryConfig[task.category];
  const spotsLeft = task.maxSubmissions - task.currentSubmissions;
  const isUrgent = new Date(task.deadline).getTime() - Date.now() < 24 * 60 * 60 * 1000;
  const isHot = task.currentSubmissions >= task.maxSubmissions * 0.8;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/tasks/${task.id}`} className="block">
        <div className="glass-card hover-lift relative h-full overflow-hidden p-5">
          {/* Glow effect based on category */}
          <div
            className={`absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-35 ${
              task.category === "design" ? "bg-pink-500" :
              task.category === "development" ? "bg-violet-500" :
              task.category === "content" ? "bg-amber-500" :
              task.category === "marketing" ? "bg-cyan-500" :
              task.category === "data" ? "bg-emerald-500" : "bg-slate-500"
            }`}
          />

          <div className="relative">
            {/* Badges */}
            <div className="mb-3 flex items-center gap-2 flex-wrap">
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium capitalize ${category.color}`}>
                {task.category}
              </span>
              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium ${difficulty.color}`}>
                {difficulty.label}
              </span>
              {isHot && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-1 text-[10px] font-medium text-red-400">
                  <Zap className="h-2.5 w-2.5" />
                  Hot
                </span>
              )}
              {isUrgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 text-[10px] font-medium text-amber-400">
                  <Timer className="h-2.5 w-2.5" />
                  Urgent
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="font-display text-base font-semibold text-white group-hover:text-violet-200 line-clamp-2">
              {task.title}
            </h3>

            {/* Description */}
            <p className="mt-2 line-clamp-2 text-sm text-white/50">
              {task.description}
            </p>

            {/* Skills */}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {task.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/70"
                >
                  {skill}
                </span>
              ))}
              {task.skills.length > 3 && (
                <span className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/50">
                  +{task.skills.length - 3}
                </span>
              )}
            </div>

            {/* Stats Row */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  <span className="font-display text-lg font-bold text-white">
                    {formatCurrency(task.reward)}
                  </span>
                </div>
                <div className="h-4 w-px bg-white/10" />
                <div className="flex items-center gap-1.5 text-xs text-white/50">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{task.timeEstimate}</span>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-[10px] font-bold text-white">
                  {task.employer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-white">
                      {task.employer.name}
                    </p>
                    {task.employer.verified && (
                      <CheckCircle2 className="h-3 w-3 text-violet-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-white/40">
                    ★ {task.employer.rating} · {task.employer.tasksCompleted} tasks
                  </p>
                </div>
              </div>

              {/* Spots Available */}
              <div className="text-right">
                <p className={`text-xs font-medium ${spotsLeft <= 3 ? "text-red-400" : "text-white/50"}`}>
                  {spotsLeft > 0 ? `${spotsLeft} spots left` : "Full"}
                </p>
                <div className="mt-1 h-1.5 w-12 overflow-hidden rounded-full bg-white/10">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-500 transition-all"
                    style={{ width: `${(task.currentSubmissions / task.maxSubmissions) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Posted Time */}
            <div className="mt-3 flex items-center justify-between text-[10px] text-white/40">
              <span>Posted {timeAgo(task.postedAt)}</span>
              <span>Due {new Date(task.deadline).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function TaskCardCompact({ task, index = 0 }: TaskCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link href={`/tasks/${task.id}`} className="block">
        <div className="flex items-center gap-4 p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
            <DollarSign className="h-5 w-5 text-violet-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-white truncate">{task.title}</h4>
            <div className="mt-0.5 flex items-center gap-2 text-xs text-white/50">
              <span className="capitalize">{task.category}</span>
              <span>·</span>
              <span>{task.timeEstimate}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display font-bold text-green-400">{formatCurrency(task.reward)}</p>
            <p className="text-[10px] text-white/40">
              {task.maxSubmissions - task.currentSubmissions} left
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
