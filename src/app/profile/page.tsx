"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, Calendar, Star, Briefcase, DollarSign, Clock, 
  CheckCircle2, ExternalLink, Edit2, Plus, Globe, Twitter, Github
} from "lucide-react";
import { freelancers } from "@/data/freelancers";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";
import { WalletButton } from "@/components/wallet/wallet-button";
import { useWalletStore } from "@/store/wallet-store";
import Link from "next/link";

const currentUser = freelancers[0];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"portfolio" | "reviews" | "about">("portfolio");
  const { connected } = useWalletStore();

  const reviews = [
    { id: "rev-1", author: "Aurora Labs", rating: 5, text: "Exceptional work! Delivered ahead of schedule with incredible attention to detail.", date: "June 2026", project: "Web3 Landing Page" },
    { id: "rev-2", author: "Prism Studio", rating: 5, text: "Professional, creative, and highly responsive. Would definitely hire again.", date: "May 2026", project: "Brand Identity" },
    { id: "rev-3", author: "Nebula DAO", rating: 5, text: "Outstanding design skills and great communication throughout the project.", date: "April 2026", project: "UI/UX Design" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="glass-card overflow-hidden">
          <div className="relative h-48 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-cyan-500/40" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          </div>

          <div className="px-8 pb-8">
            <div className="relative -mt-16 mb-6 flex flex-col items-start gap-6 sm:flex-row sm:items-end">
              <div className="flex h-32 w-32 items-center justify-center rounded-2xl border-4 border-[hsl(var(--background))] bg-gradient-to-br from-violet-500 to-cyan-500 font-display text-4xl font-bold text-white shadow-xl">
                {currentUser.name.charAt(0)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-3xl font-bold text-white">{currentUser.name}</h1>
                  {currentUser.verified && (
                    <CheckCircle2 className="h-6 w-6 text-violet-400" />
                  )}
                </div>
                <p className="mt-1 text-lg text-white/60">{currentUser.title}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/50">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {currentUser.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Member since {currentUser.memberSince}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Replies {currentUser.responseTime}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="btn-secondary">
                  <Edit2 className="h-4 w-4" />
                  Edit Profile
                </button>
                <WalletButton />
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-1 border-b border-white/5">
                  {(["portfolio", "reviews", "about"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-3 px-4 text-sm font-medium capitalize transition-colors ${
                        activeTab === tab ? "text-white border-b-2 border-violet-500" : "text-white/50 hover:text-white/80"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === "portfolio" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid gap-4 sm:grid-cols-2"
                  >
                    {currentUser.portfolio.map((item) => (
                      <div key={item.id} className="group relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
                        <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-cyan-500/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <p className="text-lg font-semibold text-white">{item.title}</p>
                            <p className="text-sm text-white/50 mt-1 capitalize">{item.category}</p>
                          </div>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                          <button className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                            View Project
                            <ExternalLink className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                    <button className="group flex aspect-[4/3] items-center justify-center rounded-2xl border-2 border-dashed border-white/10 bg-white/[0.02] transition-colors hover:border-violet-500/30 hover:bg-white/[0.04]">
                      <div className="text-center">
                        <Plus className="mx-auto h-8 w-8 text-white/40 group-hover:text-violet-400 transition-colors" />
                        <p className="mt-2 text-sm text-white/40 group-hover:text-white/60 transition-colors">Add Project</p>
                      </div>
                    </button>
                  </motion.div>
                )}

                {activeTab === "reviews" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-4"
                  >
                    {reviews.map((review) => (
                      <div key={review.id} className="glass-card p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-cyan-500/20 font-semibold text-white">
                              {review.author.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{review.author}</p>
                              <p className="text-xs text-white/50">{review.project}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: review.rating }).map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                            ))}
                          </div>
                        </div>
                        <p className="mt-4 text-sm text-white/70">&ldquo;{review.text}&rdquo;</p>
                        <p className="mt-3 text-xs text-white/40">{review.date}</p>
                      </div>
                    ))}
                  </motion.div>
                )}

                {activeTab === "about" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-6"
                  >
                    <h3 className="font-display text-lg font-semibold text-white mb-4">About</h3>
                    <p className="text-sm leading-relaxed text-white/70">{currentUser.bio}</p>
                    
                    <div className="mt-6 flex items-center gap-3">
                      <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:text-white transition-colors">
                        <Globe className="h-4 w-4" />
                      </a>
                      <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:text-white transition-colors">
                        <Twitter className="h-4 w-4" />
                      </a>
                      <a href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 hover:text-white transition-colors">
                        <Github className="h-4 w-4" />
                      </a>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-6">
                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-white mb-4">Stats</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="flex items-center justify-center gap-1 font-display text-xl font-bold text-white">
                        <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                        {currentUser.rating}
                      </p>
                      <p className="text-xs text-white/50 mt-1">{currentUser.reviews} reviews</p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/5">
                      <p className="font-display text-xl font-bold text-white">{currentUser.completedJobs}</p>
                      <p className="text-xs text-white/50 mt-1">projects</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Hourly Rate</span>
                      <span className="text-white font-semibold">{formatCurrency(currentUser.hourlyRate)}/hr</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/50">Total Earned</span>
                      <span className="text-white font-semibold">${formatCompactNumber(currentUser.earnings)}</span>
                    </div>
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-white mb-4">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm text-violet-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-white mb-4">Badges</h3>
                  <div className="space-y-2">
                    {currentUser.badges.map((badge) => (
                      <div key={badge} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-violet-400" />
                        <span className="text-white/70">{badge}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6">
                  <h3 className="font-display text-lg font-semibold text-white mb-4">Wallet</h3>
                  <p className="text-xs text-white/40 font-mono break-all">{currentUser.walletAddress}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
