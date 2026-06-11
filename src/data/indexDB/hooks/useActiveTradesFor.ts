import compareObjectsBy from "@/utilities/compareObjectsBy"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"
import { TradeStatus } from "../enums/TradeStatus"

export default function useActiveTradesFor(symbol: string | null | undefined = "MISSING") {
  const data = useLiveQuery(async () => {
    return await db.trades?.where({ symbol, status: TradeStatus.Open }).toArray()
  }, [symbol])

  data?.sort(compareObjectsBy("no"))

  return data
}
