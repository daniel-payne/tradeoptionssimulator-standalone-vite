import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useSymbols() {
  const markets = useLiveQuery(async () => {
    return await db.markets?.toArray()
  })

  const symbols = markets?.map((market) => market.symbol)

  symbols?.sort()

  return symbols
}
