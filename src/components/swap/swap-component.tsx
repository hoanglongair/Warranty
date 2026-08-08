"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownUp, ChevronDown, Loader2, Check,
  AlertCircle, Info, TrendingUp, RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTokenPrices, formatPrice, formatChange } from "@/lib/hooks/use-token-prices";
import { TOKEN_PRICES } from "@/config/tokens";

interface Token {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  icon: string;
  coingeckoId: string;
}

// Get dynamic prices from CoinGecko
const getTokenValue = (symbol: string, prices: Record<string, { price: number; change24h: number }>): number => {
  const priceMap: Record<string, string> = {
    ETH: "ethereum",
    USDC: "usd-coin",
    USDT: "tether",
    BNB: "binancecoin",
    SOL: "solana",
    XRP: "ripple",
    DOGE: "dogecoin",
    ADA: "cardano",
    LINK: "chainlink",
    AVAX: "avalanche-2",
    DOT: "polkadot",
    UNI: "uniswap",
    ARB: "arbitrum",
    NEAR: "near",
    ATOM: "cosmos",
    FIL: "filecoin",
    APT: "aptos",
    LTC: "litecoin",
  };

  const coingeckoId = priceMap[symbol];
  if (coingeckoId && prices[coingeckoId]) {
    return prices[coingeckoId].price;
  }

  // Fallback to TOKEN_PRICES
  const fallbackPrices: Record<string, number> = {
    ETH: TOKEN_PRICES.ETH,
    USDC: TOKEN_PRICES.USDC,
    USDT: TOKEN_PRICES.USDT,
    BNB: TOKEN_PRICES.BNB,
    SOL: TOKEN_PRICES.SOL,
    XRP: TOKEN_PRICES.XRP,
    DOGE: TOKEN_PRICES.DOGE,
    ADA: TOKEN_PRICES.ADA,
    LINK: TOKEN_PRICES.LINK,
    AVAX: TOKEN_PRICES.AVAX,
    DOT: TOKEN_PRICES.DOT,
    UNI: TOKEN_PRICES.UNI,
    ARB: TOKEN_PRICES.ARB,
    NEAR: TOKEN_PRICES.NEAR,
    ATOM: TOKEN_PRICES.ATOM,
    FIL: TOKEN_PRICES.FIL,
    APT: TOKEN_PRICES.APT,
    LTC: TOKEN_PRICES.LTC,
    WARR: 0.12,
  };

  return fallbackPrices[symbol] || 1;
};

const tokens: Token[] = [
  { symbol: "USDC", name: "USD Coin", amount: 2847.50, value: 1, icon: "/tokens/usdc.svg", coingeckoId: "usd-coin" },
  { symbol: "ETH", name: "Ethereum", amount: 4.825, value: TOKEN_PRICES.ETH, icon: "/tokens/eth.svg", coingeckoId: "ethereum" },
  { symbol: "USDT", name: "Tether", amount: 1230.00, value: 1, icon: "/tokens/usdt.svg", coingeckoId: "tether" },
  { symbol: "WARR", name: "Warranty Token", amount: 500, value: 0.12, icon: "/tokens/warr.svg", coingeckoId: "" },
];

interface SwapRate {
  from: string;
  to: string;
  rate: number;
}

// Dynamic swap rates based on prices
const getSwapRate = (from: string, to: string, prices: Record<string, { price: number; change24h: number }>): number => {
  const fromValue = getTokenValue(from, prices);
  const toValue = getTokenValue(to, prices);
  return fromValue / toValue;
};

