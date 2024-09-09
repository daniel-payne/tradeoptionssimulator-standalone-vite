import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Volatility } from "../types/Volatility"

export default function useCurrentVolatilityForSymbol(symbol: string = "MISSING"): Volatility | undefined {
  const currentVolatility = useLiveQuery(async () => {
    return await db.currentVolatilities?.where({ symbol }).first()
  })

  return currentVolatility
}
