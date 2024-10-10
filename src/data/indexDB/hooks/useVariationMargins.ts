import db from "@/data/indexDB/db"

import calculateMarginFor from "../calculate/calculateMarginFor"

import useActiveTrades from "./useActiveTrades"

import priceCalculateFor from "../controllers/priceCalculateFor"
import { useEffect, useState } from "react"
import { Margin } from "../types/Margin"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useVariationMargins() {
  const [margins, setMargins] = useState<Array<Margin>>([])

  const trades = useActiveTrades()

  useEffect(() => {
    const recalculate = async () => {
      const newMargins = [] as Array<Margin>

      for (const trade of trades ?? []) {
        const symbol = trade.symbol

        const market = await db.markets.where({ symbol }).first()

        const price = await priceCalculateFor(symbol)

        if (market != null && price != null) {
          const margin = calculateMarginFor(trade, market, price)

          if (margin != null) {
            newMargins.push(margin)
          }
        }
      }

      setMargins(newMargins)
    }

    recalculate()
  }, [trades])

  return margins
}
