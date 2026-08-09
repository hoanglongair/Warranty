import { ARC_CHAIN_ID_DECIMAL, ARC_CHAIN_ID_HEX, ARC_TESTNET_RPC, ARC_TESTNET_EXPLORER } from "./tokens";

export interface ChainConfig {
  id: number;
  hexId: string;
  name: string;
  shortName: string;
  symbol: string;
  iconColor: string;
  isTestnet: boolean;
  isRecommended?: boolean;
  params: {
    chainId: string;
    chainName: string;
    nativeCurrency: {
      name: string;
      symbol: string;
      decimals: number;
    };
    rpcUrls: string[];
    blockExplorerUrls: string[];
  };
}

export const arcTestnetParams = {
  chainId: ARC_CHAIN_ID_HEX,
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 18,
  },
  rpcUrls: [ARC_TESTNET_RPC],
  blockExplorerUrls: [ARC_TESTNET_EXPLORER],
};

export const SUPPORTED_NETWORKS: ChainConfig[] = [
  {
    id: ARC_CHAIN_ID_DECIMAL,
    hexId: ARC_CHAIN_ID_HEX,
    name: "Arc Testnet",
    shortName: "Arc",
    symbol: "USDC",
    iconColor: "from-violet-500 to-purple-500",
    isTestnet: true,
    isRecommended: true,
    params: arcTestnetParams,
  },
  {
    id: 1,
    hexId: "0x1",
    name: "Ethereum Mainnet",
    shortName: "Ethereum",
    symbol: "ETH",
    iconColor: "from-blue-500 to-cyan-500",
    isTestnet: false,
    params: {
      chainId: "0x1",
      chainName: "Ethereum Mainnet",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://eth.llamarpc.com"],
      blockExplorerUrls: ["https://etherscan.io"],
    },
  },
  {
    id: 11155111,
    hexId: "0xaa36a7",
    name: "Sepolia Testnet",
    shortName: "Sepolia",
    symbol: "ETH",
    iconColor: "from-indigo-500 to-sky-500",
    isTestnet: true,
    params: {
      chainId: "0xaa36a7",
      chainName: "Sepolia Testnet",
      nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://rpc.sepolia.org"],
      blockExplorerUrls: ["https://sepolia.etherscan.io"],
    },
  },
  {
    id: 56,
    hexId: "0x38",
    name: "BNB Smart Chain",
    shortName: "BNB Chain",
    symbol: "BNB",
    iconColor: "from-amber-500 to-yellow-400",
    isTestnet: false,
    params: {
      chainId: "0x38",
      chainName: "BNB Smart Chain",
      nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
      rpcUrls: ["https://bsc-dataseed.binance.org"],
      blockExplorerUrls: ["https://bscscan.com"],
    },
  },
  {
    id: 97,
    hexId: "0x61",
    name: "BNB Smart Chain Testnet",
    shortName: "BSC Testnet",
    symbol: "tBNB",
    iconColor: "from-yellow-500 to-amber-500",
    isTestnet: true,
    params: {
      chainId: "0x61",
      chainName: "BNB Smart Chain Testnet",
      nativeCurrency: { name: "Testnet BNB", symbol: "tBNB", decimals: 18 },
      rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
      blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
  },
  {
    id: 137,
    hexId: "0x89",
    name: "Polygon Mainnet",
    shortName: "Polygon",
    symbol: "POL",
    iconColor: "from-purple-600 to-indigo-600",
    isTestnet: false,
    params: {
      chainId: "0x89",
      chainName: "Polygon Mainnet",
      nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
      rpcUrls: ["https://polygon-rpc.com"],
      blockExplorerUrls: ["https://polygonscan.com"],
    },
  },
  {
    id: 42161,
    hexId: "0xa4b1",
    name: "Arbitrum One",
    shortName: "Arbitrum",
    symbol: "ETH",
    iconColor: "from-cyan-600 to-blue-600",
    isTestnet: false,
    params: {
      chainId: "0xa4b1",
      chainName: "Arbitrum One",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://arb1.arbitrum.io/rpc"],
      blockExplorerUrls: ["https://arbiscan.io"],
    },
  },
  {
    id: 8453,
    hexId: "0x2105",
    name: "Base Mainnet",
    shortName: "Base",
    symbol: "ETH",
    iconColor: "from-blue-600 to-indigo-500",
    isTestnet: false,
    params: {
      chainId: "0x2105",
      chainName: "Base Mainnet",
      nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
      rpcUrls: ["https://mainnet.base.org"],
      blockExplorerUrls: ["https://basescan.org"],
    },
  },
];

export function getChainConfig(chainId: number): ChainConfig | undefined {
  return SUPPORTED_NETWORKS.find((c) => c.id === chainId);
}

