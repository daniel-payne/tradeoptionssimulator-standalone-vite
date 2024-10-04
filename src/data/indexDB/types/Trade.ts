import { TradeDirection } from "../enums/TradeDirection"
import { TradeStatus } from "../enums/TradeStatus"

export type Trade = {
  id: string
  no: number

  status: TradeStatus
  symbol: string
  size?: number
  amount: number
  direction: TradeDirection
  expiryIndex?: number

  entryValue?: number
  entryPrice?: number
  entryCost?: number
  entryIndex?: number

  exitPrice?: number
  exitCost?: number
  exitIndex?: number

  exitDifference?: number
  exitPercent?: number
  profit?: number

  [index: string]: any
}

export type TradeOrNothing = Trade | null | undefined
