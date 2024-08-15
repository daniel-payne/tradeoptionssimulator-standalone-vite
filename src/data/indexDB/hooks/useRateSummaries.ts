import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { PriceSummary } from "@/data/indexDB/types/PriceSummary"
import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function useRateSummaries(): Array<PriceSummary> | undefined {
  const rateSummaries = useLiveQuery(async () => {
    return await db.rateSummaries?.toArray()
  })

  rateSummaries?.sort(compareObjectsBy("key"))

  return rateSummaries
}
