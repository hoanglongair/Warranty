"use client";

import { motion } from "framer-motion";

export function JobCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden p-5"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="h-5 w-20 rounded-full bg-white/[0.06] animate-pulse" />
        <div className="h-4 w-16 rounded bg-white/[0.06] animate-pulse" />
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-5 w-4/5 rounded bg-white/[0.06] animate-pulse" />
        <div className="h-5 w-3/5 rounded bg-white/[0.06] animate-pulse" />
      </div>

      <div className="space-y-1.5 mb-4">
        <div className="h-3 w-full rounded bg-white/[0.04] animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-white/[0.04] animate-pulse" />
      </div>

      <div className="flex gap-2 mb-4">
        <div className="h-6 w-16 rounded-lg bg-white/[0.06] animate-pulse" />
        <div className="h-6 w-20 rounded-lg bg-white/[0.06] animate-pulse" />
        <div className="h-6 w-14 rounded-lg bg-white/[0.06] animate-pulse" />
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-white/[0.06] animate-pulse" />
          <div className="space-y-1">
            <div className="h-3 w-20 rounded bg-white/[0.06] animate-pulse" />
            <div className="h-2 w-14 rounded bg-white/[0.04] animate-pulse" />
          </div>
        </div>
        <div className="h-7 w-20 rounded-lg bg-white/[0.06] animate-pulse" />
      </div>
    </motion.div>
  );
}

export function FreelancerCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card overflow-hidden p-5"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-14 w-14 rounded-full bg-white/[0.06] animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/5 rounded bg-white/[0.06] animate-pulse" />
          <div className="h-3 w-2/5 rounded bg-white/[0.04] animate-pulse" />
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-white/[0.04] animate-pulse" />
        <div className="h-3 w-5/6 rounded bg-white/[0.04] animate-pulse" />
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        <div className="h-6 w-14 rounded bg-white/[0.06] animate-pulse" />
        <div className="h-6 w-16 rounded bg-white/[0.06] animate-pulse" />
        <div className="h-6 w-12 rounded bg-white/[0.06] animate-pulse" />
      </div>

      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/5">
        <div className="space-y-1">
          <div className="h-4 w-8 mx-auto rounded bg-white/[0.06] animate-pulse" />
          <div className="h-2 w-12 mx-auto rounded bg-white/[0.04] animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-4 w-8 mx-auto rounded bg-white/[0.06] animate-pulse" />
          <div className="h-2 w-12 mx-auto rounded bg-white/[0.04] animate-pulse" />
        </div>
        <div className="space-y-1">
          <div className="h-4 w-8 mx-auto rounded bg-white/[0.06] animate-pulse" />
          <div className="h-2 w-12 mx-auto rounded bg-white/[0.04] animate-pulse" />
        </div>
      </div>
    </motion.div>
  );
}
