import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  if (CACHE[symbol] != null) {
    return CACHE[symbol]
  }

  const marketCloses = await db.marketCloses.get(symbol)

  CACHE[symbol] = marketCloses?.data

  return marketCloses?.data
}

export default function getMarketOpenValuesForSymbol(symbol: string) {
  return controller(db, symbol)
}
