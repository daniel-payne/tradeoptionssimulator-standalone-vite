import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import compareObjectsBy from "@/utilities/compareObjectsBy"
import type { Rate } from "../types/Rate"

export default function useCurrentRates(): Array<Rate> | undefined {
  const currencyRates = useLiveQuery(async () => {
    return await db.currentRates?.toArray()
  })

  currencyRates?.sort(compareObjectsBy("key"))

  return currencyRates
}
