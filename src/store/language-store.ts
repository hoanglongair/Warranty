"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "en" | "vi" | "zh" | "fr";

interface LanguageStore {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set) => ({
      language: "en",
      setLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "warranty-language",
    }
  )
);

export const languages = [
  { code: "en" as const, name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "vi" as const, name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh" as const, name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "fr" as const, name: "French", nativeName: "Français", flag: "🇫🇷" },
];

export const languageNames: Record<Language, string> = {
  en: "English",
  vi: "Tiếng Việt",
  zh: "中文",
  fr: "Français",
};
