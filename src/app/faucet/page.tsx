"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Droplet, ExternalLink, Check, Copy, AlertCircle, Zap, Coins, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useWalletStore } from "@/store/wallet-store";
import { formatAddress } from "@/lib/utils";
import { WalletModal } from "@/components/wallet/wallet-modal";
import { ARC_CHAIN_ID_DECIMAL } from "@/config/tokens";

const FAUCET_URL = "https://faucet.circle.com";
const DOCS_URL = "https://docs.arc.io";

export default function FaucetPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { connected, address, chainId, provider } = useWalletStore();

  const isArcTestnet = chainId === ARC_CHAIN_ID_DECIMAL;

  const tokens = [
    {
      symbol: "USDC",
      name: "USD Coin",
      description: "Native gas token on Arc. Used for all transactions and fees.",
      color: "from-blue-500 to-cyan-500",
      limit: "20 USDC",
      logo: "/tokens/usdc.svg",
    },
    {
      symbol: "EURC",
      name: "Euro Coin",
      description: "Euro-denominated stablecoin by Circle. For FX and European payments.",
      color: "from-indigo-500 to-violet-500",
      limit: "20 EURC",
      logo: "/tokens/eurc.svg",
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Go to Circle Faucet",
      description: "Open the official Circle faucet website",
      action: { text: "Open Faucet", url: FAUCET_URL },
    },
    {
      number: 2,
      title: "Select Network",
      description: "Choose 'Arc Testnet' from the network dropdown",
    },
    {
      number: 3,
      title: "Enter Your Address",
      description: "Copy your wallet address from below",
      copyable: true,
    },
    {
      number: 4,
      title: "Request Tokens",
      description: "Click 'Send 20 USDC' to receive test tokens",
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-24 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12 text-center"
      >
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500">
          <Droplet className="h-10 w-10 text-white" />
        </div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Arc Testnet Faucet
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-white/60">
          Get free testnet USDC and EURC on Arc Testnet to build and test your Web3 applications.
        </p>
      </motion.div>

      {/* Chain Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        {!connected ? (
          <div className="glass-card p-6 text-center">
            <p className="text-white/60 mb-4">Connect your wallet to get your testnet address</p>
            <button onClick={() => setModalOpen(true)} className="btn-primary">
              Connect Wallet
            </button>
            <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
          </div>
        ) : !isArcTestnet ? (
          <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-100">
                Please switch to Arc Testnet (Chain ID: {ARC_CHAIN_ID_DECIMAL})
              </p>
              <p className="text-xs text-amber-200/80">
                You&apos;re currently on chain {chainId}. Switch to Arc Testnet to receive tokens.
              </p>
            </div>
          </div>
        ) : (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20">
                  <Check className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-white">Connected to Arc Testnet</p>
                  <p className="font-mono text-sm text-white/50">{formatAddress(address || "", 12)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm text-white/60">Ready to receive</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Wallet Address for Copy */}
      {connected && isArcTestnet && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="glass-card p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-sm text-white/50 mb-1">Your Wallet Address (Arc Testnet)</p>
                <p className="font-mono text-white">{address}</p>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(address || "")}
                className="btn-secondary px-4 py-2"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Address
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* How to Get Tokens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="h-5 w-5 text-violet-400" />
          How to Get Test Tokens
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 text-sm font-bold text-white">
                  {step.number}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-white">{step.title}</p>
                  <p className="text-sm text-white/50 mt-1">{step.description}</p>
                  {step.copyable && address && (
                    <div className="mt-2 flex items-center gap-2">
                      <code className="text-xs bg-white/5 px-2 py-1 rounded text-white/70">
                        {formatAddress(address, 8)}...
                      </code>
                    </div>
                  )}
                  {step.action && (
                    <a
                      href={step.action.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-violet-400 hover:text-violet-300"
                    >
                      {step.action.text}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Available Tokens */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h2 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Coins className="h-5 w-5 text-violet-400" />
          Available Test Tokens
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tokens.map((token) => (
            <div key={token.symbol} className="glass-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${token.color} flex items-center justify-center font-bold text-white`}>
                  {token.symbol.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-white">{token.symbol}</p>
                  <p className="text-sm text-white/50">{token.name}</p>
                </div>
              </div>
              <p className="text-sm text-white/60 mb-4">{token.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/40">Limit per claim</span>
                <span className="text-sm font-medium text-green-400">{token.limit}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Direct Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="glass-card p-6"
      >
        <h3 className="font-display text-lg font-semibold text-white mb-4">
          Get Test Tokens Now
        </h3>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={FAUCET_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex-1 text-center"
          >
            <Droplet className="h-4 w-4 mr-2" />
            Open Circle Faucet
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
          <Link href="/wallet" className="btn-secondary flex-1 text-center">
            <ArrowRight className="h-4 w-4 mr-2" />
            Go to Wallet
          </Link>
        </div>
      </motion.div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8 flex items-start gap-3 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4"
      >
        <AlertCircle className="h-5 w-5 flex-shrink-0 text-violet-400 mt-0.5" />
        <div className="text-sm text-white/70">
          <p className="font-medium text-white mb-1">Testnet Tokens Only</p>
          <p>
            These are test tokens with no real value. They can only be used on Arc Testnet.
            The faucet limits one claim per token per network every 2 hours.
            For more details, visit the{" "}
            <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">
              Arc documentation
            </a>
            .
          </p>
        </div>
      </motion.div>
    </div>
  );
}
