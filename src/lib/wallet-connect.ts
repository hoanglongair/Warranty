import { ARC_CHAIN_ID_HEX } from "@/config/tokens";
import { arcTestnetParams } from "@/config/chains";
import type { WalletProvider } from "@/types";

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}

export interface EthereumProvider {
  isMetaMask?: boolean;
  isCoinbaseWallet?: boolean;
  isOKXWallet?: boolean;
  isBinanceW3W?: boolean;
  isBinance?: boolean;
  isTrust?: boolean;
  isPhantom?: boolean;
  isRabby?: boolean;
  providers?: EthereumProvider[];
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
}

export interface EthereumProvider {
  ethereum?: EthereumProvider;
  okxwallet?: EthereumProvider;
  coinbaseWalletExtension?: EthereumProvider;
  trustwallet?: EthereumProvider;
  phantom?: { ethereum?: EthereumProvider };
  binancew3w?: EthereumProvider;
  binance?: EthereumProvider;
}

export interface WalletWindow {
  ethereum?: EthereumProvider;
  okxwallet?: EthereumProvider;
  coinbaseWalletExtension?: EthereumProvider;
  trustwallet?: EthereumProvider;
  phantom?: { ethereum?: EthereumProvider };
  binancew3w?: EthereumProvider;
  binance?: EthereumProvider;
}

function isOKXProvider(p: EthereumProvider): boolean {
  if (!p) return false;
  const anyP = p as unknown as Record<string, boolean | undefined>;
  return Boolean(anyP.isOKXWallet || anyP.isOkxWallet);
}

function isMetaMaskProvider(p: EthereumProvider): boolean {
  if (!p || !p.isMetaMask) return false;
  const anyP = p as unknown as Record<string, boolean | undefined>;
  if (
    anyP.isOKXWallet ||
    anyP.isOkxWallet ||
    anyP.isBraveWallet ||
    anyP.isCoinbaseWallet ||
    anyP.isPhantom ||
    anyP.isRabby ||
    anyP.isTrust ||
    anyP.isBinanceW3W ||
    anyP.isBinance
  ) {
    return false;
  }
  return true;
}

const eip6963Providers: Record<string, EthereumProvider> = {};

if (typeof window !== "undefined") {
  const handleAnnounce = (event: Event) => {
    const customEvent = event as CustomEvent<{
      info: { rdns?: string; name?: string };
      provider: EthereumProvider;
    }>;
    if (customEvent.detail && customEvent.detail.provider) {
      const { rdns, name } = customEvent.detail.info || {};
      const provider = customEvent.detail.provider;
      const lowerRdns = rdns ? rdns.toLowerCase() : "";
      const lowerName = name ? name.toLowerCase() : "";

      if ((lowerRdns.includes("metamask") || lowerName.includes("metamask")) && !lowerRdns.includes("okx") && !lowerName.includes("okx")) {
        eip6963Providers["metamask"] = provider;
      }
      if (lowerRdns.includes("okx") || lowerRdns.includes("okex") || lowerName.includes("okx")) {
        eip6963Providers["okx"] = provider;
      }
      if (lowerRdns.includes("coinbase") || lowerName.includes("coinbase")) {
        eip6963Providers["coinbase"] = provider;
      }
      if (lowerRdns.includes("phantom") || lowerName.includes("phantom")) {
        eip6963Providers["phantom"] = provider;
      }
      if (lowerRdns.includes("trust") || lowerName.includes("trust")) {
        eip6963Providers["trust"] = provider;
      }
      if (lowerRdns.includes("binance") || lowerName.includes("binance")) {
        eip6963Providers["binance"] = provider;
      }
    }
  };

  window.addEventListener("eip6963:announceProvider", handleAnnounce);
  try {
    window.dispatchEvent(new Event("eip6963:requestProvider"));
  } catch {
    // Ignore in non-supporting contexts
  }
}

export function getProvider(id: WalletProvider): EthereumProvider | null {
  if (typeof window === "undefined") return null;

  const w = window as unknown as WalletWindow;

  // 1. Dedicated window objects first (OKX Wallet has dedicated window.okxwallet)
  if (id === "okx" && w.okxwallet && typeof w.okxwallet.request === "function") {
    return w.okxwallet;
  }
  if (id === "coinbase" && w.coinbaseWalletExtension && typeof w.coinbaseWalletExtension.request === "function") {
    return w.coinbaseWalletExtension;
  }
  if (id === "phantom" && w.phantom?.ethereum && typeof w.phantom.ethereum.request === "function") {
    return w.phantom.ethereum;
  }
  if (id === "trust" && w.trustwallet && typeof w.trustwallet.request === "function") {
    return w.trustwallet;
  }
  if (id === "binance" && (w.binancew3w || w.binance)) {
    const b = w.binancew3w || w.binance;
    if (b && typeof b.request === "function") return b;
  }

  // 2. Check EIP-6963 discovered providers
  if (eip6963Providers[id] && typeof eip6963Providers[id].request === "function") {
    return eip6963Providers[id];
  }

  if (!w.ethereum) return null;

  // 3. Multi-extension environment (window.ethereum.providers array)
  if (Array.isArray(w.ethereum.providers)) {
    const providers = w.ethereum.providers;

    if (id === "metamask") {
      const pureMetaMask = providers.find(isMetaMaskProvider);
      if (pureMetaMask) return pureMetaMask;
      return null;
    }

    if (id === "okx") {
      const okx = providers.find(isOKXProvider);
      if (okx) return okx;
      return null;
    }

    if (id === "coinbase") {
      const hit = providers.find((p) => p.isCoinbaseWallet);
      if (hit) return hit;
      return null;
    }

    if (id === "phantom") {
      const hit = providers.find((p) => p.isPhantom);
      if (hit) return hit;
      return null;
    }

    if (id === "trust") {
      const hit = providers.find((p) => p.isTrust);
      if (hit) return hit;
      return null;
    }

    if (id === "binance") {
      const hit = providers.find((p) => p.isBinanceW3W || p.isBinance);
      if (hit) return hit;
      return null;
    }

    return null;
  }

  // 4. Single window.ethereum provider
  const ep = w.ethereum as EthereumProvider;

  if (id === "metamask") {
    if (isMetaMaskProvider(ep)) return ep;
    return null;
  }

  if (id === "okx") {
    if (isOKXProvider(ep)) return ep;
    return null;
  }

  if (id === "coinbase" && ep.isCoinbaseWallet) return ep;
  if (id === "phantom" && ep.isPhantom) return ep;
  if (id === "trust" && ep.isTrust) return ep;
  if (id === "binance" && (ep.isBinanceW3W || ep.isBinance)) return ep;

  // Strictly return null if requested extension is not installed
  return null;
}

