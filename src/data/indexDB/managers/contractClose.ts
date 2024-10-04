import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { DEFAULT_CONTRACT_COST } from "@/data/indexDB/constants/DEFAULT_CONTRACT_COST"
import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import generateID from "@/utilities/generateID"

import { TimerOrNothing } from "../types/Timer"
import { TradeOrNothing } from "../types/Trade"
import { MarketOrNothing } from "../types/Market"
import { PriceOrNothing } from "../types/Price"

export async function controller(db: PriceSimulatorDexie, timer: TimerOrNothing, market: MarketOrNothing, price: PriceOrNothing, trade: TradeOrNothing) {
  if (trade == null || timer == null || market == null || price == null) {
    return
  }

  const currentIndex = timer?.currentIndex

  if (trade != null && market != null && currentIndex != null) {
    let exitPrice
    let exitCost

    if (trade.size === 1) {
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

    if (exitPrice != null) {
      if (price != null) {
        const newContract = structuredClone(trade)

        newContract.status = TradeStatus.Closed

        newContract.exitPrice = exitPrice
        newContract.exitCost = exitCost
        newContract.exitIndex = currentIndex

        if (newContract.entryPrice != null && newContract.entryValue != null) {
          newContract.exitDifference = newContract.exitPrice - newContract.entryPrice
          newContract.exitPercent = newContract.exitDifference / newContract.entryPrice

          const dollarDifference = newContract.exitPercent * newContract.entryValue

          newContract.profit = newContract.direction === "CALL" ? dollarDifference : dollarDifference * -1

          await db.trades?.put(newContract)

          await db.transactions?.add({
            id: generateID(),
            index: currentIndex,
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

export default function closeContract(timer: TimerOrNothing, market: MarketOrNothing, price: PriceOrNothing, trade: TradeOrNothing) {
  return controller(db, timer, market, price, trade)
}
