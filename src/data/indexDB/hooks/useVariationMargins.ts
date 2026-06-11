import db from "@/data/indexDB/db"

import computeMarginFor from "../calculate/computeMarginFor"

import useActiveTrades from "./useActiveTrades"

import priceCalculateFor from "../controllers/priceCalculateFor"
import { useEffect, useState } from "react"
import { Margin } from "../types/Margin"
import useTimer from "./useTimer"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useVariationMargins() {
  const [margins, setMargins] = useState<Array<Margin>>([])

  const timer = useTimer()
  const trades = useActiveTrades()

  useEffect(() => {
    const recalculate = async () => {
      const newMargins = [] as Array<Margin>

      for (const trade of trades ?? []) {
        const symbol = trade.symbol

        const market = await db.markets.where({ symbol }).first()

        const price = await priceCalculateFor(symbol)

        if (market != null && price != null) {
          const margin = computeMarginFor(trade, market, price)

          if (margin != null) {
            newMargins.push(margin)
          }
        }
      }

      setMargins(newMargins)
    }

    recalculate()
  }, [trades, timer])

  return margins
}
