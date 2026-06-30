"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function Logo({ className, size = "md", animated = false }: LogoProps) {
  const sizes = {
    sm: "h-7",
    md: "h-9",
    lg: "h-12"
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <motion.div
        className={cn("relative", sizes[size])}
        whileHover={animated ? { scale: 1.05, rotate: 5 } : undefined}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-auto"
        >
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#22d3ee" />
            </linearGradient>
            <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#a78bfa" />
            </linearGradient>
          </defs>
          <path
            d="M20 4L4 12v16l16 8 16-8V12L20 4z"
            fill="url(#logoGradient)"
            opacity="0.9"
          />
          <path
            d="M20 4L4 12v16l16 8 16-8V12L20 4z"
            fill="none"
            stroke="url(#logoGradient2)"
            strokeWidth="0.5"
            opacity="0.6"
          />
          <path
            d="M20 14L12 18v8l8 4 8-4v-8l-8-4z"
            fill="hsl(var(--background))"
            opacity="0.95"
          />
          <circle cx="20" cy="22" r="3" fill="url(#logoGradient)" />
        </svg>
        <div className="absolute inset-0 -z-10 blur-2xl">
          <div className="h-full w-full rounded-full bg-gradient-to-br from-violet-500/40 via-pink-500/40 to-cyan-500/40" />
        </div>
      </motion.div>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold tracking-tight text-white",
            size === "sm" && "text-lg",
            size === "md" && "text-xl",
            size === "lg" && "text-2xl"
          )}
        >
          Warranty
        </span>
        {size === "lg" && (
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/50">
            Freelance Protocol
          </span>
        )}
      </div>
    </div>
  );
}
