import calculateMarginFor from "../calculate/computeMarginFor"
import useMarketFor from "./useMarketFor"
import usePriceFor from "./usePriceFor"
import useActiveTradeFor from "./useActiveTradeFor"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useVariationMarginFor(id: string | null | undefined = "MISSING") {
  const trade = useActiveTradeFor(id)

  const { symbol } = trade ?? {}

  const market = useMarketFor(symbol)
  const price = usePriceFor(symbol)

  const margin = calculateMarginFor(trade, market, price)

  return margin
}
