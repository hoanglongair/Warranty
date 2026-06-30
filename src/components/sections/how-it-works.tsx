"use client";

import { motion } from "framer-motion";
import { FileText, Search, UserCheck, Rocket, Shield, Zap, Globe, Award } from "lucide-react";
import { useTranslation } from "@/i18n/translations";

export function HowItWorks() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: FileText,
      key: "howItWorks.step1",
      color: "from-violet-500 to-purple-500",
      glow: "rgba(139, 92, 246, 0.4)"
    },
    {
      icon: Search,
      key: "howItWorks.step2",
      color: "from-pink-500 to-rose-500",
      glow: "rgba(236, 72, 153, 0.4)"
    },
    {
      icon: UserCheck,
      key: "howItWorks.step3",
      color: "from-cyan-500 to-blue-500",
      glow: "rgba(34, 211, 238, 0.4)"
    },
    {
      icon: Rocket,
      key: "howItWorks.step4",
      color: "from-amber-500 to-orange-500",
      glow: "rgba(251, 191, 36, 0.4)"
    }
  ];

  const features = [
    { icon: Shield, label: "Escrow Protection", value: "100%" },
    { icon: Zap, label: "Avg. Response", value: "<2h" },
    { icon: Globe, label: "Countries", value: "142+" },
    { icon: Award, label: "Success Rate", value: "98%" }
  ];

  return (
    <section className="relative py-24">
      <div className="absolute inset-x-0 -top-24 h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-wider text-violet-400">
            {t("howItWorks.title")}
          </p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {t("howItWorks.subtitle")}
          </h2>
        </motion.div>

        <div className="mt-16 relative">
          <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-violet-500/50 via-pink-500/50 to-cyan-500/50 hidden lg:block" />
          
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-12">
            {steps.map((step, i) => (
              <motion.div
                key={step.key}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative ${i % 2 === 1 ? "lg:text-right" : ""}`}
              >
                <div className={`glass-card hover-lift relative overflow-hidden p-6 ${i % 2 === 1 ? "lg:ml-12" : "lg:mr-12"}`}>
                  <div
                    className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20 blur-3xl"
                    style={{ background: step.glow }}
                  />
                  
                  <div className={`flex items-start gap-4 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`relative flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} shadow-lg`}
                    >
                      <step.icon className="h-6 w-6 text-white" />
                      <div
                        className="absolute inset-0 rounded-2xl opacity-50 blur-md"
                        style={{ background: step.glow }}
                      />
                    </motion.div>
                    
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white/60">
                          {i + 1}
                        </span>
                        <h3 className="font-display text-xl font-bold text-white">
                          {t(`${step.key}.title`)}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-white/60">
                        {t(`${step.key}.desc`)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {features.map((feature, i) => (
            <div
              key={feature.label}
              className="glass-card flex items-center gap-3 p-4"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20">
                <feature.icon className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <p className="font-display text-lg font-bold text-white">
                  {feature.value}
                </p>
                <p className="text-xs text-white/50">{feature.label}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
