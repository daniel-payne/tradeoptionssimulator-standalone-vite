import compareObjectsBy from "@/utilities/compareObjectsBy"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"

import { TradeStatus } from "../enums/TradeStatus"

export default function useActiveTrades() {
  const data = useLiveQuery(async () => {
    return await db.trades?.where({ status: TradeStatus.Open }).toArray()
  })

  data?.sort(compareObjectsBy("no"))

  return data
}
