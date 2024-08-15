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
// import getMarketOpenValuesForSymbol from "./getMarketOpenValuesForSymbol"
// import getMarketHighValuesForSymbol from "./getMarketHighValuesForSymbol"
// import getMarketLowValuesForSymbol from "./getMarketLowValuesForSymbol"
// import getMarketCloseValuesForSymbol from "./getMarketCloseValuesForSymbol"
// import calculatePriceForIndex from "../calculate/calculatePriceForIndex"
// import type { Price } from "../types/Price"
// import getPriceSummaries from "./getPriceSummaries"
import getCurrencyRateValuesForSymbol from "./getCurrencyRateValuesForKey"
import getRateSummaries from "./getRateSummaries"
import { Rate } from "../types/Rate"
import calculateRateForIndex from "../calculate/calculateRateForIndex"
// import getStatusForSymbol from "./getStatusForSymbol"

// import type { Price } from "../types/Price"
// import { ONE_DAY } from "../../constants/ONE_DAY"
// import closeTrade from "../close/closeTrade"

export async function controller(db: PriceSimulatorDexie) {
  const timer = await getTimer()
  const rateSummaries = await getRateSummaries()

  const currentIndex = timer?.currentIndex

  if (currentIndex == null) {
    return undefined
  }

  for await (const rateSummary of rateSummaries) {
    const key = rateSummary.key

    if (key != null) {
      const rates = await getCurrencyRateValuesForSymbol(key)

      const currentRate = calculateRateForIndex(currentIndex, rates, rateSummary) as Rate

      if (currentRate != null) {
        await db.currentRates.put(currentRate)
      }
    }
  }

  return db
}

export default function recalculateCurrentRates() {
  return controller(db)
}
