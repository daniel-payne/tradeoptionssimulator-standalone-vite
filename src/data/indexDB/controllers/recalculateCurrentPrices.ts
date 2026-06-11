import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import getTimer from "./getTimer"

import getMarketOpenValuesForSymbol from "./getMarketOpenValuesForSymbol"
import getMarketHighValuesForSymbol from "./getMarketHighValuesForSymbol"
import getMarketLowValuesForSymbol from "./getMarketLowValuesForSymbol"
import getMarketCloseValuesForSymbol from "./getMarketCloseValuesForSymbol"
import extractPriceForIndex from "../calculate/extractPriceForIndex"
import type { Price } from "../types/Price"
import getPriceSummaries from "./getPriceSummaries"

export async function controller(db: PriceSimulatorDexie) {
  const timer = await getTimer()
  const priceSummaries = await getPriceSummaries()

  const currentIndex = timer?.currentIndex

  if (currentIndex == null) {
    return undefined
  }

  const activeSymbols = timer?.activeSymbols
  const targetSummaries =
    activeSymbols && activeSymbols.length > 0
      ? priceSummaries.filter((s) => s.symbol != null && activeSymbols.includes(s.symbol))
      : priceSummaries

  await db.currentPrices.clear()

  await Promise.all(
    targetSummaries.map(async (priceSummary) => {
      const symbol = priceSummary.symbol

      if (symbol != null) {
        const opens = await getMarketOpenValuesForSymbol(symbol)
        const highs = await getMarketHighValuesForSymbol(symbol)
        const lows = await getMarketLowValuesForSymbol(symbol)
        const closes = await getMarketCloseValuesForSymbol(symbol)

        const currentPrice = extractPriceForIndex(currentIndex, opens, highs, lows, closes, priceSummary) as Price

        if (currentPrice != null) {
          await db.currentPrices.put(currentPrice)
        }
      }
    })
  )

  return db
}

export default function recalculateCurrentPrices() {
  return controller(db)
}
