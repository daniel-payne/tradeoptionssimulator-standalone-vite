import compareObjectsBy from "@/utilities/compareObjectsBy"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"
import { TradeStatus } from "../enums/TradeStatus"

export default function useInactiveTrades(limit = 999) {
  const data = useLiveQuery(async () => {
    return await db.trades?.toArray()
  })

  const result = data?.filter((trade) => trade.status != TradeStatus.Open).sort(compareObjectsBy("no"))

  return result?.slice(0, limit)
}
