"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Globe, RefreshCcw, Sparkles, AlertCircle } from "lucide-react";
import { SUPPORTED_NETWORKS, ChainConfig } from "@/config/chains";
import { useWalletStore } from "@/store/wallet-store";
import { switchNetwork, getChainId, getBalance, formatBalanceWeiToEth } from "@/lib/wallet-connect";

interface NetworkModalProps {
  open: boolean;
  onClose: () => void;
}

export function NetworkModal({ open, onClose }: NetworkModalProps) {
  const [mounted, setMounted] = useState(false);
  const [switchingId, setSwitchingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { provider, chainId, address, setChainId, setBalance, setError: setStoreError } = useWalletStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      setError(null);
      setSwitchingId(null);
    }
  }, [open]);

  if (!mounted) return null;

  const handleSelectNetwork = async (network: ChainConfig) => {
    if (network.id === chainId) {
      onClose();
      return;
    }

    if (!provider) {
      setError("Ví chưa kết nối.");
      return;
    }

    setSwitchingId(network.id);
    setError(null);

    try {
      await switchNetwork(provider, network.hexId, network.params);

      const chainHex = await getChainId(provider);
      const newChainId = parseInt(chainHex, 16);
      setChainId(newChainId);

      if (address) {
        try {
          const wei = await getBalance(provider, address);
          setBalance(formatBalanceWeiToEth(wei));
        } catch {
          // balance fetch fallback
        }
      }

      setStoreError(null);
      onClose();
    } catch (err: unknown) {
      const e = err as { code?: number; message?: string };
      if (
        e?.code === 4001 ||
        e?.message?.toLowerCase().includes("user denied") ||
        e?.message?.toLowerCase().includes("reject")
      ) {
        setError("Bạn đã từ chối yêu cầu chuyển chain.");
      } else {
        setError(e?.message || "Không thể chuyển chain. Vui lòng thử lại.");
      }
    } finally {
      setSwitchingId(null);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card relative w-full max-w-lg overflow-hidden border border-white/10 p-6 shadow-2xl sm:p-7"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-white">
                      Chọn Mạng Lưới (Select Network)
                    </h2>
                    <p className="text-xs text-white/50">
                      Chuyển đổi chain trực tiếp trên ví Web3 đã kết nối
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                  <span className="flex-1">{error}</span>
                </div>
              )}

              {/* Networks List */}
              <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-2.5 pr-1">
                {SUPPORTED_NETWORKS.map((network) => {
                  const isActive = network.id === chainId;
                  const isSwitching = switchingId === network.id;

                  return (
                    <button
                      key={network.id}
                      onClick={() => handleSelectNetwork(network)}
                      disabled={isSwitching}
                      className={`group relative flex w-full items-center justify-between rounded-xl border p-3.5 transition-all text-left ${
                        isActive
                          ? "border-violet-500/60 bg-violet-500/15 text-white shadow-lg shadow-violet-500/10"
                          : "border-white/5 bg-white/[0.02] text-white/80 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${network.iconColor} font-bold text-white shadow-md text-xs`}
                        >
                          {network.shortName.slice(0, 3).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-white">
                              {network.name}
                            </span>
                            {network.isRecommended && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-violet-500/20 px-2 py-0.5 text-[10px] font-medium text-violet-300 border border-violet-500/30">
                                <Sparkles className="h-2.5 w-2.5" />
                                Recommended
                              </span>
                            )}
                            {network.isTestnet && !network.isRecommended && (
                              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-300 border border-amber-500/30">
                                Testnet
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-white/40 mt-0.5">
                            Chain ID: {network.id} • Symbol: {network.symbol}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {isSwitching ? (
                          <RefreshCcw className="h-4 w-4 animate-spin text-violet-400" />
                        ) : isActive ? (
                          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/30">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Active
                          </div>
                        ) : (
                          <span className="text-xs text-white/40 group-hover:text-white/80 transition-colors">
                            Chuyển
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-white/5 text-center">
                <p className="text-[11px] text-white/40">
                  Ví của bạn sẽ tự động gửi yêu cầu đổi mạng qua chuẩn{" "}
                  <code className="text-violet-300">wallet_switchEthereumChain</code>
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
