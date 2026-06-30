"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Wallet, Bell, Palette, Globe, Save, Check } from "lucide-react";
import { useWalletStore } from "@/store/wallet-store";
import { formatAddress } from "@/lib/utils";
import { LanguageSwitcherInline } from "@/components/language/language-switcher";
import { useTranslation } from "@/i18n/translations";

type Tab = "account" | "security" | "wallet" | "notifications" | "appearance" | "language";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("account");
  const [saved, setSaved] = useState(false);
  const { connected, address, provider } = useWalletStore();
  const { t } = useTranslation();

  const tabs = [
    { id: "account", label: t("settings.account"), icon: User },
    { id: "security", label: t("settings.security"), icon: Shield },
    { id: "wallet", label: t("settings.wallet"), icon: Wallet },
    { id: "notifications", label: t("settings.notifications"), icon: Bell },
    { id: "appearance", label: t("settings.appearance"), icon: Palette },
    { id: "language", label: t("settings.language"), icon: Globe },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {t("settings.title")}
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          {t("settings.subtitle")}
        </p>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-2 h-fit"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white/[0.06] text-white"
                  : "text-white/60 hover:bg-white/[0.03] hover:text-white/80"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3"
        >
          <div className="glass-card p-6">
            {activeTab === "account" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-white">{t("settings.accountSettings")}</h2>
                
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-white text-xl">
                    L
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-white">Linh Nguyen</p>
                    <p className="text-sm text-white/50">linh.nguyen@email.com</p>
                  </div>
                  <button className="btn-secondary px-4 py-2 text-sm">{t("settings.changePhoto")}</button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">{t("settings.firstName")}</label>
                    <input
                      type="text"
                      defaultValue="Linh"
                      className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-2">{t("settings.lastName")}</label>
                    <input
                      type="text"
                      defaultValue="Nguyen"
                      className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">{t("settings.email")}</label>
                  <input
                    type="email"
                    defaultValue="linh.nguyen@email.com"
                    className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">{t("settings.bio")}</label>
                  <textarea
                    rows={4}
                    defaultValue="Award-winning designer specializing in Web3, fintech, and SaaS brands."
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none focus:border-violet-500/50 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <button onClick={handleSave} className="btn-primary">
                    {saved ? (
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        {t("settings.saved")}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        {t("settings.saveChanges")}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-white">{t("settings.securitySettings")}</h2>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t("settings.2fa")}</p>
                      <p className="text-sm text-white/50 mt-1">{t("settings.2faDesc")}</p>
                    </div>
                    <button className="btn-primary px-4 py-2 text-sm">{t("settings.enable")}</button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t("settings.changePassword")}</p>
                      <p className="text-sm text-white/50 mt-1">{t("settings.changePasswordDesc")}</p>
                    </div>
                    <button className="btn-secondary px-4 py-2 text-sm">{t("settings.update")}</button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t("settings.session")}</p>
                      <p className="text-sm text-white/50 mt-1">{t("settings.sessionDesc")}</p>
                    </div>
                    <button className="btn-secondary px-4 py-2 text-sm">{t("settings.manage")}</button>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-red-400">{t("settings.deleteAccount")}</p>
                      <p className="text-sm text-white/50 mt-1">{t("settings.deleteAccountDesc")}</p>
                    </div>
                    <button className="px-4 py-2 text-sm rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                      {t("settings.delete")}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-white">{t("settings.walletSettings")}</h2>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-white">
                        {provider === "metamask" ? "🦊" : provider === "walletconnect" ? "📱" : "🔵"}
                      </div>
                      <div>
                        <p className="font-semibold text-white capitalize">{provider} Wallet</p>
                        <p className="text-xs text-white/50 font-mono">{formatAddress(address || "", 10)}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Connected
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t("settings.defaultNetwork")}</p>
                      <p className="text-sm text-white/50 mt-1">Select your preferred blockchain network</p>
                    </div>
                    <select className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none">
                      <option>Ethereum Mainnet</option>
                      <option>Polygon</option>
                      <option>Arbitrum</option>
                      <option>Optimism</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t("settings.defaultCurrency")}</p>
                      <p className="text-sm text-white/50 mt-1">Set your preferred currency for transactions</p>
                    </div>
                    <select className="h-10 rounded-lg border border-white/10 bg-white/[0.04] px-3 text-sm text-white outline-none">
                      <option>USDC</option>
                      <option>ETH</option>
                      <option>USDT</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-white">{t("settings.notificationPrefs")}</h2>

                {[
                  { label: "Email notifications", desc: "Receive email updates about your projects", enabled: true },
                  { label: "Push notifications", desc: "Receive push notifications in your browser", enabled: true },
                  { label: "Job alerts", desc: "Get notified about new jobs matching your skills", enabled: true },
                  { label: "Proposal updates", desc: "Get notified when you receive proposals", enabled: true },
                  { label: "Payment notifications", desc: "Get notified about payment events", enabled: true },
                  { label: "Marketing emails", desc: "Receive updates about new features", enabled: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                    <div>
                      <p className="font-semibold text-white">{item.label}</p>
                      <p className="text-sm text-white/50 mt-1">{item.desc}</p>
                    </div>
                    <button className={`relative h-6 w-11 rounded-full transition-colors ${item.enabled ? "bg-violet-500" : "bg-white/10"}`}>
                      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${item.enabled ? "left-6" : "left-1"}`} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "appearance" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-white">{t("settings.appearanceSettings")}</h2>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { id: "dark", label: t("settings.dark"), preview: "bg-slate-900", active: true },
                    { id: "light", label: t("settings.light"), preview: "bg-slate-100", active: false },
                    { id: "system", label: t("settings.system"), preview: "bg-gradient-to-r from-slate-900 to-slate-100", active: false },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className={`p-4 rounded-xl border transition-colors ${theme.active ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"}`}
                    >
                      <div className={`h-20 rounded-lg ${theme.preview} mb-3`} />
                      <p className="text-sm font-medium text-white">{theme.label}</p>
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-white">{t("settings.motion")}</p>
                      <p className="text-sm text-white/50 mt-1">{t("settings.motionDesc")}</p>
                    </div>
                    <button className="relative h-6 w-11 rounded-full bg-violet-500">
                      <span className="absolute top-1 left-6 h-4 w-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "language" && (
              <div className="space-y-6">
                <h2 className="font-display text-xl font-bold text-white">{t("settings.languageSettings")}</h2>

                <div className="space-y-4">
                  <label className="block text-sm font-medium text-white/60">{t("settings.defaultLanguage")}</label>
                  <LanguageSwitcherInline />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">{t("settings.timezone")}</label>
                  <select className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50">
                    <option>{t("settings.timezoneValue")}</option>
                    <option>UTC+0 (GMT)</option>
                    <option>UTC-5 (EST)</option>
                    <option>UTC-8 (PST)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">{t("settings.currency")}</label>
                  <select className="w-full h-11 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                    <option>VND (₫)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
