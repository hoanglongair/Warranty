"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { useWalletStore } from "@/store/wallet-store";
import { cn } from "@/lib/utils";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

const wallets = [
  {
    id: "metamask" as const,
    name: "MetaMask",
    description: "Connect using browser extension",
    icon: "🦊",
    popular: true
  },
  {
    id: "walletconnect" as const,
    name: "WalletConnect",
    description: "Scan QR code with mobile wallet",
    icon: "📱",
    popular: true
  },
  {
    id: "coinbase" as const,
    name: "Coinbase Wallet",
    description: "Connect with your Coinbase account",
    icon: "🔵",
    popular: false
  }
];

export function WalletModal({ open, onClose }: WalletModalProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const { connect } = useWalletStore();

  const handleConnect = (walletId: "metamask" | "walletconnect" | "coinbase") => {
    setConnecting(walletId);
    setTimeout(() => {
      const mockAddress = "0x9F2A8B4C1D7E3F5B8A2C9D4E6F1B7A3C8E2D5F9B1";
      connect(walletId, mockAddress);
      setConnecting(null);
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="glass-card relative w-full max-w-md overflow-hidden p-6"
            >
              <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />

              <div className="relative">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      Connect Wallet
                    </h2>
                    <p className="mt-1 text-sm text-white/60">
                      Choose your preferred wallet provider
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 flex items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
                  <Shield className="h-4 w-4 flex-shrink-0 text-violet-400" />
                  <p className="text-xs text-white/70">
                    Your wallet stays in your control. We never custody your funds.
                  </p>
                </div>

                <div className="space-y-2">
                  {wallets.map((wallet) => (
                    <button
                      key={wallet.id}
                      onClick={() => handleConnect(wallet.id)}
                      disabled={connecting !== null}
                      className={cn(
                        "group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-violet-500/30 hover:bg-white/[0.06] disabled:opacity-50",
                        connecting === wallet.id && "border-violet-500/50 bg-violet-500/5"
                      )}
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 text-2xl">
                        {wallet.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-white">
                            {wallet.name}
                          </span>
                          {wallet.popular && (
                            <span className="rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/50">
                          {wallet.description}
                        </p>
                      </div>
                      {connecting === wallet.id ? (
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                      ) : (
                        <Zap className="h-4 w-4 text-white/30 transition-colors group-hover:text-violet-400" />
                      )}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-center text-xs text-white/40">
                  By connecting, you agree to our{" "}
                  <a href="#" className="text-violet-400 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-violet-400 hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
