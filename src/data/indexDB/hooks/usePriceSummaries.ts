import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { PriceSummary } from "@/data/indexDB/types/PriceSummary"
import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function usePriceSummaries(): Array<PriceSummary> | undefined {
  const priceSummaries = useLiveQuery(async () => {
    return await db.priceSummaries?.toArray()
  })

  priceSummaries?.sort(compareObjectsBy("symbol"))

  return priceSummaries
}
