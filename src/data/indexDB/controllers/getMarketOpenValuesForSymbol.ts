import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  if (CACHE[symbol] != null) {
    return CACHE[symbol]
  }

  const marketOpens = await db.marketOpens.get(symbol)

  CACHE[symbol] = marketOpens?.data

  return marketOpens?.data
}

export default function getMarketOpenValuesForSymbol(symbol: string) {
  return controller(db, symbol)
}
