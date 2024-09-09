import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Rate } from "../types/Rate"

export default function useCurrentRateForKey(key: string = "MISSING"): Rate | undefined {
  const currentRate = useLiveQuery(async () => {
    return await db.currentRates?.where({ key }).first()
  })

  return currentRate
}
