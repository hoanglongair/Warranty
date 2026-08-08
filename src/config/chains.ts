import { ARC_CHAIN_ID_DECIMAL, ARC_CHAIN_ID_HEX, ARC_TESTNET_RPC, ARC_TESTNET_EXPLORER } from "./tokens";

interface Chain {
  id: number;
  name: string;
  nativeCurrency: {
    decimals: number;
    name: string;
    symbol: string;
  };
  rpcUrls: {
    default: { http: string[] };
    public: { http: string[] };
  };
  blockExplorers: {
    etherscan: { name: string; url: string };
    default: { name: string; url: string };
  };
  testnet: boolean;
}

export const arcTestnet: Chain = {
  id: ARC_CHAIN_ID_DECIMAL,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 6,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: {
      http: [ARC_TESTNET_RPC],
    },
    public: {
      http: [ARC_TESTNET_RPC],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "ArcScan",
      url: ARC_TESTNET_EXPLORER,
    },
    default: {
      name: "ArcScan",
      url: ARC_TESTNET_EXPLORER,
    },
  },
  testnet: true,
};

export const arcTestnetParams = {
  chainId: ARC_CHAIN_ID_HEX,
  chainName: "Arc Testnet",
  nativeCurrency: {
    name: "USDC",
    symbol: "USDC",
    decimals: 6,
  },
  rpcUrls: [ARC_TESTNET_RPC],
  blockExplorerUrls: [ARC_TESTNET_EXPLORER],
};

export const SUPPORTED_CHAINS = {
  ethereum: {
    id: 1,
    name: "Ethereum",
    symbol: "ETH",
    rpcUrl: "https://eth.llamarpc.com",
    explorer: "https://etherscan.io",
  },
  arcTestnet: {
    id: ARC_CHAIN_ID_DECIMAL,
    name: "Arc Testnet",
    symbol: "USDC",
    rpcUrl: ARC_TESTNET_RPC,
    explorer: ARC_TESTNET_EXPLORER,
  },
};
