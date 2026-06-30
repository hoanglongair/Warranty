"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Shield, Zap } from "lucide-react";
import { HeroIllustration } from "@/components/illustrations/hero-illustration";
import { marketplaceStats } from "@/data/jobs";
import { formatCompactNumber } from "@/lib/utils";
import { useTranslation } from "@/i18n/translations";

export function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1.5 text-xs font-medium text-violet-300 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>{t("hero.badge")}</span>
              <div className="ml-1 flex h-1.5 w-1.5">
                <div className="absolute inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-violet-400 opacity-75" />
                <div className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-500" />
              </div>
            </motion.div>

            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl text-balance">
              {t("hero.title1")}
              <br />
              <span className="gradient-text">{t("hero.title2")}</span>
              <br />
              {t("hero.title3")}
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/60 text-balance">
              {t("hero.subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/marketplace"
                className="btn-primary group"
              >
                {t("hero.explore")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/post-job"
                className="btn-secondary"
              >
                {t("hero.postJob")}
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/5 pt-6">
              {[
                { label: t("hero.activeJobs"), value: formatCompactNumber(marketplaceStats.totalJobs) + "+" },
                { label: t("hero.freelancers"), value: formatCompactNumber(marketplaceStats.totalFreelancers) + "+" },
                { label: t("hero.totalVolume"), value: "$" + formatCompactNumber(marketplaceStats.totalVolume) }
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs text-white/50">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center"
          >
            <div className="absolute -inset-8 rounded-full bg-gradient-to-br from-violet-500/20 via-pink-500/10 to-cyan-500/20 blur-3xl" />
            <HeroIllustration />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-20 grid gap-4 sm:grid-cols-3"
        >
          {[
            {
              icon: Shield,
              title: t("features.escrow.title"),
              desc: t("features.escrow.desc"),
              stats: t("features.escrow.stats")
            },
            {
              icon: Zap,
              title: t("features.settlement.title"),
              desc: t("features.settlement.desc"),
              stats: t("features.settlement.stats")
            },
            {
              icon: Sparkles,
              title: t("features.credentials.title"),
              desc: t("features.credentials.desc"),
              stats: t("features.credentials.stats")
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card hover-lift flex items-start gap-3 p-5"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                <feature.icon className="h-5 w-5 text-violet-300" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{feature.title}</h3>
                <p className="mt-1 text-sm text-white/50">{feature.desc}</p>
                <p className="mt-2 text-xs font-medium text-violet-400">{feature.stats}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
