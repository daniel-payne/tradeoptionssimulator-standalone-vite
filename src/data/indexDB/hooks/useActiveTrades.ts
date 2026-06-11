import compareObjectsByDescending from "@/utilities/compareObjectsByDescending"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"

import { TradeStatus } from "../enums/TradeStatus"

export default function useActiveTrades() {
  const data = useLiveQuery(async () => {
    return await db.trades?.where({ status: TradeStatus.Open }).toArray()
  })

  data?.sort(compareObjectsByDescending("no"))

  return data
}
