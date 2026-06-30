import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatCompactNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

export function timeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"]
  ];
  for (const [secs, label] of intervals) {
    const interval = Math.floor(seconds / secs);
    if (interval >= 1) {
      return `${interval} ${label}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "just now";
}

export function generateGradient(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 60) % 360;
  return `linear-gradient(135deg, hsl(${h1} 80% 60%), hsl(${h2} 70% 55%))`;
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    design: "from-pink-500 to-rose-500",
    development: "from-violet-500 to-indigo-500",
    content: "from-amber-500 to-orange-500",
    marketing: "from-cyan-500 to-teal-500"
  };
  return colors[category] || "from-violet-500 to-indigo-500";
}

export function getCategoryBg(category: string): string {
  const colors: Record<string, string> = {
    design: "bg-pink-500/10 text-pink-300 border-pink-500/20",
    development: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    content: "bg-amber-500/10 text-amber-300 border-amber-500/20",
    marketing: "bg-cyan-500/10 text-cyan-300 border-cyan-500/20"
  };
  return colors[category] || "bg-violet-500/10 text-violet-300 border-violet-500/20";
}
