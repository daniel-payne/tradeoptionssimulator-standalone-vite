import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

// import getDataForSymbol from "./getDataForSymbol"

// import calculateIndexForTimestamp from "../calculate/calculateIndexForTimestamp"
// import calculatePriceForIndex from "../calculate/calculatePriceForIndex"

// import Dexie from "dexie"
// import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"

import getTimer from "./getTimer"
// import getMarkets from "./getMarkets"
// import getPriceSummaryForSymbol from "./getPriceSummaryForSymbol"
import getMarketOpenValuesForSymbol from "./getMarketOpenValuesForSymbol"
import getMarketHighValuesForSymbol from "./getMarketHighValuesForSymbol"
import getMarketLowValuesForSymbol from "./getMarketLowValuesForSymbol"
import getMarketCloseValuesForSymbol from "./getMarketCloseValuesForSymbol"
import calculatePriceForIndex from "../calculate/calculatePriceForIndex"
import type { Price } from "../types/Price"
import getPriceSummaries from "./getPriceSummaries"
// import getStatusForSymbol from "./getStatusForSymbol"

// import type { Price } from "../types/Price"
// import { ONE_DAY } from "../../constants/ONE_DAY"
// import closeTrade from "../close/closeTrade"

export async function controller(db: PriceSimulatorDexie) {
  const timer = await getTimer()
  const priceSummaries = await getPriceSummaries()

  const currentIndex = timer?.currentIndex

  if (currentIndex == null) {
    return undefined
  }

  for await (const priceSummary of priceSummaries) {
    const symbol = priceSummary.symbol

    if (symbol != null) {
      const opens = await getMarketOpenValuesForSymbol(symbol)
      const highs = await getMarketHighValuesForSymbol(symbol)
      const lows = await getMarketLowValuesForSymbol(symbol)
      const closes = await getMarketCloseValuesForSymbol(symbol)

      const currentPrice = calculatePriceForIndex(currentIndex, opens, highs, lows, closes, priceSummary) as Price

      if (currentPrice != null) {
        await db.currentPrices.put(currentPrice)
      }
    }
  }

  return db
}

export default function recalculateCurrentPrices() {
  return controller(db)
}
