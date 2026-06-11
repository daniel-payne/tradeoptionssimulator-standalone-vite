import calculateMarginFor from "../calculate/computeMarginFor"
import useMarketFor from "./useMarketFor"
import usePriceFor from "./usePriceFor"

import useActiveTradesFor from "./useActiveTradesFor"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useVariationMarginsFor(symbol: string | null | undefined = "MISSING") {
  const trades = useActiveTradesFor(symbol)

  const market = useMarketFor(symbol)
  const price = usePriceFor(symbol)

  if (trades != null && market != null && price != null) {
    const margins = trades?.map((trade) => calculateMarginFor(trade, market, price))

    return margins
  }
}
