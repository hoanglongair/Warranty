"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Check, ChevronDown } from "lucide-react";
import { useLanguageStore, languages } from "@/store/language-store";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const { language, setLanguage } = useLanguageStore();

  const currentLang = languages.find((l) => l.code === language);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white/70 hover:text-white transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currentLang?.nativeName}</span>
        <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl glass-card p-2"
            >
              <div className="p-2">
                <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white/40">
                  Select Language
                </p>
              </div>
              <div className="space-y-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors",
                      language === lang.code
                        ? "bg-white/[0.06] text-white"
                        : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-base">{lang.flag}</span>
                      <div className="text-left">
                        <p className="font-medium">{lang.nativeName}</p>
                        <p className="text-[10px] text-white/40">{lang.name}</p>
                      </div>
                    </div>
                    {language === lang.code && (
                      <Check className="h-4 w-4 text-violet-400" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function LanguageSwitcherInline({ className }: { className?: string }) {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={cn(
            "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-all",
            language === lang.code
              ? "border-violet-500/50 bg-violet-500/10 text-white"
              : "border-white/10 bg-white/[0.03] text-white/60 hover:text-white hover:border-white/20"
          )}
        >
          <span>{lang.flag}</span>
          <span>{lang.code.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}
