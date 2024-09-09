import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import calculateOptionCosts from "../calculate/calculateOptionCosts"

import { OptionExecution } from "../enums/OptionExecution"
import { OptionDirection } from "../enums/OptionDirection"

const MIN_CONTRACT_COST = 250
const CONTRACT_MARKUP = 0.06

export async function controller(
  db: PriceSimulatorDexie,
  symbol: string,
  key: string,
  notional: number,
  direction: OptionDirection,
  execution: OptionExecution,
  delta: number,
  duration: number
) {
  const currentPrice = await db.currentPrices.get(symbol)
  const currentVolatility = await db.currentVolatilities.get(symbol)
  const currentRate = await db.currentRates.get(key)

  if (currentPrice == null || currentVolatility == null || currentRate == null) {
    return
  }

  const matchDuration =
    [30, 60, 90].reduce((acc: any, curr) => {
      if (duration >= curr && acc != null) {
        return curr
      }
    }, null) ?? 90

  const durationVolatility = currentVolatility[matchDuration]

  const volatility = durationVolatility?.volatility
  const rate = currentRate.currentRate

  // const calculation = await calculateOptionCosts(
  //   notional,
  //   spotPrice,
  //   strikePrice,
  //   matchDuration,
  //   execution,

  //   volatility,
  //   rate
  // )

  // const durationVolatility = currentVolatility[matchDuration]

  // if (durationVolatility == null) {
  //   return
  // }

  // const isMarketActive = currentPrice?.isMarketActive
  // const isMarketClosed = currentPrice?.isMarketClosed
  // const priorClose = currentPrice?.priorClose
  // const askPrice = currentPrice?.currentAsk
  // const bidPrice = currentPrice?.currentBid
  // const volatility = durationVolatility.volatility
  // const rate = currentRate.currentRate

  // if (isMarketActive === false || isMarketClosed === true || askPrice == null || bidPrice == null || priorClose == null || rate == null) {
  //   return
  // }

  // const spotPrice = direction === OptionDirection.BuyCall || OptionDirection.SellCall ? askPrice : bidPrice

  // const midPrice = (askPrice + bidPrice) / 2

  // let deltaFactor = 1 / 10000

  // if (midPrice < 10) {
  //   deltaFactor = 1 / 10000
  // } else if (midPrice < 100) {
  //   deltaFactor = 1 / 1000
  // } else if (midPrice < 1000) {
  //   deltaFactor = 1 / 100
  // }

  // const strikePrice = spotPrice + deltaFactor * delta

  // const calculation = await calculateOptionCosts(notional, spotPrice, strikePrice, duration, execution, volatility, rate)

  // const markup = OptionDirection.BuyCall || OptionDirection.BuyCall ? 1 + CONTRACT_MARKUP : 1 - CONTRACT_MARKUP

  // const unitCost = OptionDirection.BuyCall || OptionDirection.SellCall ? calculation.option.call.price : calculation.option.put.price

  // const contractCost = (notional / spotPrice) * unitCost * markup

  // return contractCost > MIN_CONTRACT_COST ? contractCost : undefined
}

export default function discoverOptionPrice(
  symbol: string,
  key: string,
  notional: number,
  optionDirection: OptionDirection,
  optionExecution: OptionExecution,
  strikeDelta: number,
  duration: number
) {
  return controller(db, symbol, key, notional, optionDirection, optionExecution, strikeDelta, duration)
}
