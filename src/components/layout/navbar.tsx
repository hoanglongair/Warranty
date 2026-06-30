"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";
import { Logo } from "@/components/logo";
import { WalletButton } from "@/components/wallet/wallet-button";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { useTranslation } from "@/i18n/translations";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", key: "nav.home" },
  { href: "/categories", key: "nav.categories" },
  { href: "/marketplace", key: "nav.marketplace" },
  { href: "/tasks", key: "nav.microTasks" },
  { href: "/post-job", key: "nav.postJob" },
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/profile", key: "nav.profile" },
  { href: "/faq", key: "nav.faq" },
  { href: "/wallet", key: "nav.wallet" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed left-0 right-0 top-0 z-40 transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-[hsl(var(--background))]/70 backdrop-blur-2xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" aria-label="Warranty Home">
            <Logo size="md" />
          </Link>
          <ul className="hidden items-center gap-0.5 xl:flex">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors whitespace-nowrap",
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="navbar-active"
                        className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06] ring-1 ring-white/10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {t(link.key)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/marketplace"
            className="hidden h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white lg:flex"
            aria-label="Search marketplace"
          >
            <Search className="h-4 w-4" />
          </Link>
          <LanguageSwitcher />
          <div className="hidden md:block">
            <WalletButton />
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 bg-[hsl(var(--background))]/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="space-y-1 p-4">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/[0.06] text-white"
                        : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-white/5 p-4">
              <WalletButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
