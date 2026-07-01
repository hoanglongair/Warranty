"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { WalletState, WalletProvider, Transaction } from "@/types";

interface WalletStore extends WalletState {
  transactions: Transaction[];
  connect: (provider: WalletProvider, address: string) => void;
  disconnect: () => void;
  addTransaction: (tx: Transaction) => void;
}

const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "incoming",
    amount: 1500,
    currency: "USDC",
    from: "0x7a3F8B92c5E4d8b1A6F9C2E7D3B8A4F1C9E6B2D5A",
    to: "0x9F2A8B4C1D7E3F5B8A2C9D4E6F1B7A3C8E2D5F9B1",
    date: "2026-06-13T10:30:00Z",
    status: "completed",
    hash: "0xabc123def456789",
    description: "Payment for Web3 Landing Page Design"
  },
  {
    id: "tx-2",
    type: "incoming",
    amount: 3500,
    currency: "USDC",
    from: "0x9b4E7A82c1F5d3C6B8A4E9F2D7C1B5A8E3F6C9D2B",
    to: "0x9F2A8B4C1D7E3F5B8A2C9D4E6F1B7A3C8E2D5F9B1",
    date: "2026-06-10T14:22:00Z",
    status: "completed",
    hash: "0xdef789abc123456",
    description: "React Dashboard Development - Milestone 2"
  },
  {
    id: "tx-3",
    type: "outgoing",
    amount: 45.5,
    currency: "USDC",
    from: "0x9F2A8B4C1D7E3F5B8A2C9D4E6F1B7A3C8E2D5F9B1",
    to: "0x5a2E8B1C4D7F3A9B6E1C4D8F2A5B9E3C7D1F4A8B2",
    date: "2026-06-08T09:15:00Z",
    status: "completed",
    hash: "0x123abc456def789",
    description: "Tip to Linh Nguyen"
  },
  {
    id: "tx-4",
    type: "incoming",
    amount: 2200,
    currency: "USDC",
    from: "0x3c8A9F1B4E7D2C5A8B6F1D9E4C7A2B5F8D1C4A7E0",
    to: "0x9F2A8B4C1D7E3F5B8A2C9D4E6F1B7A3C8E2D5F9B1",
    date: "2026-06-05T16:40:00Z",
    status: "completed",
    hash: "0x789def123abc456",
    description: "Brand Identity Package - Final"
  },
  {
    id: "tx-5",
    type: "pending",
    amount: 1200,
    currency: "USDC",
    from: "0x6E2D8B1A4C7F3D9B5A8E2C1D6F4B7A3C9E2D5F8B1",
    to: "0x9F2A8B4C1D7E3F5B8A2C9D4E6F1B7A3C8E2D5F9B1",
    date: "2026-06-14T08:00:00Z",
    status: "pending",
    hash: "0x456abc789def123",
    description: "AI Agent Development - Milestone 1"
  }
];

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      connected: true,
      address: "0x9F2A8B4C1D7E3F5B8A2C9D4E6F1B7A3C8E2D5F9B1",
      provider: "metamask" as WalletProvider,
      balance: 4.825,
      chainId: 5042002, // Arc Testnet
      ensName: "user.warranty.eth",
      transactions: mockTransactions,
      connect: (provider, address) =>
        set({
          connected: true,
          provider,
          address,
          balance: 4.825,
          chainId: 5042002,
          ensName: "user.warranty.eth"
        }),
      disconnect: () =>
        set({
          connected: false,
          address: null,
          provider: null,
          balance: 0,
          chainId: 1,
          ensName: undefined
        }),
      addTransaction: (tx) =>
        set((state) => ({ transactions: [tx, ...state.transactions] }))
    }),
    {
      name: "warranty-wallet"
    }
  )
);
