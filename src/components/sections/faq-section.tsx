"use client";

import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { faqs } from "@/data/faqs";
import { useTranslation } from "@/i18n/translations";

export function FAQSection() {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  return (
    <section className="relative py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
            {t("faq.title")}
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t("faq.subtitle")}
          </h2>
        </motion.div>

        <div className="mt-12 space-y-3">
          {faqs.slice(0, 8).map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <h3 className="font-medium text-white">{faq.question}</h3>
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                    {isOpen ? (
                      <Minus className="h-4 w-4 text-violet-400" />
                    ) : (
                      <Plus className="h-4 w-4 text-white/60" />
                    )}
                  </div>
                </button>
                <motion.div
                  initial={false}
                  animate={{
                    height: isOpen ? "auto" : 0,
                    opacity: isOpen ? 1 : 0
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm leading-relaxed text-white/60">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-medium text-violet-300 transition-colors hover:text-violet-200"
          >
            {t("faq.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
