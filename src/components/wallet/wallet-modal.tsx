"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, Zap, AlertCircle, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useWalletStore } from "@/store/wallet-store";
import { cn } from "@/lib/utils";
import {
  ensureArcTestnet,
  formatBalanceWeiToEth,
  getBalance,
  getChainId,
  hasWalletExtension,
  isArcChain,
  requestAccounts,
  watchWallet
} from "@/lib/wallet-connect";
import type { WalletProvider } from "@/types";

interface WalletModalProps {
  open: boolean;
  onClose: () => void;
}

type WalletId = "metamask" | "walletconnect" | "coinbase" | "okx" | "trust" | "phantom" | "binance";

const wallets: Array<{
  id: WalletId;
  name: string;
  description: string;
  icon: string;
  popular: boolean;
  installUrl?: string;
}> = [
  {
    id: "metamask",
    name: "MetaMask",
    description: "Connect using browser extension",
    icon: "/wallets/okx.png",
    popular: true,
    installUrl: "https://metamask.io/download/"
  },
  {
    id: "okx",
    name: "OKX Wallet",
    description: "Connect with OKX Web3 wallet",
    icon: "/wallets/metamask.png",
    popular: true,
    installUrl: "https://www.okx.com/web3"
  },
  {
    id: "walletconnect",
    name: "WalletConnect",
    description: "Scan QR code with mobile wallet (chưa hỗ trợ demo)",
    icon: "/wallets/walletconnect.svg",
    popular: true
  },
  {
    id: "coinbase",
    name: "Coinbase Wallet",
    description: "Connect with your Coinbase account",
    icon: "/wallets/coinbase.png",
    popular: false,
    installUrl: "https://www.coinbase.com/wallet/downloads"
  },
  {
    id: "trust",
    name: "Trust Wallet",
    description: "Connect with Trust Wallet",
    icon: "/wallets/trust.png",
    popular: false,
    installUrl: "https://trustwallet.com/browser-extension"
  },
  {
    id: "phantom",
    name: "Phantom",
    description: "Connect with Phantom (EVM mode)",
    icon: "/wallets/phantom.png",
    popular: false,
    installUrl: "https://phantom.app/"
  },
  {
    id: "binance",
    name: "Binance Web3",
    description: "Connect with Binance Web3 wallet",
    icon: "/wallets/binance.png",
    popular: false,
    installUrl: "https://www.binance.com/en/web3wallet"
  }
];

export function WalletModal({ open, onClose }: WalletModalProps) {
  const [connecting, setConnecting] = useState<WalletId | null>(null);
  const [installedMap, setInstalledMap] = useState<Record<string, boolean>>({});
  const { connect, setConnection, setBalance, setChainId, setStoreConnecting, setError, error } =
    useWalletStore();

  useEffect(() => {
    if (!open) return;
    const map: Record<string, boolean> = {};
    wallets.forEach((w) => {
      if (w.id === "walletconnect") {
        map[w.id] = false;
      } else {
        map[w.id] = hasWalletExtension(w.id as WalletProvider);
      }
    });
    setInstalledMap(map);
  }, [open]);

  useEffect(() => {
    return () => setConnecting(false);
  }, [open]);

  const handleConnect = async (walletId: WalletId) => {
    if (walletId === "walletconnect") {
      setError("WalletConnect cần cấu hình projectId. Vui lòng chọn ví extension khác.");
      return;
    }
    setConnecting(walletId);
    setError(null);

    let unsub: (() => void) | null = null;
    try {
      const accounts = await requestAccounts(walletId as WalletProvider);
      const address = accounts[0];

      try {
        await ensureArcTestnet(walletId as WalletProvider);
      } catch {
        // Switch chain là optional — vẫn cho kết nối.
      }

      const chainHex = await getChainId(walletId as WalletProvider);
      const chainId = parseInt(chainHex, 16);

      let balance = 0;
      try {
        const wei = await getBalance(walletId as WalletProvider, address);
        balance = formatBalanceWeiToEth(wei);
      } catch {
        balance = 0;
      }

      setConnection({
        provider: walletId as WalletProvider,
        address,
        chainId,
        balance,
        realConnection: true
      });

      unsub = watchWallet(walletId as WalletProvider, {
        onAccountsChanged: (next) => {
          if (!next || next.length === 0) {
            useWalletStore.getState().disconnect();
          } else if (next[0] !== useWalletStore.getState().address) {
            setConnection({
              provider: walletId as WalletProvider,
              address: next[0],
              chainId: useWalletStore.getState().chainId,
              balance: useWalletStore.getState().balance,
              realConnection: true
            });
          }
        },
        onChainChanged: (next) => {
          const newChainId = parseInt(next, 16);
          setChainId(newChainId);
          if (!isArcChain(next)) {
            setError(
              "Bạn đang ở chain khác Arc Testnet. Một số tính năng có thể không hoạt động."
            );
          } else {
            setError(null);
          }
        },
        onDisconnect: () => {
          useWalletStore.getState().disconnect();
        }
      });

      onClose();
      setConnecting(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể kết nối ví.";
      setError(message);
      setConnecting(null);
    }
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
                      Kết nối trực tiếp với extension ví của bạn
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
                    Kết nối qua chuẩn EIP-1193. Ví vẫn nằm trong tay bạn — chúng tôi không lưu khóa.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                    <p className="text-xs text-red-200">{error}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {wallets.map((wallet) => {
                    const installed = installedMap[wallet.id];
                    return (
                      <div key={wallet.id} className="space-y-1">
                        <button
                          onClick={() => handleConnect(wallet.id)}
                          disabled={connecting !== null}
                          className={cn(
                            "group relative flex w-full items-center gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left transition-all hover:border-violet-500/30 hover:bg-white/[0.06] disabled:opacity-50",
                            connecting === wallet.id && "border-violet-500/50 bg-violet-500/5"
                          )}
                        >
                          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5">
                            <Image
                              src={wallet.icon}
                              alt={wallet.name}
                              width={32}
                              height={32}
                              className="h-8 w-8"
                            />
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
                              {installed && (
                                <span className="rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-300">
                                  Đã cài
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
                        {!installed && wallet.installUrl && (
                          <a
                            href={wallet.installUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 inline-flex items-center gap-1 text-[11px] text-violet-300/80 hover:text-violet-200"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Chưa có? Cài {wallet.name} tại đây
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>

                <p className="mt-6 text-center text-xs text-white/40">
                  Bằng việc kết nối, bạn đồng ý với{" "}
                  <a href="#" className="text-violet-400 hover:underline">
                    Điều khoản
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-violet-400 hover:underline">
                    Chính sách bảo mật
                  </a>{" "}
                  của chúng tôi.
                </p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}