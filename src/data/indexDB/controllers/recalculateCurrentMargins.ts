import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TradeStatus } from "../enums/TradeStatus"
import closeTrade from "./closeTrade"
import Dexie from "dexie"

import getMarketForSymbol from "./getMarketForSymbol"

export async function controller(db: PriceSimulatorDexie) {
  const activeTrades = await db.trades?.where({ status: TradeStatus.Open }).toArray()

  const timer = await db.timer.limit(1).first()

  await db.currentMargins.clear()

  for await (const activeTrade of activeTrades) {
    const symbol = activeTrade.symbol
    const price = await db.currentPrices.get(symbol)

    const market = await getMarketForSymbol(symbol)

    const currentIndex = timer?.currentIndex

    const { id, amount, direction, entryPrice, entryValue, expiryIndex, stopLoss, takeProfit } = activeTrade ?? {}

    let priceModifier = market?.priceModifier ?? 1
    let priceSize = market?.priceSize ?? 1

    if (!Number.isFinite(priceModifier)) {
      priceModifier = 1
    }

    if (!Number.isFinite(priceSize)) {
      priceSize = 1
    }

    if (currentIndex != null && price != null && entryPrice != null && entryValue != null && expiryIndex != null) {
      const currentPrice = direction === "CALL" ? price.priorClosingAsk : price.priorClosingBid

      const currentDifference = direction === "CALL" ? currentPrice - entryPrice : entryPrice - currentPrice

      const currentPercent = currentDifference / entryPrice

      const currentValue = ((currentPrice * priceModifier) / priceSize) * amount

      const currentProfit = direction === "CALL" ? currentValue - entryValue : entryValue - currentValue

      const durationLeft = Math.floor(expiryIndex - currentIndex)

      const newMargin = {
        id: id,
        symbol,
        status: TradeStatus.Open,
        stopLoss,
        takeProfit,
        currentIndex,
        currentPrice,
        currentDifference,
        currentPercent,
        currentValue,
        currentProfit,
        durationLeft,
      }

      await db.currentMargins.put(newMargin).catch(Dexie.BulkError, function (e) {
        console.error("getPriceForSymbolAndTimestamp Pricing Error: " + e.failures.length)
      })

      if (durationLeft <= 1) {
        await closeTrade(activeTrade.id)
      }
    }
  }
}

export default function recalculateCurrentMargins() {
  return controller(db)
}
