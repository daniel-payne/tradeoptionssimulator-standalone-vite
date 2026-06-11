import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { DEFAULT_CONTRACT_COST } from "@/data/indexDB/constants/DEFAULT_CONTRACT_COST"
import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import generateID from "@/utilities/generateID"

import priceCalculateFor from "./priceCalculateFor"

export async function controller(db: PriceSimulatorDexie, id: string) {
  const timer = await db.timer?.toCollection().first()

  const trade = await db.trades?.where({ id }).first()

  const { symbol = "MISSING" } = trade || {}

  const market = await db.markets?.where({ symbol }).first()

  const price = await priceCalculateFor(symbol)

  if (trade == null || timer == null || market == null || price == null) {
    return
  }

  const currentIndex = timer?.currentIndex

  if (trade != null && market != null && currentIndex != null) {
    let exitPrice
    let exitCost

    let exitIndex

    if (price?.isMarketClosed) {
      exitIndex = price?.nextIndex
    } else {
      exitIndex = price?.currentIndex
    }

    if (trade.size != null) {
      if (price?.isMarketClosed) {
        exitPrice = price?.nextOpen
      } else {
        exitPrice = price?.currentClose
      }

      exitCost = DEFAULT_CONTRACT_COST
    } else {
      if (price?.isMarketClosed) {
        exitPrice = trade.direction === "CALL" ? price?.nextOpeningBid : price?.nextOpeningAsk
      } else {
        exitPrice = trade.direction === "CALL" ? price?.currentBid : price?.currentAsk
      }
    }

    if (exitPrice != null && exitIndex != null) {
      if (price != null) {
        const newContract = structuredClone(trade)

        newContract.status = TradeStatus.Closed

        newContract.exitPrice = exitPrice
        newContract.exitCost = exitCost
        newContract.exitIndex = exitIndex

        if (newContract.entryPrice != null && newContract.entryValue != null) {
          newContract.exitDifference = newContract.exitPrice - newContract.entryPrice
          newContract.exitPercent = newContract.exitDifference / newContract.entryPrice

          const dollarDifference = newContract.exitPercent * newContract.entryValue

          newContract.profit = newContract.direction === "CALL" ? dollarDifference : dollarDifference * -1

          newContract.exitValue = newContract.entryValue + dollarDifference

          await db.trades?.put(newContract)

          await db.transactions?.add({
            id: generateID(),
            index: exitIndex,
            source: "TRADE",
            value: newContract.profit,
          })

          return newContract
        }
      }
    }
  }

  return undefined
}

export default function tradeClose(id: string) {
  return controller(db, id)
}
