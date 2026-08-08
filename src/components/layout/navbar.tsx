"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { Logo } from "@/components/logo";
import { WalletButton } from "@/components/wallet/wallet-button";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { useTranslation } from "@/i18n/translations";
import { cn } from "@/lib/utils";

const primaryNavLinks = [
  { href: "/", key: "nav.home" },
  { href: "/marketplace", key: "nav.marketplace" },
  { href: "/tasks", key: "nav.microTasks" },
  { href: "/post-job", key: "nav.postJob" },
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/wallet", key: "nav.wallet" },
  { href: "/faucet", key: "nav.faucet" }
];

const secondaryNavLinks = [
  { href: "/categories", key: "nav.categories" },
  { href: "/profile", key: "nav.profile" },
  { href: "/faq", key: "nav.faq" }
];

const allNavLinks = [
  { href: "/", key: "nav.home" },
  { href: "/marketplace", key: "nav.marketplace" },
  { href: "/tasks", key: "nav.microTasks" },
  { href: "/post-job", key: "nav.postJob" },
  { href: "/dashboard", key: "nav.dashboard" },
  { href: "/wallet", key: "nav.wallet" },
  { href: "/faucet", key: "nav.faucet" },
  { href: "/categories", key: "nav.categories" },
  { href: "/profile", key: "nav.profile" },
  { href: "/faq", key: "nav.faq" }
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  const isSecondaryActive = secondaryNavLinks.some((link) =>
    pathname.startsWith(link.href)
  );

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed left-0 right-0 top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-white/5 bg-[hsl(var(--background))]/80 backdrop-blur-2xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left Section: Logo & Desktop Links */}
        <div className="flex items-center gap-3 lg:gap-6 min-w-0">
          <Link href="/" aria-label="Warranty Home" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden items-center gap-0.5 xl:flex">
            {primaryNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative rounded-lg px-2.5 py-1.5 text-xs 2xl:text-[13px] font-medium transition-colors whitespace-nowrap",
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

            {/* "More" Dropdown for Secondary Links */}
            <li className="relative">
              <button
                onClick={() => setMoreOpen(!moreOpen)}
                className={cn(
                  "relative flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs 2xl:text-[13px] font-medium transition-colors whitespace-nowrap",
                  isSecondaryActive ? "text-white" : "text-white/60 hover:text-white"
                )}
              >
                {isSecondaryActive && (
                  <motion.span
                    layoutId="navbar-active"
                    className="absolute inset-0 -z-10 rounded-lg bg-white/[0.06] ring-1 ring-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span>Khác</span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-200",
                    moreOpen && "rotate-180"
                  )}
                />
              </button>

              <AnimatePresence>
                {moreOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setMoreOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl glass-card border border-white/10 p-1.5 shadow-2xl backdrop-blur-2xl"
                    >
                      {secondaryNavLinks.map((link) => {
                        const isActive = pathname.startsWith(link.href);
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setMoreOpen(false)}
                            className={cn(
                              "block rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                              isActive
                                ? "bg-white/10 text-white"
                                : "text-white/70 hover:bg-white/5 hover:text-white"
                            )}
                          >
                            {t(link.key)}
                          </Link>
                        );
                      })}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </li>
          </ul>
        </div>

        {/* Right Section: Actions & Mobile Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          <Link
            href="/marketplace"
            className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white/60 transition-colors hover:bg-white/[0.06] hover:text-white md:flex"
            aria-label="Search marketplace"
          >
            <Search className="h-4 w-4" />
          </Link>
          
          <LanguageSwitcher />

          <div className="hidden sm:block">
            <WalletButton />
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-white transition-colors hover:bg-white/[0.06] xl:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-white/5 bg-[hsl(var(--background))]/95 backdrop-blur-2xl xl:hidden"
          >
            <div className="space-y-1 p-4 max-h-[75vh] overflow-y-auto">
              {allNavLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "block rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-white/[0.08] text-white font-semibold"
                        : "text-white/60 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    {t(link.key)}
                  </Link>
                );
              })}
            </div>
            <div className="border-t border-white/5 p-4 sm:hidden">
              <WalletButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
