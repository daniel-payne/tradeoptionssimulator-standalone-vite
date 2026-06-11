import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useMarketFor(symbol: string | null | undefined = "MISSING") {
  const market = useLiveQuery(async () => {
    return await db.markets?.where({ symbol }).first()
  }, [symbol])

  return market
}
