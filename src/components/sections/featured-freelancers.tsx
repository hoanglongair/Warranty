"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { freelancers } from "@/data/freelancers";
import { FreelancerCard } from "@/components/marketplace/freelancer-card";

export function FeaturedFreelancers() {
  const featuredFreelancers = freelancers.slice(0, 6);

  return (
    <section className="relative py-24">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
              Top Talent
            </p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Elite <span className="gradient-text">freelancers</span>
            </h2>
            <p className="mt-4 max-w-xl text-lg text-white/60">
              Connect with verified professionals ready to bring your vision to life.
            </p>
          </div>
          
          <Link
            href="/marketplace?tab=freelancers"
            className="btn-secondary inline-flex items-center gap-2"
          >
            View All Freelancers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featuredFreelancers.map((freelancer, i) => (
            <FreelancerCard key={freelancer.id} freelancer={freelancer} index={i} />
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
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-xl font-bold text-white">
                Ready to showcase your skills?
              </h3>
              <p className="mt-1 text-white/60">
                Create your profile and start receiving proposals from top clients.
              </p>
            </div>
            <Link
              href="/profile"
              className="btn-primary inline-flex items-center gap-2"
            >
              Create Profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
