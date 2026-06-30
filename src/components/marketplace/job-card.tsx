"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Clock,
  Users,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Briefcase
} from "lucide-react";
import type { Job } from "@/types";
import { formatCurrency, timeAgo, getCategoryBg } from "@/lib/utils";
import { useJobStore } from "@/store/job-store";

interface JobCardProps {
  job: Job;
  index?: number;
}

const experienceLabels = {
  entry: "Entry",
  intermediate: "Intermediate",
  expert: "Expert"
};

export function JobCard({ job, index = 0 }: JobCardProps) {
  const { bookmarkedJobs, bookmarkJob, unbookmarkJob } = useJobStore();
  const isBookmarked = bookmarkedJobs.includes(job.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/jobs/${job.id}`} className="block">
        <div className="glass-card hover-lift relative h-full overflow-hidden p-5">
          <div
            className={`absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-50`}
            style={{
              background: job.category === "design"
                ? "rgba(236, 72, 153, 0.4)"
                : job.category === "development"
                ? "rgba(139, 92, 246, 0.4)"
                : job.category === "content"
                ? "rgba(245, 158, 11, 0.4)"
                : "rgba(6, 182, 212, 0.4)"
            }}
          />

          <div className="relative">
            <div className="mb-3 flex items-start justify-between gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${getCategoryBg(job.category)}`}
              >
                <span className="capitalize">{job.category}</span>
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  isBookmarked ? unbookmarkJob(job.id) : bookmarkJob(job.id);
                }}
                className="rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Bookmark job"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 text-violet-400" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </button>
            </div>

            <h3 className="line-clamp-2 font-display text-base font-semibold text-white group-hover:text-violet-200">
              {job.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm text-white/50">
              {job.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {job.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/70"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="rounded-md border border-white/5 bg-white/[0.03] px-2 py-0.5 text-[11px] text-white/50">
                  +{job.skills.length - 3}
                </span>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
              <div>
                <p className="text-xs text-white/40">Budget</p>
                <p className="font-display text-lg font-bold text-white">
                  {formatCurrency(job.budget)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/40">Applicants</p>
                <p className="font-display text-lg font-bold text-white">
                  {job.applicants}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-[11px] text-white/40">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3 w-3" />
                  {experienceLabels[job.experience]}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {job.duration}
                </span>
              </div>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {timeAgo(job.postedAt)}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-[10px] font-bold text-white">
                  {job.employer.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-xs font-medium text-white">
                      {job.employer.name}
                    </p>
                    {job.employer.verified && (
                      <CheckCircle2 className="h-3 w-3 text-violet-400" />
                    )}
                  </div>
                  <p className="text-[10px] text-white/40">
                    ★ {job.employer.rating} · {job.employer.jobsPosted} jobs
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
