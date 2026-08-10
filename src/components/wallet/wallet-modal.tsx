"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, Zap, AlertCircle, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
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
    icon: "/wallets/metamask.png",
    popular: true,
    installUrl: "https://metamask.io/download/"
  },
  {
    id: "okx",
    name: "OKX Wallet",
    description: "Connect with OKX Web3 wallet",
    icon: "/wallets/okx.png",
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
  const [mounted, setMounted] = useState(false);
  const { connect, setConnection, setBalance, setChainId, setStoreConnecting, setError, error } =
    useWalletStore();

  useEffect(() => {
    setMounted(true);
  }, []);

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
    return () => setConnecting(null);
  }, [open]);

  // Automatically cancel connecting spinner if user returns focus to app after closing wallet extension popup
  useEffect(() => {
    if (!connecting) return;

    let timer: NodeJS.Timeout;
    const handleFocus = () => {
      timer = setTimeout(() => {
        setConnecting((prev) => {
          if (prev && !useWalletStore.getState().connected) {
            return null;
          }
          return prev;
        });
      }, 1200);
    };

    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      if (timer) clearTimeout(timer);
    };
  }, [connecting]);

  // Lock body scroll and listen to ESC key press when modal is open
  useEffect(() => {
    if (!open) return;

    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  const handleConnect = async (walletId: WalletId) => {
    if (walletId === "walletconnect") {
      setError("WalletConnect cần cấu hình projectId. Vui lòng chọn ví extension khác.");
      return;
    }
    setConnecting(walletId);
    setError(null);

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

      watchWallet(walletId as WalletProvider, {
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
    } catch (err) {
      const message = err instanceof Error ? err.message : "Không thể kết nối ví.";
      setError(message);
    } finally {
      setConnecting(null);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="glass-card relative flex max-h-[90vh] sm:max-h-[85vh] w-full max-w-md flex-col overflow-hidden p-4 sm:p-6 shadow-2xl"
              role="dialog"
              aria-modal="true"
              aria-labelledby="wallet-modal-title"
            >
              {/* Background Glows */}
              <div className="pointer-events-none absolute -left-20 -top-20 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-cyan-500/20 blur-3xl" />

              {/* Modal Header */}
              <div className="relative flex-shrink-0 pb-3 sm:pb-4 border-b border-white/5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 id="wallet-modal-title" className="font-display text-lg sm:text-xl font-bold text-white">
                      Connect Wallet
                    </h2>
                    <p className="mt-0.5 text-xs sm:text-sm text-white/60">
                      Kết nối trực tiếp với extension ví của bạn
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    aria-label="Close connect wallet modal"
                    className="rounded-xl p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable */}
              <div className="relative flex-1 overflow-y-auto pt-3 sm:pt-4 pr-1 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2.5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-3">
                  <Shield className="h-4 w-4 flex-shrink-0 text-violet-400" />
                  <p className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                    Kết nối qua chuẩn EIP-1193. Ví vẫn nằm trong tay bạn — chúng tôi không lưu khóa.
                  </p>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                    <p className="text-xs text-red-200 leading-normal">{error}</p>
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
                            "group relative flex w-full items-center gap-3 sm:gap-4 overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:p-4 text-left transition-all hover:border-violet-500/30 hover:bg-white/[0.06] active:scale-[0.99] disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-violet-500/40",
                            connecting === wallet.id && "border-violet-500/50 bg-violet-500/5"
                          )}
                        >
                          <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 shadow-inner">
                            <Image
                              src={wallet.icon}
                              alt={wallet.name}
                              width={32}
                              height={32}
                              className="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                              <span className="font-semibold text-sm sm:text-base text-white truncate">
                                {wallet.name}
                              </span>
                              {wallet.popular && (
                                <span className="whitespace-nowrap rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-medium text-violet-300">
                                  Popular
                                </span>
                              )}
                              {installed && (
                                <span className="whitespace-nowrap rounded-full bg-green-500/20 px-2 py-0.5 text-[10px] font-medium text-green-300">
                                  Đã cài
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] sm:text-xs text-white/50 truncate mt-0.5">
                              {wallet.description}
                            </p>
                          </div>
                          {connecting === wallet.id ? (
                            <div className="h-5 w-5 flex-shrink-0 animate-spin rounded-full border-2 border-violet-400 border-t-transparent" />
                          ) : (
                            <Zap className="h-4 w-4 flex-shrink-0 text-white/30 transition-colors group-hover:text-violet-400" />
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
              </div>

              {/* Modal Footer */}
              <div className="relative flex-shrink-0 pt-3 sm:pt-4 border-t border-white/5 text-center">
                <p className="text-[11px] sm:text-xs text-white/40">
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
    </AnimatePresence>,
    document.body
  );
}