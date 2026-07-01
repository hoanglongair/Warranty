"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export function Logo({ className, size = "md", animated = false }: LogoProps) {
  const sizes = {
    sm: { img: 28, text: "text-lg" },
    md: { img: 36, text: "text-xl" },
    lg: { img: 48, text: "text-2xl" }
  };

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <motion.div
        className="relative"
        whileHover={animated ? { scale: 1.05 } : undefined}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Image
          src="/logo.svg"
          alt="Warranty"
          width={sizes[size].img}
          height={sizes[size].img}
          className="w-auto h-auto"
          priority
        />
      </motion.div>
      <div className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display font-bold tracking-tight text-white",
            sizes[size].text
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
