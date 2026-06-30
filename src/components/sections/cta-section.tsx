"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useTranslation } from "@/i18n/translations";

export function CTASection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-fuchsia-500/5 to-cyan-500/10 rounded-3xl" />
          <div className="absolute inset-0 grid-pattern opacity-20 rounded-3xl" />
          
          <div className="relative glass-card p-12 md:p-16 text-center rounded-3xl">
            <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />
            
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", duration: 0.5 }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 shadow-lg shadow-violet-500/25"
            >
              <Sparkles className="h-8 w-8 text-white" />
            </motion.div>
            
            <h2 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {t("cta.title")}
            </h2>
            
            <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
              {t("cta.subtitle")}
            </p>
            
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/marketplace"
                className="btn-primary group"
              >
                {t("cta.explore")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/post-job"
                className="btn-secondary"
              >
                {t("cta.postJob")}
              </Link>
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-white/50">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t("cta.noCard")}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t("cta.free")}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{t("cta.escrow")}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
