"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Wallet, Send, ArrowDownLeft, ArrowUpRight, Copy, Check, 
  ExternalLink, Plus, Filter, TrendingUp, TrendingDown, Clock
} from "lucide-react";
import { useWalletStore } from "@/store/wallet-store";
import { formatCurrency, formatAddress } from "@/lib/utils";
import { WalletModal } from "@/components/wallet/wallet-modal";
import { WalletButton } from "@/components/wallet/wallet-button";

type Tab = "overview" | "transactions" | "send";

export default function WalletPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const { connected, transactions, balance, address, provider } = useWalletStore();

  const stats = [
    { label: "Total Balance", value: `${balance.toFixed(4)} ETH`, subvalue: "≈ $14,247.83", icon: Wallet, color: "from-violet-500 to-purple-500" },
    { label: "Received", value: "$9,200", subvalue: "5 transactions", icon: ArrowDownLeft, color: "from-green-500 to-emerald-500" },
    { label: "Sent", value: "$45.50", subvalue: "1 transaction", icon: ArrowUpRight, color: "from-amber-500 to-orange-500" },
  ];

  if (!connected) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-12 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500">
            <Wallet className="h-10 w-10 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-white">
            Connect Your Wallet
          </h1>
          <p className="mt-4 max-w-md mx-auto text-white/60">
            Connect your Web3 wallet to view your balance, transaction history, and manage your funds on Warranty.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="btn-primary mt-8"
          >
            Connect Wallet
          </button>
          <WalletModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Wallet
        </h1>
        <p className="mt-3 max-w-2xl text-lg text-white/60">
          Manage your crypto assets and transaction history.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="glass-card p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500">
                <Wallet className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-sm text-white/50">Connected Wallet</p>
                <p className="font-mono text-white">{formatAddress(address || "", 8)}</p>
                <p className="text-xs text-white/40 capitalize">{provider} Connected</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl font-bold text-white">
                {balance.toFixed(4)} <span className="text-lg text-white/60">ETH</span>
              </p>
              <p className="text-sm text-white/50">≈ $14,247.83 USD</p>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8 grid gap-4 sm:grid-cols-3"
      >
        {stats.map((stat) => (
          <div key={stat.label} className="glass-card p-5">
            <div className="flex items-center gap-4">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-sm text-white/50">{stat.subvalue}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="mb-6 flex items-center gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 max-w-md">
        {(["overview", "transactions", "send"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold capitalize transition-colors ${
              activeTab === tab ? "text-white" : "text-white/50 hover:text-white/80"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="wallet-tab"
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/20 to-cyan-500/20 ring-1 ring-white/10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative">{tab}</span>
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          <div className="glass-card p-6">
            <h3 className="font-display text-lg font-semibold text-white mb-4">Asset Distribution</h3>
            <div className="space-y-4">
              {[
                { name: "Ethereum", symbol: "ETH", amount: balance, value: balance * 2950, color: "from-violet-500 to-purple-500" },
                { name: "USD Coin", symbol: "USDC", amount: 2847.50, value: 2847.50, color: "from-blue-500 to-cyan-500" },
                { name: "Tether", symbol: "USDT", amount: 1230.00, value: 1230.00, color: "from-green-500 to-emerald-500" },
              ].map((asset) => (
                <div key={asset.symbol} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${asset.color} flex items-center justify-center font-bold text-white`}>
                      {asset.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-white">{asset.name}</p>
                      <p className="text-xs text-white/50">{asset.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-display font-bold text-white">{asset.amount.toLocaleString()} {asset.symbol}</p>
                    <p className="text-xs text-white/50">${asset.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "transactions" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/5">
            <h3 className="font-display text-lg font-semibold text-white">Transaction History</h3>
            <button className="btn-secondary px-3 py-1.5 text-xs">
              <Filter className="h-3.5 w-3.5 mr-1" />
              Filter
            </button>
          </div>
          <div className="divide-y divide-white/5">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    tx.type === "incoming" ? "bg-green-500/20 text-green-400" : tx.type === "outgoing" ? "bg-amber-500/20 text-amber-400" : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {tx.type === "incoming" ? <ArrowDownLeft className="h-5 w-5" /> : tx.type === "outgoing" ? <ArrowUpRight className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium text-white">{tx.description}</p>
                    <p className="text-xs text-white/50">
                      {tx.type === "incoming" ? "From" : "To"}: {formatAddress(tx.type === "incoming" ? tx.from : tx.to)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-display font-bold ${
                    tx.type === "incoming" ? "text-green-400" : "text-red-400"
                  }`}>
                    {tx.type === "incoming" ? "+" : "-"}{tx.amount.toLocaleString()} {tx.currency}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full ${
                      tx.status === "completed" ? "bg-green-500/20 text-green-300" : tx.status === "pending" ? "bg-amber-500/20 text-amber-300" : "bg-red-500/20 text-red-300"
                    }`}>
                      {tx.status}
                    </span>
                    <span>{new Date(tx.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === "send" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6"
        >
          <h3 className="font-display text-lg font-semibold text-white mb-6">Send Crypto</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Recipient Address</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="0x..."
                  className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/40 hover:text-white">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white placeholder-white/40 outline-none focus:border-violet-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Token</label>
                <select className="w-full h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-white outline-none focus:border-violet-500/50">
                  <option value="eth">ETH</option>
                  <option value="usdc">USDC</option>
                  <option value="usdt">USDT</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <span className="text-sm text-white/50">Estimated Gas Fee</span>
              <span className="text-sm text-white">~0.002 ETH ($5.90)</span>
            </div>
            <button className="btn-primary w-full">
              <Send className="h-4 w-4 mr-2" />
              Send
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
