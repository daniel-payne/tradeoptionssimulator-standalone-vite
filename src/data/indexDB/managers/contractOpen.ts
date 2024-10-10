import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import generateID from "@/utilities/generateID"

import { DEFAULT_CONTRACT_COST } from "../constants/DEFAULT_CONTRACT_COST"

import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import { TradeDirection } from "@/data/indexDB/enums/TradeDirection"

import lastIndexOfMonth from "@/utilities/lastIndexOfMonth"

import { TimerOrNothing } from "@/data/indexDB/types/Timer"
import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"

import { controller as closeContract } from "./contractClose"
import priceCalculateFor from "../controllers/priceCalculateFor"

export async function controller(
  db: PriceSimulatorDexie,
  // timer: TimerOrNothing,
  // market: MarketOrNothing,
  // price: PriceOrNothing,

  symbol: string,
  size: string | number,
  direction: TradeDirection
) {
  const timer = await db.timer?.toCollection().first()
  const market = await db.markets.where({ symbol }).first()
  const price = await priceCalculateFor(symbol)

  if (timer == null || market == null || price == null) {
    return
  }

  const checkSize = size.toLocaleString().toUpperCase()

  if (checkSize === "QUARTER") {
    size = 0.5
  } else if (checkSize === "HALF") {
    size = 0.5
  } else if (checkSize === "ONE") {
    size = 1
  } else if (checkSize === "TWO") {
    size = 2
  }

  const count = await db.trades?.count()
  const activeTrades = await db.trades?.where({ symbol, status: TradeStatus.Open }).toArray()

  for (const trade of activeTrades) {
    await closeContract(db, timer, market, price, trade)
  }

  const entryIndex = timer?.currentIndex
  const expiryIndex = lastIndexOfMonth(entryIndex, "WED", 1)

  let entryPrice
  let entryCost

  let priceModifier = +market?.priceModifier ?? 1
  let priceSize = +market?.priceSize ?? 1

  if (!Number.isFinite(priceModifier)) {
    priceModifier = 1
  }

  if (!Number.isFinite(priceSize)) {
    priceSize = 1
  }

  if (size != null) {
    if (price?.isMarketClosed) {
      entryPrice = price?.nextOpen
    } else {
      entryPrice = price?.currentClose
    }

    entryCost = DEFAULT_CONTRACT_COST * size
  } else {
    if (price?.isMarketClosed) {
      entryPrice = direction === TradeDirection.Call ? price?.nextAsk : price?.nextBid
    } else {
      entryPrice = direction === TradeDirection.Call ? price?.currentAsk : price?.currentBid
    }
  }

  if (market != null && entryIndex != null && entryPrice != null) {
    const contractAmount = size * market?.contractSize

    const entryValue = ((entryPrice * priceModifier) / priceSize) * contractAmount

    if (price != null) {
      const newContract = {
        id: generateID(),
        no: count + 1,
        status: TradeStatus.Open,
        symbol,
        direction,
        amount: entryValue,
        size,
        entryValue,
        entryPrice,
        entryCost,
        entryIndex,
        exitPrice: undefined,
        exitValue: undefined,
        exitCost: undefined,
        exitTimestamp: undefined,
        expiryIndex,
        profit: undefined,
      }

      await db.trades?.put(newContract)

      return newContract
    }
  }

  return undefined
}

export default function openContract(
  // timer: TimerOrNothing,
  // market: MarketOrNothing,
  // price: PriceOrNothing,
  symbol: string,
  size: string | number,
  direction: TradeDirection
) {
  return controller(db, symbol, size, direction)
}
