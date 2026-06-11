import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"
import useTimer from "./useTimer"
import compareObjectsBy from "@/utilities/compareObjectsBy"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useActiveSymbols() {
  const markets = useLiveQuery(async () => {
    return await db.markets?.toArray()
  })

  const timer = useTimer()

  const { currentIndex } = timer

  markets?.sort(compareObjectsBy("name"))

  if (currentIndex != null) {
    const activeMarkets = markets?.filter((symbol) => symbol.firstActiveIndex <= currentIndex)

    const symbols = activeMarkets?.map((market) => market.symbol)

    // symbols?.sort()

    return symbols
  }
}
