import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Market } from "@/data/indexDB/types/Market"

import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function useMarkets(): Array<Market> | undefined {
  const markets = useLiveQuery(async () => {
    return await db.markets?.toArray()
  })

  markets?.sort(compareObjectsBy("displayOrder"))

  return markets
}
