"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowDownUp, ChevronDown, Loader2, Check, 
  AlertCircle, Info, TrendingUp
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Token {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  icon: string;
  color: string;
}

const tokens: Token[] = [
  { symbol: "USDC", name: "USD Coin", amount: 2847.50, value: 1, icon: "$", color: "from-blue-500 to-cyan-500" },
  { symbol: "ETH", name: "Ethereum", amount: 4.825, value: 2950, icon: "Ξ", color: "from-violet-500 to-purple-500" },
  { symbol: "USDT", name: "Tether", amount: 1230.00, value: 1, icon: "$", color: "from-green-500 to-emerald-500" },
  { symbol: "WARR", name: "Warranty Token", amount: 500, value: 2.5, icon: "W", color: "from-amber-500 to-orange-500" },
];

interface SwapRate {
  from: string;
  to: string;
  rate: number;
}

const swapRates: Record<string, SwapRate> = {
  "USDC-ETH": { from: "USDC", to: "ETH", rate: 0.000338 },
  "ETH-USDC": { from: "ETH", to: "USDC", rate: 2950 },
  "USDT-USDC": { from: "USDT", to: "USDC", rate: 1 },
  "USDC-USDT": { from: "USDC", to: "USDT", rate: 1 },
  "USDC-WARR": { from: "USDC", to: "WARR", rate: 0.4 },
  "WARR-USDC": { from: "WARR", to: "USDC", rate: 2.5 },
};

export function SwapComponent() {
  const [fromToken, setFromToken] = useState<Token>(tokens[0]);
  const [toToken, setToToken] = useState<Token>(tokens[1]);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapSuccess, setSwapSuccess] = useState(false);
  const [slippage, setSlippage] = useState(0.5);

  useEffect(() => {
    if (fromAmount && !isNaN(parseFloat(fromAmount))) {
      const rateKey = `${fromToken.symbol}-${toToken.symbol}`;
      const rate = swapRates[rateKey]?.rate || 1 / (swapRates[`${toToken.symbol}-${fromToken.symbol}`]?.rate || 1);
      const calculated = parseFloat(fromAmount) * rate;
      setToAmount(calculated.toFixed(6).replace(/\.?0+$/, ""));
    } else {
      setToAmount("");
    }
  }, [fromAmount, fromToken, toToken]);

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

  const rateKey = `${fromToken.symbol}-${toToken.symbol}`;
  const currentRate = swapRates[rateKey]?.rate || 1 / (swapRates[`${toToken.symbol}-${fromToken.symbol}`]?.rate || 1);
  const minReceived = toAmount ? (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(6).replace(/\.?0+$/, "") : "0";

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
              <div className={cn("h-6 w-6 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", fromToken.color)}>
                {fromToken.icon}
              </div>
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
                      <div className={cn("h-8 w-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold", token.color)}>
                        {token.icon}
                      </div>
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
              <div className={cn("h-6 w-6 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-sm", toToken.color)}>
                {toToken.icon}
              </div>
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
                      <div className={cn("h-8 w-8 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold", token.color)}>
                        {token.icon}
                      </div>
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
          <span className="text-white">~$2.50</span>
        </div>
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
