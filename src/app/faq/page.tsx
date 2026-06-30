"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Minus, ArrowRight, Shield, CreditCard, Wallet, HelpCircle, Users, RefreshCcw, Lock } from "lucide-react";
import { faqs } from "@/data/faqs";

const categories = [
  { id: "all", label: "All", icon: HelpCircle },
  { id: "general", label: "General", icon: HelpCircle },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "wallet", label: "Wallet", icon: Wallet },
  { id: "security", label: "Security", icon: Shield },
  { id: "disputes", label: "Disputes", icon: RefreshCcw },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredFAQs = selectedCategory === "all" 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
          FAQ
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Frequently Asked <span className="gradient-text">Questions</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
          Everything you need to know about Warranty. Can&apos;t find the answer you&apos;re looking for? Contact our support team.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-white/[0.06] text-white border border-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/[0.03]"
              }`}
            >
              <cat.icon className="h-4 w-4" />
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-3xl mx-auto"
      >
        <div className="space-y-3">
          {filteredFAQs.map((faq, i) => {
            const isOpen = openId === faq.id;
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <h3 className="font-medium text-white pr-4">{faq.question}</h3>
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <div className="glass-card p-8 text-center max-w-3xl mx-auto">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500">
            <HelpCircle className="h-8 w-8 text-white" />
          </div>
          <h2 className="font-display text-2xl font-bold text-white">
            Still have questions?
          </h2>
          <p className="mt-3 text-white/60">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <Link href="mailto:support@warranty.io" className="btn-primary">
              Contact Support
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/marketplace" className="btn-secondary">
              Browse Marketplace
            </Link>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-16"
      >
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-white">
          Quick Links
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {[
            { label: "Getting Started", href: "/", icon: Users },
            { label: "How Payments Work", href: "/wallet", icon: CreditCard },
            { label: "Wallet Connection", href: "/wallet", icon: Wallet },
            { label: "Security Features", href: "/settings", icon: Lock },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="glass-card p-5 hover-lift group"
            >
              <link.icon className="h-6 w-6 text-violet-400 mb-3" />
              <h3 className="font-semibold text-white group-hover:text-violet-200">
                {link.label}
              </h3>
              <p className="mt-1 text-sm text-white/50 flex items-center gap-1">
                Learn more
                <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
              </p>
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
