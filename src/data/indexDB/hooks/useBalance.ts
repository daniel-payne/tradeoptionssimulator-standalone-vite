import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"
import { TradeStatus } from "../enums/TradeStatus"

export default function useBalance(): Record<string, number> | undefined {
  // const balances = useLiveQuery(async () => {
  //   const transactions = await db.transactions?.toArray()
  //   const margins = await db.currentMargins?.where({ status: TradeStatus.Open }).toArray()

  //   const transactionBalance = transactions.reduce((acc, transaction) => {
  //     return acc + transaction.value
  //   }, 0)

  //   const marginBalance = margins.reduce((acc, margin) => {
  //     return acc + margin.currentProfit
  //   }, 0)

  //   const availableBalance = (transactionBalance ?? 0) + (marginBalance ?? 0)

  //   return { transactionBalance, marginBalance, availableBalance }
  // })

  return // balances
}
