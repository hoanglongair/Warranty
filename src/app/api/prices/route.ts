import { NextResponse } from "next/server";
import { COINGECKO_API } from "@/config/tokens";

// Cache token prices for 60 seconds to avoid hitting CoinGecko rate limits
const priceCache: {
  data: Record<string, { price: number; change24h: number }> | null;
  timestamp: number;
} = {
  data: null,
  timestamp: 0,
};

const CACHE_TTL_MS = 60_000; // 60 seconds

const COINGECKO_IDS = "bitcoin,ethereum,usd-coin,tether,binancecoin,ripple,solana,tron,dogecoin,cardano,chainlink,avalanche-2,polkadot,uniswap,litecoin,cosmos,filecoin,aptos,arbitrum,near";

export async function GET() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (priceCache.data && now - priceCache.timestamp < CACHE_TTL_MS) {
    return NextResponse.json({
      success: true,
      data: priceCache.data,
      timestamp: priceCache.timestamp,
      cached: true,
    });
  }

  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${COINGECKO_IDS}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Warranty/1.0",
        },
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const prices: Record<string, { price: number; change24h: number }> = {};

    for (const [id, info] of Object.entries(data)) {
      const coinInfo = info as { usd?: number; usd_24h_change?: number };
      // Bỏ qua entry không có giá hợp lệ (vd khi CoinGecko trả object lỗi)
      if (typeof coinInfo?.usd !== "number" || !Number.isFinite(coinInfo.usd)) continue;
      prices[id] = {
        price: coinInfo.usd,
        change24h: typeof coinInfo.usd_24h_change === "number" ? coinInfo.usd_24h_change : 0,
      };
    }

    if (Object.keys(prices).length === 0) {
      throw new Error("CoinGecko trả về dữ liệu giá rỗng/không hợp lệ");
    }

    // Update cache
    priceCache.data = prices;
    priceCache.timestamp = now;

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: now,
      cached: false,
    });
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    
    // Return cached data if available (even if stale)
    if (priceCache.data) {
      return NextResponse.json({
        success: true,
        data: priceCache.data,
        timestamp: priceCache.timestamp,
        cached: true,
        stale: true,
        error: "Using stale cache due to API error",
      });
    }
    
    return NextResponse.json(
      { success: false, error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
