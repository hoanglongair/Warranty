import { NextResponse } from "next/server";
import { COINGECKO_API } from "@/config/tokens";

export const runtime = "edge";

const COINGECKO_IDS = "bitcoin,ethereum,usd-coin,tether,binancecoin,ripple,solana,tron,dogecoin,cardano,chainlink,avalanche-2,polkadot,uniswap,litecoin,cosmos,filecoin,aptos,arbitrum,near";

export async function GET() {
  try {
    const response = await fetch(
      `${COINGECKO_API}/simple/price?ids=${COINGECKO_IDS}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent": "Warranty/1.0",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const prices: Record<string, { price: number; change24h: number }> = {};

    for (const [id, info] of Object.entries(data)) {
      const coinInfo = info as { usd: number; usd_24h_change?: number };
      prices[id] = {
        price: coinInfo.usd,
        change24h: coinInfo.usd_24h_change ?? 0,
      };
    }

    return NextResponse.json({
      success: true,
      data: prices,
      timestamp: Date.now(),
    });
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
