"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { jobs } from "@/data/jobs";
import { JobCard } from "@/components/marketplace/job-card";

export function FeaturedJobs() {
  const featuredJobs = jobs.slice(0, 6);

  return (
    <section className="relative py-24">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-400">
              Featured Jobs
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Hot <span className="gradient-text">opportunities</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/60">
              Discover premium projects from verified clients ready to hire.
            </p>
          </div>
          
          <Link
            href="/marketplace"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredJobs.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card mt-12 overflow-hidden"
        >
          <div className="flex flex-col items-center gap-6 p-8 md:flex-row">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-xl font-bold text-white">
                Can&apos;t find the perfect match?
              </h3>
              <p className="mt-1 text-white/60">
                Post a custom job and let talented freelancers come to you.
              </p>
            </div>
            <Link
              href="/post-job"
              className="btn-primary inline-flex items-center gap-2"
            >
              Post a Job
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
