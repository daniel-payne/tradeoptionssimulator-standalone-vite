import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import type { Analysis } from "@/data/indexDB/types/Analysis"
import { TradeDirection } from "../enums/TradeDirection"
import { OptionDirection } from "../enums/OptionDirection"
import { OptionExecution } from "../enums/OptionExecution"

import calculateOptionCosts from "../calculate/calculateOptionCosts"

const MIN_CONTRACT_COST = 250
const CONTRACT_MARKUP = 0.075

const DEFAULT_DELTA_POINTS = [500, 250, 100, 50, 25, 10, 5, 0, -5, -10, -25, -50, -100, -250, -500]

const EMPTY_ANALYSIS = {
  profit: {},
  makeCall: { direction: TradeDirection.Call },
  makePut: { direction: TradeDirection.Put },
  buyCall: { direction: OptionDirection.BuyCall, execution: OptionExecution.European },
  sellCall: { direction: OptionDirection.SellCall, execution: OptionExecution.European },
  buyPut: { direction: OptionDirection.BuyPut, execution: OptionExecution.European },
  sellPut: { direction: OptionDirection.SellPut, execution: OptionExecution.European },
} as unknown as Analysis

export async function controller(db: PriceSimulatorDexie, symbol: string, notional: number, key: string = "USD", duration: number = 30) {
  const analysis = structuredClone(EMPTY_ANALYSIS)

  analysis.symbol = symbol
  analysis.notional = notional

  const currentPrice = await db.currentPrices.get(symbol)
  const currentVolatility = await db.currentVolatilities.get(symbol)
  const currentRate = await db.currentRates.get(key)

  analysis.currentPrice = currentPrice
  analysis.currentVolatility = currentVolatility as any
  analysis.currentRate = currentRate

  if (currentPrice == null || currentVolatility == null || currentRate == null) {
    return analysis
  }

  const matchDuration =
    [30, 60, 90].reduce((acc: any, curr) => {
      if (duration >= curr && acc != null) {
        return curr
      }
    }, null) ?? 90

  const durationVolatility = currentVolatility[matchDuration]

  analysis.durationVolatility = durationVolatility

  if (durationVolatility == null) {
    return analysis
  }

  const isMarketActive = currentPrice?.isMarketActive
  const isMarketClosed = currentPrice?.isMarketClosed
  const priorClose = currentPrice?.priorClose
  const askPrice = currentPrice?.currentAsk
  const bidPrice = currentPrice?.currentBid
  const volatility = durationVolatility.volatility
  const rate = currentRate.currentRate

  analysis.isMarketActive = isMarketActive
  analysis.isMarketClosed = isMarketClosed
  analysis.askPrice = askPrice
  analysis.bidPrice = bidPrice
  analysis.volatility = volatility
  analysis.rate = rate

  let midPrice = priorClose ?? 0

  if (askPrice != null && bidPrice != null) {
    midPrice = (askPrice + bidPrice) / 2
  }

  let deltaFactor = 1 / 10000

  if (midPrice < 10) {
    deltaFactor = 1 / 10000
  } else if (midPrice < 100) {
    deltaFactor = 1 / 1000
  } else if (midPrice < 1000) {
    deltaFactor = 1 / 100
  } else if (midPrice < 10000) {
    deltaFactor = 1 / 10
  } else {
    deltaFactor = 1
  }

  analysis.profit = { outcomes: [] }

  analysis.makeCall = { direction: TradeDirection.Call, outcomes: [] }
  analysis.makePut = { direction: TradeDirection.Put, outcomes: [] }

  analysis.buyCall = { direction: OptionDirection.BuyCall, execution: OptionExecution.European, tradeOutcomes: [], contracts: [] }
  analysis.sellCall = { direction: OptionDirection.SellCall, execution: OptionExecution.European, tradeOutcomes: [], contracts: [] }
  analysis.buyPut = { direction: OptionDirection.BuyPut, execution: OptionExecution.European, tradeOutcomes: [], contracts: [] }
  analysis.sellPut = { direction: OptionDirection.SellPut, execution: OptionExecution.European, tradeOutcomes: [], contracts: [] }

  if (askPrice == null || bidPrice == null || volatility == null || rate == null) {
    return analysis
  }

  DEFAULT_DELTA_POINTS.forEach((delta, index) => {
    const askRate = askPrice + deltaFactor * delta
    const bidRate = bidPrice + deltaFactor * delta

    const midRate = (askRate + bidRate) / 2

    analysis.profit.outcomes.push({ delta, index, askRate, bidRate, midRate })

    analysis.makeCall.outcomes.push({ delta, rate: askRate })
    analysis.makePut.outcomes.push({ delta, rate: bidRate })

    analysis.buyCall.tradeOutcomes.push({ delta, rate: askRate })
    analysis.sellCall.tradeOutcomes.push({ delta, rate: askRate })
    analysis.buyPut.tradeOutcomes.push({ delta, rate: bidRate })
    analysis.sellPut.tradeOutcomes.push({ delta, rate: bidRate })

    analysis.buyCall.contracts.push({
      delta,
      direction: OptionDirection.BuyCall,
      execution: OptionExecution.European,
      spotPrice: askPrice,
      strikePrice: askRate,
      outcomes: [],
    })
    analysis.sellCall.contracts.push({
      delta,
      direction: OptionDirection.SellCall,
      execution: OptionExecution.European,
      spotPrice: askPrice,
      strikePrice: askRate,
      outcomes: [],
    })
    analysis.buyPut.contracts.push({
      direction: OptionDirection.BuyPut,
      execution: OptionExecution.European,
      delta,
      spotPrice: bidPrice,
      strikePrice: bidRate,
      outcomes: [],
    })
    analysis.sellPut.contracts.push({
      direction: OptionDirection.SellPut,
      execution: OptionExecution.European,
      delta,
      spotPrice: bidPrice,
      strikePrice: bidRate,
      outcomes: [],
    })
  })

  DEFAULT_DELTA_POINTS.forEach((delta) => {
    const askRate = askPrice + deltaFactor * delta
    const bidRate = bidPrice + deltaFactor * delta

    analysis.buyCall.contracts.forEach((contract) => {
      contract.outcomes.push({ delta, rate: askRate })
    })
    analysis.sellCall.contracts.forEach((contract) => {
      contract.outcomes.push({ delta, rate: askRate })
    })
    analysis.buyPut.contracts.forEach((contract) => {
      contract.outcomes.push({ delta, rate: bidRate })
    })
    analysis.sellPut.contracts.forEach((contract) => {
      contract.outcomes.push({ delta, rate: bidRate })
    })
  })

  analysis.makeCall.outcomes.forEach((outcome) => {
    const rate = outcome.rate

    const percentage = (rate - askPrice) / askPrice
    const tradeProfit = percentage * notional

    outcome.percentage = percentage
    outcome.tradeProfit = tradeProfit
  })

  analysis.makePut.outcomes.forEach((outcome) => {
    const rate = outcome.rate

    const percentage = (bidPrice - rate) / bidPrice
    const tradeProfit = percentage * notional

    outcome.percentage = percentage
    outcome.tradeProfit = tradeProfit
  })

  analysis.buyCall.contracts.forEach(async (contract) => {
    const calculation = await calculateOptionCosts(
      notional,
      contract.spotPrice,
      contract.strikePrice,
      matchDuration,
      contract.execution,

      volatility,
      rate
    )

    const unitCost = calculation.option.call.price * (1 + CONTRACT_MARKUP)
    const contractCost = (notional / contract.strikePrice) * unitCost

    contract.calculation = calculation
    contract.unitCost = unitCost

    if (contractCost > MIN_CONTRACT_COST) {
      contract.contractCost = contractCost

      contract.outcomes.forEach((outcome) => {
        const outcomeRate = outcome.rate

        const percentage = (outcomeRate - contract.strikePrice) / contract.strikePrice
        const tradeProfit = percentage * notional

        outcome.percentage = percentage
        outcome.tradeProfit = tradeProfit
        outcome.contractCost = contractCost

        const profit = tradeProfit - contractCost

        outcome.profit = profit < contractCost * -1 ? contractCost * -1 : profit
      })
    }
  })

  analysis.sellCall.contracts.forEach(async (contract) => {
    const calculation = await calculateOptionCosts(
      notional,
      contract.spotPrice,
      contract.strikePrice,
      matchDuration,
      contract.execution,

      volatility,
      rate
    )

    const unitCost = calculation.option.call.price * (1 - CONTRACT_MARKUP)
    const contractCost = (notional / contract.strikePrice) * unitCost

    contract.calculation = calculation
    contract.unitCost = unitCost

    if (contractCost > MIN_CONTRACT_COST) {
      contract.contractCost = contractCost

      contract.outcomes.forEach((outcome) => {
        const outcomeRate = outcome.rate

        const percentage = (contract.strikePrice - outcomeRate) / contract.strikePrice
        const tradeProfit = percentage * notional

        outcome.percentage = percentage
        outcome.tradeProfit = tradeProfit
        outcome.contractCost = contractCost

        const profit = tradeProfit < 0 ? tradeProfit + contractCost : contractCost

        outcome.profit = profit
      })
    }
  })

  analysis.buyPut.contracts.forEach(async (contract) => {
    const calculation = await calculateOptionCosts(
      notional,
      contract.spotPrice,
      contract.strikePrice,
      matchDuration,
      contract.execution,

      volatility,
      rate
    )

    const unitCost = calculation.option.put.price * (1 + CONTRACT_MARKUP)
    const contractCost = (notional / contract.strikePrice) * unitCost

    contract.calculation = calculation
    contract.unitCost = unitCost

    if (contractCost > MIN_CONTRACT_COST) {
      contract.contractCost = contractCost

      contract.outcomes.forEach((outcome) => {
        const outcomeRate = outcome.rate

        const percentage = (contract.strikePrice - outcomeRate) / contract.strikePrice
        const tradeProfit = percentage * notional

        outcome.percentage = percentage
        outcome.tradeProfit = tradeProfit
        outcome.contractCost = contractCost

        const profit = tradeProfit - contractCost

        outcome.profit = profit < contractCost * -1 ? contractCost * -1 : profit
      })
    }
  })

  analysis.sellPut.contracts.forEach(async (contract) => {
    const calculation = await calculateOptionCosts(
      notional,
      contract.spotPrice,
      contract.strikePrice,
      matchDuration,
      contract.execution,

      volatility,
      rate
    )

    const unitCost = calculation.option.put.price * (1 - CONTRACT_MARKUP)
    const contractCost = (notional / contract.strikePrice) * unitCost

    contract.calculation = calculation
    contract.unitCost = unitCost

    if (contractCost > MIN_CONTRACT_COST) {
      contract.contractCost = contractCost

      contract.outcomes.forEach((outcome) => {
        const outcomeRate = outcome.rate

        const percentage = (outcomeRate - contract.strikePrice) / contract.strikePrice
        const tradeProfit = percentage * notional

        outcome.percentage = percentage
        outcome.tradeProfit = tradeProfit
        outcome.contractCost = contractCost

        const profit = tradeProfit < 0 ? tradeProfit + contractCost : contractCost

        outcome.profit = profit
      })
    }
  })

  return analysis
}

export default function generateAnalysis(symbol: string, notional: number) {
  return controller(db, symbol, notional)
}
