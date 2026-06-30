"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { categories } from "@/data/jobs";
import { CategoryIcon } from "@/components/icons/category-icons";
import { useTranslation } from "@/i18n/translations";

const categoryDescriptions: Record<string, string> = {
  design: "Create stunning visuals that captivate and convert. From logos to complete brand identities.",
  development: "Build cutting-edge applications with expert developers. Web3, bots, and beyond.",
  content: "Compelling content that engages audiences and drives results across all channels.",
  marketing: "Strategic campaigns that amplify your reach and grow your community."
};

export function CategoriesSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-400">
            {t("nav.categories")}
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t("categories.title")}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
            {t("categories.subtitle")}
          </p>
        </motion.div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link href={`/marketplace?category=${category.id}`}>
                <div className="glass-card hover-lift group relative h-full overflow-hidden p-6">
                  <div
                    className={`absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-35 bg-gradient-to-br ${category.color}`}
                  />
                  
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.color} shadow-lg`}>
                        <CategoryIcon category={category.id} subcategory={category.subcategories[0]} size="md" />
                      </div>
                      <div>
                        <h3 className="font-display text-xl font-bold text-white">
                          {category.name}
                        </h3>
                        <p className="text-xs text-white/50">
                          {category.count.toLocaleString()} {t("categories.projects")}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-sm text-white/60 line-clamp-2">
                      {categoryDescriptions[category.id]}
                    </p>
                    
                    <div className="mt-4 flex flex-wrap gap-2">
                      {category.subcategories.slice(0, 2).map((sub) => (
                        <span
                          key={sub}
                          className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-white/60"
                        >
                          {sub}
                        </span>
                      ))}
                      {category.subcategories.length > 2 && (
                        <span className="rounded-lg border border-white/10 bg-white/[0.03] px-2 py-1 text-[11px] text-white/40">
                          +{category.subcategories.length - 2} more
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-6 flex items-center gap-1 text-sm font-medium text-violet-300 opacity-0 transition-opacity group-hover:opacity-100">
                      <span>{t("categories.explore")}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            href="/marketplace"
            className="btn-secondary inline-flex items-center gap-2"
          >
            {t("categories.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
