import { ARC_CHAIN_ID_DECIMAL, ARC_CHAIN_ID_HEX } from "@/config/tokens";
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

function walletFlag(id: WalletProvider): keyof EthereumProvider | null {
  const map: Record<WalletProvider, keyof EthereumProvider | null> = {
    metamask: "isMetaMask",
    coinbase: "isCoinbaseWallet",
    okx: "isOKXWallet",
    trust: "isTrust",
    phantom: "isPhantom",
    binance: "isBinanceW3W",
    walletconnect: null
  };
  return map[id];
}

export function getProvider(id: WalletProvider): EthereumProvider | null {
  if (typeof window === "undefined") return null;
  const w = window;
  if (!w.ethereum) return null;

  const flag = walletFlag(id);
  if (!flag) return null;

  if (Array.isArray(w.ethereum.providers)) {
    const hit = w.ethereum.providers.find((p) => Boolean(p[flag]));
    if (hit) return hit;
  }

  const ep = w.ethereum as EthereumProvider;
  if (ep[flag]) return ep;

  // OKX direct injection fallback
  if (id === "okx" && ep.isOKXWallet) return ep;

  return null;
}

export function hasWalletExtension(id: WalletProvider): boolean {
  if (typeof window === "undefined") return false;
  const w = window;
  if (!w.ethereum) return false;
  if (id === "walletconnect") return false;

  const flag = walletFlag(id);
  if (!flag) return false;

  if (Array.isArray(w.ethereum.providers)) {
    if (w.ethereum.providers.some((p) => Boolean(p[flag]))) return true;
  }
  if (Boolean((w.ethereum as EthereumProvider)[flag])) return true;

  // OKX fallback: check direct ethereum object for known OKX properties
  if (id === "okx") {
    const ep = w.ethereum as EthereumProvider;
    if (ep.isOKXWallet) return true;
    if (typeof ep.request === "function" && (ep as unknown as { isOkxWallet?: boolean }).isOkxWallet) return true;
  }
  if (id === "binance") {
    const ep = w.ethereum as EthereumProvider;
    if (ep.isBinanceW3W || ep.isBinance) return true;
  }

  return false;
}

export async function requestAccounts(id: WalletProvider): Promise<string[]> {
  const provider = getProvider(id);
  if (!provider) {
    throw new Error(
      "Không tìm thấy ví extension. Vui lòng cài MetaMask / OKX / Coinbase / Trust / Phantom / Binance Web3 và tải lại trang."
    );
  }
  const accounts = (await provider.request({
    method: "eth_requestAccounts"
  })) as string[];
  if (!accounts || accounts.length === 0) {
    throw new Error("Ví chưa cấp quyền truy cập tài khoản.");
  }
  return accounts;
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

export async function ensureArcTestnet(id: WalletProvider): Promise<void> {
  const provider = getProvider(id);
  if (!provider) throw new Error("Provider không khả dụng.");
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: ARC_CHAIN_ID_HEX }]
    });
  } catch (switchError) {
    const err = switchError as { code?: number };
    if (err.code === 4902 || err.code === -32603) {
      await provider.request({
        method: "wallet_addEthereumChain",
        params: [arcTestnetParams]
      });
    } else {
      throw switchError;
    }
  }
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