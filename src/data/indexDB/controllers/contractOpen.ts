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

import { controller as tradeClose } from "./tradeClose"

import priceCalculateFor from "./priceCalculateFor"
import { Trade } from "../types/Trade"
import useBalance from "../hooks/useBalance"
import balanceCalculate from "./balanceCalculate"
import { INITIAL_MARGIN_REQUIREMENT } from "../constants/INITIAL_MARGIN_REQUIREMENT"
import formatValue from "@/utilities/formatValue"
import computeContractValueFor from "../calculate/computeContractValueFor"

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

  const { availableBalance } = await balanceCalculate()

  if (timer == null || market == null || price == null) {
    return
  }

  const checkSize = size.toLocaleString().toUpperCase()

  let sizeValue = 1

  if (checkSize === "QUARTER") {
    sizeValue = 0.25
  } else if (checkSize === "HALF") {
    sizeValue = 0.5
  } else if (checkSize === "ONE") {
    sizeValue = 1
  } else if (checkSize === "TWO") {
    sizeValue = 2
  }

  const contractValue = computeContractValueFor(market, price) ?? 1

  if (contractValue * INITIAL_MARGIN_REQUIREMENT > availableBalance) {
    throw new Error(`Insufficient funds, you need to have ${formatValue(contractValue * INITIAL_MARGIN_REQUIREMENT)} to complete this trade`)
  }

  const count = await db.trades?.count()
  const activeTrades = await db.trades?.where({ symbol, status: TradeStatus.Open }).toArray()

  for (const trade of activeTrades) {
    await tradeClose(db, trade.id)
  }

  const entryIndex = timer?.currentIndex
  const expiryIndex = lastIndexOfMonth(entryIndex, "WED", 1)

  let entryPrice
  let entryCost

  let priceModifier = +(market?.priceModifier ?? 1)
  let priceSize = +(market?.priceSize ?? 1)

  if (!Number.isFinite(priceModifier)) {
    priceModifier = 1
  }

  if (!Number.isFinite(priceSize)) {
    priceSize = 1
  }

  if (sizeValue === 1) {
    if (price?.isMarketClosed) {
      entryPrice = price?.nextOpen
    } else {
      entryPrice = price?.currentClose
    }

    entryCost = DEFAULT_CONTRACT_COST * +sizeValue
  } else {
    if (price?.isMarketClosed) {
      entryPrice = direction === TradeDirection.Call ? price?.nextAsk : price?.nextBid
    } else {
      entryPrice = direction === TradeDirection.Call ? price?.currentAsk : price?.currentBid
    }
  }

  if (market != null && entryIndex != null && entryPrice != null) {
    const contractAmount = +sizeValue * market?.contractSize

    const entryValue = ((entryPrice * priceModifier) / priceSize) * contractAmount

    if (price != null) {
      const newContract = {
        id: generateID(),
        no: count + 1,
        status: TradeStatus.Open,
        symbol,
        direction,
        amount: entryValue,
        size: sizeValue,
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
      } as Trade

      await db.trades?.put(newContract)

      return newContract
    }
  }

  return undefined
}

export default function openContract(symbol: string, size: string | number, direction: TradeDirection) {
  return controller(db, symbol, size, direction)
}
