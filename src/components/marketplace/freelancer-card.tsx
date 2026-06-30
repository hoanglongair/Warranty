"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Check, Clock, ArrowUpRight } from "lucide-react";
import type { Freelancer } from "@/types";
import { formatCurrency, formatCompactNumber } from "@/lib/utils";

interface FreelancerCardProps {
  freelancer: Freelancer;
  index?: number;
}

export function FreelancerCard({ freelancer, index = 0 }: FreelancerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group"
    >
      <Link href={`/profile/${freelancer.id}`} className="block">
        <div className="glass-card hover-lift relative h-full overflow-hidden">
          <div className="relative h-20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/40 via-fuchsia-500/30 to-cyan-500/40" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
          </div>

          <div className="px-5 pb-5">
            <div className="relative -mt-10 mb-3 flex items-end justify-between">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-[hsl(var(--background))] bg-gradient-to-br from-violet-500 to-cyan-500 font-display text-xl font-bold text-white shadow-lg">
                {freelancer.name.charAt(0)}
              </div>
              {freelancer.verified && (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500">
                  <Check className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            <h3 className="font-display text-base font-semibold text-white group-hover:text-violet-200">
              {freelancer.name}
            </h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-white/60">
              {freelancer.title}
            </p>

            <div className="mt-3 flex items-center gap-3 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">
                  {freelancer.rating.toFixed(2)}
                </span>
                <span>({freelancer.reviews})</span>
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {freelancer.location.split(",")[0]}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {freelancer.skills.slice(0, 3).map((skill) => (
                <span
                  key={skill}
                  className="rounded-md border border-violet-500/20 bg-violet-500/5 px-2 py-0.5 text-[11px] text-violet-300"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-white/40">
                  Hourly
                </p>
                <p className="font-display text-base font-bold text-white">
                  {formatCurrency(freelancer.hourlyRate)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-white/40">
                  Earned
                </p>
                <p className="font-display text-base font-bold text-white">
                  ${formatCompactNumber(freelancer.earnings)}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1 text-white/50">
                <Clock className="h-3 w-3" />
                Replies {freelancer.responseTime}
              </span>
              <span className="flex items-center gap-1 text-violet-300 opacity-0 transition-opacity group-hover:opacity-100">
                View profile
                <ArrowUpRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