export function hasWalletExtension(id: WalletProvider): boolean {
  if (typeof window === "undefined") return false;
  return getProvider(id) !== null;
}

export async function requestAccounts(id: WalletProvider): Promise<string[]> {
  const provider = getProvider(id);
  if (!provider) {
    throw new Error(
      "Không tìm thấy ví extension. Vui lòng cài MetaMask / OKX / Coinbase / Trust / Phantom / Binance Web3 và tải lại trang."
    );
  }

  const requestPromise = provider.request({
    method: "eth_requestAccounts"
  }) as Promise<string[]>;

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("Thời gian yêu cầu kết nối đã quá hạn. Vui lòng thử lại."));
    }, 20000);
  });

  try {
    const accounts = await Promise.race([requestPromise, timeoutPromise]);
    if (!accounts || accounts.length === 0) {
      throw new Error("Ví chưa cấp quyền truy cập tài khoản.");
    }
    return accounts;
  } catch (err: unknown) {
    const e = err as { code?: number; message?: string };
    if (e?.code === -32000) {
      throw new Error("Yêu cầu kết nối đang chờ xử lý. Vui lòng mở icon tiện ích ví trên trình duyệt để phê duyệt.");
    }
    if (
      e?.code === 4001 ||
      e?.message?.toLowerCase().includes("reject") ||
      e?.message?.toLowerCase().includes("user denied") ||
      e?.message?.toLowerCase().includes("canceled") ||
      e?.message?.toLowerCase().includes("cancelled")
    ) {
      throw new Error("Bạn đã từ chối hoặc hủy yêu cầu kết nối ví.");
    }
    throw err;
  }
}

export async function getChainId(id: WalletProvider): Promise<string> {
  const provider = getProvider(id);
  if (!provider) throw new Error("Provider không khả dụng.");
  return (await provider.request({ method: "eth_chainId" })) as string;
}

export async function getBalance(id: WalletProvider, address: string): Promise<string> {
  const provider = getProvider(id);
  if (!provider) throw new Error("Provider không khả dụng.");
  return (await provider.request({
    method: "eth_getBalance",
    params: [address, "latest"]
  })) as string;
}

export async function switchNetwork(
  id: WalletProvider,
  chainIdHex: string,
  chainParams?: Record<string, unknown>
): Promise<void> {
  const provider = getProvider(id);
  if (!provider) throw new Error("Provider không khả dụng.");
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: chainIdHex }]
    });
  } catch (switchError: unknown) {
    const err = switchError as { code?: number };
    if ((err.code === 4902 || err.code === -32603) && chainParams) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [chainParams]
      });
    } else {
      throw switchError;
    }
  }
}

export async function ensureArcTestnet(id: WalletProvider): Promise<void> {
  return switchNetwork(id, ARC_CHAIN_ID_HEX, arcTestnetParams as unknown as Record<string, unknown>);
}

export function watchWallet(
  id: WalletProvider,
  handlers: {
    onAccountsChanged?: (accounts: string[]) => void;
    onChainChanged?: (chainId: string) => void;
    onDisconnect?: () => void;
  }
): () => void {
  const provider = getProvider(id);
  if (!provider || !provider.on || !provider.removeListener) {
    return () => {};
  }

  const onAccountsChanged = (raw: unknown) => {
    handlers.onAccountsChanged?.((raw as string[]) ?? []);
  };
  const onChainChanged = (raw: unknown) => {
    handlers.onChainChanged?.((raw as string) ?? "0x1");
  };
  const onDisconnect = () => handlers.onDisconnect?.();

  provider.on("accountsChanged", onAccountsChanged as never);
  provider.on("chainChanged", onChainChanged as never);
  provider.on("disconnect", onDisconnect as never);

  return () => {
    provider.removeListener?.("accountsChanged", onAccountsChanged as never);
    provider.removeListener?.("chainChanged", onChainChanged as never);
    provider.removeListener?.("disconnect", onDisconnect as never);
  };
}

export function formatBalanceWeiToEth(weiHex: string): number {
  try {
    const wei = BigInt(weiHex);
    const whole = Number(wei / 10n ** 14n) / 10000;
    return Number.isFinite(whole) ? whole : 0;
  } catch {
    return 0;
  }
}

export function isArcChain(chainIdHex: string): boolean {
  return chainIdHex?.toLowerCase() === ARC_CHAIN_ID_HEX.toLowerCase();
}