export function SwapComponent() {
  const { prices, loading, refetch } = useTokenPrices();
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [slippage, setSlippage] = useState(0.5);

  // Get dynamic values
  const fromValue = getTokenValue(fromToken.symbol, prices);
  const toValue = getTokenValue(toToken.symbol, prices);

  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const rate = getSwapRate(fromToken.symbol, toToken.symbol, prices);
      const calculated = parseFloat(fromAmount) * rate;
      setToAmount(calculated.toFixed(6).replace(/\.?0+$/, ""));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken, prices]);

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSwap = async () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) return;

    setIsSwapping(true);

    // Simulate swap transaction
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSwapping(false);
    setSwapSuccess(true);
    setTimeout(() => setSwapSuccess(false), 3000);

    // Reset amounts
    setFromAmount("");
    setToAmount("");
  };

  // Dynamic rate calculation
  const currentRate = getSwapRate(fromToken.symbol, toToken.symbol, prices);
  const minReceived = toAmount ? (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6).replace(/\.?0+$/, "") : "0";
  const estimatedFee = fromToken.symbol === "ETH" ? 0.005 * TOKEN_PRICES.ETH : 1; // Dynamic fee

  return (
    <div className="space-y-6">
      {/* From Token */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/50">You pay</span>
          <span className="text-sm text-white/40">
            Balance: {fromToken.amount.toLocaleString()} {fromToken.symbol}
          </span>
        </div>
        
        <div className="flex gap-3">
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-white/30 outline-none"
          />
          
          <div className="relative">
            <button
              onClick={() => setShowFromDropdown(!showFromDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-colors"
            >
              <Image src={fromToken.icon} alt={fromToken.symbol} width={24} height={24} className="h-6 w-6 rounded-full" />
              <span className="font-semibold text-white">{fromToken.symbol}</span>
              <ChevronDown className="h-4 w-4 text-white/50" />
            </button>

            <AnimatePresence>
              {showFromDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-56 glass-card p-2 z-50"
                >
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => {
                        if (token.symbol === toToken.symbol) {
                          handleSwapTokens();
                        } else {
                          setFromToken(token);
                        }
                        setShowFromDropdown(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors",
                        token.symbol === fromToken.symbol && "bg-white/[0.05]"
                      )}
                    >
                      <Image src={token.icon} alt={token.symbol} width={32} height={32} className="h-8 w-8 rounded-full" />
                      <div className="text-left">
                        <p className="font-semibold text-white">{token.symbol}</p>
                        <p className="text-xs text-white/40">{token.name}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {fromAmount && (
          <div className="mt-2 text-sm text-white/40">
            ≈ ${(parseFloat(fromAmount) * fromToken.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )}
      </div>

      {/* Swap Button */}
      <div className="relative flex justify-center -my-2 z-10">
        <button
          onClick={handleSwapTokens}
          className="p-3 rounded-xl bg-[#0a0a0f] border border-white/10 hover:border-violet-500/50 transition-colors group"
        >
          <ArrowDownUp className="h-5 w-5 text-white/50 group-hover:text-violet-400 transition-colors" />
        </button>
      </div>

      {/* To Token */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-white/50">You receive</span>
          <span className="text-sm text-white/40">
            Balance: {toToken.amount.toLocaleString()} {toToken.symbol}
          </span>
        </div>
        
        <div className="flex gap-3">
          <input
            type="number"
            value={toAmount}
            readOnly
            placeholder="0.00"
            className="flex-1 bg-transparent text-2xl font-bold text-white placeholder-white/30 outline-none"
          />
          
          <div className="relative">
            <button
              onClick={() => setShowToDropdown(!showToDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 hover:bg-white/[0.08] transition-colors"
            >
              <Image src={toToken.icon} alt={toToken.symbol} width={24} height={24} className="h-6 w-6 rounded-full" />
              <span className="font-semibold text-white">{toToken.symbol}</span>
              <ChevronDown className="h-4 w-4 text-white/50" />
            </button>

            <AnimatePresence>
              {showToDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-56 glass-card p-2 z-50"
                >
                  {tokens.map((token) => (
                    <button
                      key={token.symbol}
                      onClick={() => {
                        if (token.symbol === fromToken.symbol) {
                          handleSwapTokens();
                        } else {
                          setToToken(token);
                        }
                        setShowToDropdown(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.05] transition-colors",
                        token.symbol === toToken.symbol && "bg-white/[0.05]"
                      )}
                    >
                      <Image src={token.icon} alt={token.symbol} width={32} height={32} className="h-8 w-8 rounded-full" />
                      <div className="text-left">
                        <p className="font-semibold text-white">{token.symbol}</p>
                        <p className="text-xs text-white/40">{token.name}</p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {toAmount && (
          <div className="mt-2 text-sm text-white/40">
            ≈ ${(parseFloat(toAmount) * toToken.value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        )}
      </div>

      {/* Swap Details */}
      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50 flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5" />
            Rate
          </span>
          <span className="text-white font-medium">
            1 {fromToken.symbol} = {currentRate.toFixed(6).replace(/\.?0+$/, "")} {toToken.symbol}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50 flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Slippage Tolerance
          </span>
          <div className="flex items-center gap-1">
            {[0.5, 1, 3].map((value) => (
              <button
                key={value}
                onClick={() => setSlippage(value)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                  slippage === value 
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30" 
                    : "text-white/50 hover:text-white"
                )}
              >
                {value}%
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            Minimum Received
          </span>
          <span className="text-white font-medium">
            {minReceived} {toToken.symbol}
          </span>
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <span className="text-white/50">Network Fee</span>
          <span className="text-white">~${formatPrice(estimatedFee)}</span>
        </div>
      </div>

      {/* Price Header with Live Updates */}
      <div className="flex items-center justify-between text-xs text-white/40">
        <div className="flex items-center gap-2">
          {loading ? (
            <RefreshCw className="h-3 w-3 animate-spin" />
          ) : (
            <>
              <span>ETH: ${formatPrice(TOKEN_PRICES.ETH)}</span>
              <span className="text-green-400">{formatChange(prices.ethereum?.change24h || 1.0)}</span>
            </>
          )}
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-1 hover:text-white/60 transition-colors"
        >
          <RefreshCw className="h-3 w-3" />
          Update
        </button>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!fromAmount || parseFloat(fromAmount) <= 0 || isSwapping}
        className={cn(
          "w-full py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2",
          swapSuccess 
            ? "bg-green-500 shadow-lg shadow-green-500/25" 
            : "btn-primary",
          (!fromAmount || parseFloat(fromAmount) <= 0) && "opacity-50 cursor-not-allowed"
        )}
      >
        {isSwapping ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Swapping...
          </>
        ) : swapSuccess ? (
          <>
            <Check className="h-5 w-5" />
            Swap Successful!
          </>
        ) : (
          <>
            <ArrowDownUp className="h-5 w-5" />
            Swap {fromToken.symbol} to {toToken.symbol}
          </>
        )}
      </button>

      {/* Disclaimer */}
      <p className="text-xs text-white/30 text-center">
        By swapping, you agree to the Terms of Service. Swaps are processed instantly with no additional fees.
      </p>
    </div>
  );
}
