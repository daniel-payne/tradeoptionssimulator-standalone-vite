import compareObjectsBy from "@/utilities/compareObjectsBy"
import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"
import { TradeStatus } from "../enums/TradeStatus"
import useInactiveTrades from "./useInactiveTrades"

export default function useInactiveTradesFor(symbol: string | null | undefined) {
  const data = useInactiveTrades()

  const result = data?.filter((trade) => trade.symbol === symbol).sort(compareObjectsBy("no"))

  return result
}
