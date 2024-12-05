import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TradeStatus } from "../enums/TradeStatus"
import { Margin } from "../types/Margin"
import priceCalculateFor from "./priceCalculateFor"
import computeMarginFor from "../calculate/computeMarginFor"
import { INITIAL_MARGIN_REQUIREMENT } from "../constants/INITIAL_MARGIN_REQUIREMENT"

export async function controller(db: PriceSimulatorDexie) {
  const transactions = await db.transactions?.toArray()
  const activeTrades = await db.trades?.where({ status: TradeStatus.Open }).toArray()

  const variationMargins = [] as Array<Margin>

  for (const trade of activeTrades ?? []) {
    const symbol = trade.symbol

    const market = await db.markets.where({ symbol }).first()

    const price = await priceCalculateFor(symbol)

    if (market != null && price != null) {
      const margin = computeMarginFor(trade, market, price)

      if (margin != null) {
        variationMargins.push(margin)
      }
    }
  }

  const userBalance =
    transactions?.reduce((acc, transaction) => {
      const add = transaction.source === "USER" ? transaction.value : 0

      return acc + add
    }, 0) ?? 0

  const transactionBalance =
    transactions?.reduce((acc, transaction) => {
      const add = transaction.source === "TRADE" ? transaction.value : 0

      return acc + add
    }, 0) ?? 0

  const initialBalance =
    activeTrades?.reduce((acc, trade) => {
      const add = trade.amount * INITIAL_MARGIN_REQUIREMENT * -1

      return acc + add
    }, 0) ?? 0

  const variationBalance =
    variationMargins?.reduce((acc, margin) => {
      const add = margin.currentProfit

      return acc + add
    }, 0) ?? 0

  const availableBalance = userBalance + transactionBalance + initialBalance + variationBalance

  return { userBalance, transactionBalance, initialBalance, variationBalance, availableBalance }
}

export default function balanceCalculate() {
  return controller(db)
}
