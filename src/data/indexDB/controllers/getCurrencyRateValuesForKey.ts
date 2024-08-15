import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

const CACHE: Record<string, any> = {}

export async function controller(db: PriceSimulatorDexie, key: string) {
  if (CACHE[key] != null) {
    return CACHE[key]
  }

  const marketOpens = await db.currencyRates.get(key)

  CACHE[key] = marketOpens?.data

  return marketOpens?.data
}

export default function getCurrencyRateValuesForSymbol(key: string) {
  return controller(db, key)
}
