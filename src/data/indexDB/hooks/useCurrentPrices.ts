import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import compareObjectsBy from "@/utilities/compareObjectsBy"
import type { Price } from "../types/Price"

export default function useCurrentPrices(): Array<Price> | undefined {
  const currentPrices = useLiveQuery(async () => {
    return await db.currentPrices?.toArray()
  })

  currentPrices?.sort(compareObjectsBy("symbol"))

  return currentPrices
}
