//         Call / Buy  @ Ask Price         $>  lowest price a seller/market will accept
// Price
//         Put  / Sell @ Bid / Offer Price <$  highest price a buyer/market will pay

import { OptionDirection } from "../enums/OptionDirection"
import { OptionExecution } from "../enums/OptionExecution"
import { TradeDirection } from "../enums/TradeDirection"
import { PriceOrNothing } from "./Price"
import { Rate } from "./Rate"
import { Volatility } from "./Volatility"

export type Analysis = {
  symbol: string | undefined
  notional: number | undefined
  duration: number | undefined

  currentPrice?: PriceOrNothing
  currentVolatility?: Volatility | null | undefined
  currentRate?: Rate | null | undefined

  matchedDuration?: number | null | undefined
  durationVolatility?: Volatility | null | undefined

  isMarketActive?: boolean | null | undefined
  isMarketClosed?: boolean | null | undefined
  askPrice?: number | null | undefined
  bidPrice?: number | null | undefined
  volatility?: number | null | undefined
  rate?: number | null | undefined

  priceDeltas: Array<{ delta: number; rate?: number; profit?: number | undefined }>

  profit: {
    outcomes: { index: number; delta: number; midRate: number; askRate: number; bidRate: number }[]
  }

  makeCall: {
    direction: TradeDirection
    outcomes: { delta: number; rate: number; percentage?: number | undefined; tradeProfit?: number | undefined }[]
  }

  makePut: {
    direction: TradeDirection
    outcomes: { delta: number; rate: number; percentage?: number | undefined; tradeProfit?: number | undefined }[]
  }

  buyCall: {
    direction: OptionDirection
    execution: OptionExecution
    optionCost?: number | undefined
    tradeOutcomes: Array<{ delta: number; rate: number; percentage?: number | undefined; tradeProfit?: number | undefined }>
    contracts: {
      direction: OptionDirection
      execution: OptionExecution
      delta: number
      spotPrice: number
      strikePrice: number
      calculation?: any
      unitCost?: number | undefined
      contractCost?: number | undefined
      outcomes: {
        delta: number
        rate: number
        percentage?: number
        profit?: number | undefined
        tradeProfit?: number | undefined
        contractCost?: number | undefined
        direction?: OptionDirection
      }[]
    }[]
  }

  sellCall: {
    direction: OptionDirection
    execution: OptionExecution
    optionCost?: number | undefined
    tradeOutcomes: Array<{ delta: number; rate: number; percentage?: number | undefined; tradeProfit?: number | undefined }>
    contracts: {
      direction: OptionDirection
      execution: OptionExecution
      delta: number
      spotPrice: number
      strikePrice: number
      calculation?: any
      unitCost?: number | undefined
      contractCost?: number | undefined
      outcomes: {
        delta: number
        rate: number
        percentage?: number
        profit?: number | undefined
        tradeProfit?: number | undefined
        contractCost?: number | undefined
        direction?: OptionDirection
      }[]
    }[]
  }

  buyPut: {
    direction: OptionDirection
    execution: OptionExecution
    optionCost?: number | undefined
    tradeOutcomes: Array<{ delta: number; rate: number; percentage?: number | undefined; tradeProfit?: number | undefined }>
    contracts: {
      direction: OptionDirection
      execution: OptionExecution
      delta: number
      spotPrice: number
      strikePrice: number
      calculation?: any
      unitCost?: number | undefined
      contractCost?: number | undefined
      outcomes: {
        delta: number
        rate: number
        percentage?: number
        profit?: number | undefined
        tradeProfit?: number | undefined
        contractCost?: number | undefined
        direction?: OptionDirection
      }[]
    }[]
  }

  sellPut: {
    direction: OptionDirection
    execution: OptionExecution
    optionCost?: number | undefined
    tradeOutcomes: Array<{ delta: number; rate: number; percentage?: number | undefined; tradeProfit?: number | undefined }>
    contracts: {
      direction: OptionDirection
      execution: OptionExecution
      delta: number
      spotPrice: number
      strikePrice: number
      calculation?: any
      unitCost?: number | undefined
      contractCost?: number | undefined
      outcomes: {
        delta: number
        rate: number
        percentage?: number
        profit?: number | undefined
        tradeProfit?: number | undefined
        contractCost?: number | undefined
        direction?: OptionDirection
      }[]
    }[]
  }

  // [index: string]: any
}
