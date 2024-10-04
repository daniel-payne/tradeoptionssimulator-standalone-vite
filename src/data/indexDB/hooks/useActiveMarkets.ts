import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Market } from "@/data/indexDB/types/Market"

import compareObjectsBy from "@/utilities/compareObjectsBy"
import useTimer from "./useTimer"

export default function useActiveMarkets(): Array<Market> | undefined {
  const markets = useLiveQuery(async () => {
    return await db.markets?.toArray()
  })

  const { currentIndex } = useTimer()

  const activeMarkets = markets?.filter((market) => market.firstActiveIndex <= (currentIndex ?? 0))

  activeMarkets?.sort(compareObjectsBy("name"))

  return activeMarkets
}
