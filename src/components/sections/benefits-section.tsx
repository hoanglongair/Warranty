"use client";

import { motion } from "framer-motion";
import { Shield, Zap, BadgeCheck, Globe2, Lock, Users } from "lucide-react";

const benefits = [
  {
    icon: Shield,
    title: "Smart Contract Escrow",
    description: "Every payment is secured by blockchain technology. Funds are locked until both parties are satisfied.",
    gradient: "from-violet-500 to-purple-500",
    stats: "$28M+ secured"
  },
  {
    icon: Zap,
    title: "Instant Settlements",
    description: "No more waiting days for payments. Receive funds in seconds via USDC, ETH, or USDT.",
    gradient: "from-amber-500 to-orange-500",
    stats: "< 30 sec settlement"
  },
  {
    icon: BadgeCheck,
    title: "NFT Credentials",
    description: "Build your on-chain reputation with verifiable credentials that travel with you across Web3.",
    gradient: "from-pink-500 to-rose-500",
    stats: "12K+ NFTs issued"
  },
  {
    icon: Globe2,
    title: "Global Talent Pool",
    description: "Access elite freelancers from 142+ countries, each verified and ready to deliver exceptional work.",
    gradient: "from-cyan-500 to-blue-500",
    stats: "18K+ verified pros"
  },
  {
    icon: Lock,
    title: "Bank-Grade Security",
    description: "Your data and transactions are protected by enterprise-grade encryption and security protocols.",
    gradient: "from-emerald-500 to-teal-500",
    stats: "99.99% uptime"
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "Our team of experts is available 24/7 to help with any questions or concerns you may have.",
    gradient: "from-indigo-500 to-blue-500",
    stats: "24/7 available"
  }
];

export function BenefitsSection() {
  return (
    <section className="relative py-24">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-pink-400">
            Why Warranty
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Built for the <span className="gradient-text">future of work</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
            Experience the next generation of freelancing with Web3-powered security and global reach.
          </p>
        </motion.div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group"
            >
              <div className="glass-card hover-lift relative h-full overflow-hidden p-6">
                <div
                  className={`absolute -right-12 -bottom-12 h-40 w-40 rounded-full opacity-10 blur-3xl transition-opacity group-hover:opacity-25 bg-gradient-to-br ${benefit.gradient}`}
                />
                
                <div className="relative">
                  <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient}`}>
                    <benefit.icon className="h-6 w-6 text-white" />
                  </div>
                  
                  <h3 className="mt-4 font-display text-lg font-bold text-white">
                    {benefit.title}
                  </h3>
                  
                  <p className="mt-2 text-sm leading-relaxed text-white/60">
                    {benefit.description}
                  </p>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <div className={`h-1 w-8 rounded-full bg-gradient-to-r ${benefit.gradient}`} />
                    <span className="text-xs font-medium text-white/40">
                      {benefit.stats}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card mt-16 overflow-hidden"
        >
          <div className="flex flex-col items-center gap-8 p-8 md:flex-row">
            <div className="flex-1 text-center md:text-left">
              <h3 className="font-display text-2xl font-bold text-white">
                Ready to transform your workflow?
              </h3>
              <p className="mt-2 text-white/60">
                Join thousands of companies and freelancers who trust Warranty for their success.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {["#a78bfa", "#ec4899", "#22d3ee", "#f59e0b"].map((color, i) => (
                  <div
                    key={i}
                    className="h-10 w-10 rounded-full border-2 border-[hsl(var(--background))] bg-gradient-to-br"
                    style={{ background: color }}
                  />
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold text-white">5,000+ happy users</p>
                <p className="text-white/50">joined this month</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
