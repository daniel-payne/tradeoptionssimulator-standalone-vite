import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import extractPriceForIndex from "../calculate/computePriceForIndex"

export async function controller(db: PriceSimulatorDexie, symbol: string | null | undefined) {
  if (symbol == null) {
    return
  }

  const timer = await db.timer?.limit(1).first()
  const market = await db.markets?.where({ symbol }).first()

  let opens = db.opensCache[symbol]
  let closes = db.closesCache[symbol]
  let highs = db.highsCache[symbol]
  let lows = db.lowsCache[symbol]

  if (opens == null) {
    const stored = await db.opens.where({ symbol }).first()

    db.opensCache[symbol] = stored?.data
    opens = stored?.data
  }

  if (closes == null) {
    const stored = await db.closes.where({ symbol }).first()

    db.closesCache[symbol] = stored?.data
    closes = stored?.data
  }

  if (highs == null) {
    const stored = await db.highs.where({ symbol }).first()

    db.highsCache[symbol] = stored?.data
    highs = stored?.data
  }

  if (lows == null) {
    const stored = await db.lows.where({ symbol }).first()

    db.lowsCache[symbol] = stored?.data
    lows = stored?.data
  }

  if (timer == null || market == null || opens == null || highs == null || lows == null || closes == null) {
    return
  }

  const currentPrice = extractPriceForIndex(timer, market, opens, highs, lows, closes)

  return currentPrice
}

export default function priceCalculateFor(symbol: string | null | undefined) {
  return controller(db, symbol)
}
