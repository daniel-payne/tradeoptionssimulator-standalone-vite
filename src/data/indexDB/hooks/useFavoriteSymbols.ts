import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"
import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useFavoriteSymbols() {
  const markets = useLiveQuery(async () => {
    return await db.markets?.toArray()
  })

  const favoritesList = useFavoriteList()

  const symbols = markets?.map((market) => market.symbol).filter((symbol) => favoritesList?.includes(symbol))

  symbols?.sort()

  return symbols
}
