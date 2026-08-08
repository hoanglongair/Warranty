// Arc Network Token Addresses
// Source: https://docs.arc.io/arc/references/contract-addresses
// Prices: https://www.coingecko.com (updated July 10, 2026)

export const ARC_CHAIN_ID_DECIMAL = 5042002;
export const ARC_CHAIN_ID_HEX = "0x4CF4B2";

export const ARC_TESTNET_RPC = "https://rpc.testnet.arc.network";
export const ARC_TESTNET_EXPLORER = "https://testnet.arcscan.app";

// CoinGecko API base URL
export const COINGECKO_API = "https://api.coingecko.com/api/v3";

// Token prices from CoinGecko (USD, updated July 10, 2026)
export const TOKEN_PRICES = {
  BTC: 63920.22,
  ETH: 1773.71,
  USDT: 0.9994,
  USDC: 0.9997,
  BNB: 575.76,
  XRP: 1.11,
  SOL: 78.98,
  TRX: 0.3318,
  DOGE: 0.07396,
  ADA: 0.1668,
  LINK: 7.91,
  AVAX: 6.77,
  DOT: 0.8456,
  MATIC: 0.07720,
  ARB: 0.09288,
  UNI: 3.51,
  LTC: 44.35,
  ATOM: 1.56,
  NEAR: 1.93,
  FIL: 0.7892,
  APT: 0.6294,
  MKR: 2143.00,
  AAVE: 94.26,
  SNX: 2.45,
  CRV: 0.32,
} as const;

export const ARC_TOKENS = {
  USDC: {
    address: "0x3600000000000000000000000000000000000000",
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    nativeDecimals: 18,
    isNative: true,
    logo: "/tokens/usdc.svg",
    coingeckoId: "usd-coin",
    price: TOKEN_PRICES.USDC,
  },
  EURC: {
    address: "0x89B50855Aa3bE2F677cD6303Cec089B5F319D72a",
    symbol: "EURC",
    name: "Euro Coin",
    decimals: 6,
    isNative: false,
    logo: "/tokens/eurc.svg",
    coingeckoId: "euro-coin",
    price: 1.08, // EUR pegged, approximate
  },
  USYC: {
    address: "0xe9185F0c5F296Ed1797AaE4238D26CCaBEadb86C",
    symbol: "USYC",
    name: "US Yield Coin",
    decimals: 6,
    isNative: false,
    logo: "/tokens/usyc.svg",
    coingeckoId: "usyc",
    price: 1.02, // Yield bearing, approximate
  },
} as const;

// Popular tokens supported on Warranty platform
export const SUPPORTED_TOKENS = [
  {
    symbol: "ETH",
    name: "Ethereum",
    decimals: 18,
    logo: "/tokens/eth.svg",
    coingeckoId: "ethereum",
    price: TOKEN_PRICES.ETH,
    isNative: true,
    chainId: 1,
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    decimals: 6,
    logo: "/tokens/usdc.svg",
    coingeckoId: "usd-coin",
    price: TOKEN_PRICES.USDC,
    isNative: false,
    chainId: 1,
  },
  {
    symbol: "USDT",
    name: "Tether",
    decimals: 6,
    logo: "/tokens/usdt.svg",
    coingeckoId: "tether",
    price: TOKEN_PRICES.USDT,
    isNative: false,
    chainId: 1,
  },
  {
    symbol: "WARR",
    name: "Warranty",
    decimals: 18,
    logo: "/tokens/warr.svg",
    coingeckoId: null,
    price: 0.12, // Project token, placeholder
    isNative: false,
    chainId: 1,
  },
  {
    symbol: "BNB",
    name: "BNB",
    decimals: 18,
    logo: "/tokens/bnb.svg",
    coingeckoId: "binancecoin",
    price: TOKEN_PRICES.BNB,
    isNative: true,
    chainId: 56,
  },
  {
    symbol: "SOL",
    name: "Solana",
    decimals: 9,
    logo: "/tokens/sol.svg",
    coingeckoId: "solana",
    price: TOKEN_PRICES.SOL,
    isNative: true,
    chainId: "solana",
  },
] as const;

export const ARC_CROSSCHAIN = {
  CCTP: {
    TokenMessenger: "0x8FE6B999Dc680CcFDD5Bf7EB0974218be2542DAA",
    MessageTransmitter: "0xE737e5cEBEEBa77EFE34D4aa090756590b1CE275",
    TokenMinter: "0xb43db544E2c27092c107639Ad201b3dEfAbcF192",
  },
  Gateway: {
    Wallet: "0x0077777d7EBA4688BDeF3E311b846F25870A19B9",
    Minter: "0x0022222ABE238Cc2C7Bb1f21003F0a260052475B",
  },
  StableFX: {
    FxEscrow: "0x867650F5eAe8df91445971f14d89fd84F0C9a9f8",
  },
} as const;

export const ARC_COMMON_CONTRACTS = {
  Permit2: "0x000000000022D473030F116dDEE9F6B43aC78BA3",
  Multicall3: "0xcA11bde05977b3631167028862bE2a173976CA11",
  CREATE2Factory: "0x4e59b44847b379578588920cA78FbF26c0B4956C",
} as const;

export const CHAIN_INFO = {
  [ARC_CHAIN_ID_DECIMAL]: {
    name: "Arc Testnet",
    symbol: "USDC",
    rpcUrl: ARC_TESTNET_RPC,
    explorerUrl: ARC_TESTNET_EXPLORER,
    isTestnet: true,
    nativeToken: "USDC",
    avgGasFeeUsd: 0.01,
    avgSettlementTime: "< 1 sec",
  },
  1: {
    name: "Ethereum",
    symbol: "ETH",
    rpcUrl: "https://eth.llamarpc.com",
    explorerUrl: "https://etherscan.io",
    isTestnet: false,
    nativeToken: "ETH",
    avgGasFeeUsd: 5,
    avgSettlementTime: "~12 sec",
  },
} as const;

export type SupportedToken = keyof typeof ARC_TOKENS;
