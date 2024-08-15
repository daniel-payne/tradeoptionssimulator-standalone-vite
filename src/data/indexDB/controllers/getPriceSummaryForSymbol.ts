import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  if (CACHE[symbol] != null) {
    return CACHE[symbol]
  }

  const priceSummary = await db.priceSummaries.get(symbol)

  CACHE[symbol] = priceSummary

  return priceSummary
}

export default function getPriceSummaryForSymbol(symbol: string) {
  return controller(db, symbol)
}
