/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import useMarkets from "./useMarkets"

export default function useLoadingStatus() {
  const markets = useMarkets()

  const marketsCount = markets?.length
  const loadedMarketsCount = markets?.filter((market) => market.firstActiveIndex != null)?.length

  return { marketsCount, loadedMarketsCount }
}
