"use client";

import { useState, useEffect, useCallback } from "react";

interface TokenPrice {
  price: number;
  change24h: number;
}

interface PriceData {
  success: boolean;
  data?: Record<string, TokenPrice>;
  timestamp?: number;
}

interface UseTokenPricesReturn {
  prices: Record<string, TokenPrice>;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Default prices (fallback if API fails)
const DEFAULT_PRICES: Record<string, TokenPrice> = {
  bitcoin: { price: 63920.22, change24h: 1.6 },
  ethereum: { price: 1773.71, change24h: 1.0 },
  "usd-coin": { price: 0.9997, change24h: 0 },
  tether: { price: 0.9994, change24h: 0 },
  binancecoin: { price: 575.76, change24h: 0.3 },
  ripple: { price: 1.11, change24h: 0.4 },
  solana: { price: 78.98, change24h: 0.6 },
  tron: { price: 0.3318, change24h: 0.3 },
  dogecoin: { price: 0.07396, change24h: 1.3 },
  cardano: { price: 0.1668, change24h: 1.7 },
  chainlink: { price: 7.91, change24h: 1.8 },
  "avalanche-2": { price: 6.77, change24h: 0.3 },
  polkadot: { price: 0.8456, change24h: 0.8 },
  uniswap: { price: 3.51, change24h: 2.7 },
  litecoin: { price: 44.35, change24h: 0.3 },
  cosmos: { price: 1.56, change24h: 0.9 },
  filecoin: { price: 0.7892, change24h: 1.3 },
  aptos: { price: 0.6294, change24h: 0.8 },
  arbitrum: { price: 0.09288, change24h: 8.7 },
  near: { price: 1.93, change24h: 0.1 },
};

export function useTokenPrices(): UseTokenPricesReturn {
  const [prices, setPrices] = useState<Record<string, TokenPrice>>(DEFAULT_PRICES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/prices");

      if (!response.ok) {
        throw new Error("Failed to fetch prices");
      }

      const data: PriceData = await response.json();

      if (data.success && data.data) {
        setPrices(data.data);
      } else {
        throw new Error("Invalid response");
      }
    } catch (err) {
      console.warn("Using default prices:", err);
      setError("Using cached prices");
      // Keep default prices
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPrices();

    // Refresh every 60 seconds
    const interval = setInterval(fetchPrices, 60000);

    return () => clearInterval(interval);
  }, [fetchPrices]);

  return { prices, loading, error, refetch: fetchPrices };
}

// Helper function to format price
export function formatPrice(price: number, decimals: number = 2): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
  if (price >= 1) {
    return price.toFixed(decimals);
  }
  if (price >= 0.01) {
    return price.toFixed(4);
  }
  return price.toFixed(6);
}

// Helper function to format percentage change
export function formatChange(change: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(2)}%`;
}
