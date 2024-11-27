import compareObjectsByDescending from "@/utilities/compareObjectsByDescending"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"
import { TradeStatus } from "../enums/TradeStatus"

export default function useInactiveTrades(limit = 999) {
  const data = useLiveQuery(async () => {
    return await db.trades?.toArray()
  })

  const filteredTrades = data?.filter((trade) => trade.status != TradeStatus.Open)

  const result = filteredTrades?.sort(compareObjectsByDescending("no"))

  return result?.slice(0, limit)
}
