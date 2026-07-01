"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, LogOut, Copy, Check, ChevronDown } from "lucide-react";
import { useWalletStore } from "@/store/wallet-store";
import { formatAddress } from "@/lib/utils";
import { WalletModal } from "./wallet-modal";
import Link from "next/link";

const ARC_CHAIN_ID = 5042002;

export function WalletButton() {
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { connected, address, ensName, balance, chainId, disconnect } = useWalletStore();
  const isArcTestnet = chainId === ARC_CHAIN_ID;

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (!connected) {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className="btn-primary"
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </button>
        <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-medium text-white transition-all hover:border-violet-500/30 hover:bg-white/[0.08]"
      >
        <div className="relative">
          <div className="h-7 w-7 rounded-full overflow-hidden flex items-center justify-center bg-white p-0.5">
            <img src="/arc-logo.png" alt="Arc" className="object-contain w-full h-full" />
          </div>
          <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[hsl(var(--background))] bg-green-500" />
        </div>
        <div className="hidden flex-col items-start leading-tight md:flex">
          <span className="text-xs font-semibold text-white">
            {balance.toFixed(3)} {isArcTestnet ? "USDC" : "ETH"}
          </span>
          <span className="text-[10px] text-white/50">
            {ensName || formatAddress(address || "")}
          </span>
        </div>
        <ChevronDown className="h-3.5 w-3.5 text-white/50" />
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
              className="glass-card absolute right-0 top-full z-50 mt-2 w-72 overflow-hidden p-2"
            >
              <div className="mb-2 rounded-lg bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-cyan-500/20 p-4">
                <p className="text-xs text-white/60">Total Balance</p>
                <p className="mt-1 font-display text-2xl font-bold text-white">
                  {balance.toFixed(4)} <span className="text-base text-white/60">ETH</span>
                </p>
                <p className="mt-0.5 text-xs text-white/50">≈ $14,247.83 USD</p>
              </div>

              <button
                onClick={handleCopy}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <span className="font-mono text-xs">
                  {formatAddress(address || "", 6)}
                </span>
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-green-400" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </button>

              <div className="my-1 h-px bg-white/5" />

              <Link
                href="/wallet"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <Wallet className="h-4 w-4" />
                <span>Wallet Dashboard</span>
              </Link>

              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 transition-colors hover:bg-white/5 hover:text-white"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Wallet Settings</span>
              </Link>

              <div className="my-1 h-px bg-white/5" />

              <button
                onClick={() => {
                  disconnect();
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Disconnect</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
