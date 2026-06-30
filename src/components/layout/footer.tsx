"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { Github, Twitter, Send } from "lucide-react";
import { LanguageSwitcher } from "@/components/language/language-switcher";
import { useTranslation } from "@/i18n/translations";

const footerLinks = [
  {
    key: "product",
    labelKey: "footer.product",
    links: [
      { key: "categories", labelKey: "footer.categories", href: "/categories" },
      { key: "marketplace", labelKey: "footer.marketplace", href: "/marketplace" },
      { key: "postJob", labelKey: "footer.postJob", href: "/post-job" },
      { key: "findWork", labelKey: "footer.findWork", href: "/marketplace?tab=freelancers" }
    ]
  },
  {
    key: "account",
    labelKey: "footer.account",
    links: [
      { key: "dashboard", labelKey: "footer.dashboard", href: "/dashboard" },
      { key: "profile", labelKey: "footer.profile", href: "/profile" },
      { key: "wallet", labelKey: "footer.wallet", href: "/wallet" },
      { key: "settings", labelKey: "footer.settings", href: "/settings" }
    ]
  },
  {
    key: "resources",
    labelKey: "footer.resources",
    links: [
      { key: "help", labelKey: "footer.help", href: "/faq" },
      { key: "docs", labelKey: "footer.docs", href: "#" },
      { key: "api", labelKey: "footer.api", href: "#" },
      { key: "status", labelKey: "footer.status", href: "#" }
    ]
  },
  {
    key: "legal",
    labelKey: "footer.legal",
    links: [
      { key: "privacy", labelKey: "footer.privacy", href: "#" },
      { key: "terms", labelKey: "footer.terms", href: "#" },
      { key: "security", labelKey: "footer.security", href: "#" },
      { key: "cookies", labelKey: "footer.cookies", href: "#" }
    ]
  }
];

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative mt-32 border-t border-white/5">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-violet-500/[0.07] to-transparent" />

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-20 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-6">
          <div className="col-span-2">
            <div className="flex items-center justify-between">
              <Logo size="md" />
              <LanguageSwitcher />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              The premium Web3 freelance marketplace. Connecting elite talent
              with forward-thinking clients worldwide.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {[
                { icon: Twitter, href: "#" },
                { icon: Github, href: "#" },
                { icon: Send, href: "#" }
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition-all hover:border-violet-500/30 hover:bg-white/[0.06] hover:text-white"
                  aria-label="Social link"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerLinks.map((category) => (
            <div key={category.key}>
              <h3 className="font-display text-sm font-semibold text-white">
                {t(category.labelKey)}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {category.links.map((link) => (
                  <li key={link.key}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-white/40">
            {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span>{t("footer.systems")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
