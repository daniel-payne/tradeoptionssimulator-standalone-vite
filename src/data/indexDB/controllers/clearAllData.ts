import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie) {
  await db.timer.clear()

  await db.scenarios.clear()
  await db.markets.clear()
  await db.currencies.clear()

  await db.trades.clear()
  await db.transactions.clear()

  await db.opens.clear()
  await db.highs.clear()
  await db.lows.clear()
  await db.closes.clear()

  await db.rates.clear()

  db.opensCache = {}
  db.highsCache = {}
  db.lowsCache = {}
  db.closesCache = {}
  db.ratesCache = {}

  return
}

export default function clearAllData() {
  return controller(db)
}
