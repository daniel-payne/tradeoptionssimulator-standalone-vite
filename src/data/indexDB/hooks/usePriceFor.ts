import useClosesFor from "./useClosesFor"
import useHighsFor from "./useHighsFor"
import useLowsFor from "./useLowsFor"
import useOpensFor from "./useOpensFor"
import useTimer from "./useTimer"
import useMarketFor from "./useMarketFor"

import calculatePriceForIndex from "../calculate/computePriceForIndex"

export default function usePriceFor(symbol: string | null | undefined) {
  const timer = useTimer()

  const opens = useOpensFor(symbol ?? "MISSING")
  const closes = useClosesFor(symbol ?? "MISSING")
  const highs = useHighsFor(symbol ?? "MISSING")
  const lows = useLowsFor(symbol ?? "MISSING")

  const market = useMarketFor(symbol ?? "MISSING")

  const currentPrice = calculatePriceForIndex(timer, market, opens, highs, lows, closes)

  return currentPrice
}
