import { MarketOrNothing } from "../types/Market"
import { PriceOrNothing } from "../types/Price"

export default function computeContractValueFor(market: MarketOrNothing, price: PriceOrNothing) {
  if (market == null || price == null) {
    return null
  }

  const midPrice = price?.isMarketClosed ? price?.priorClose : price?.currentOpen
  let contractPoints

  if (market?.contractSize != null) {
    contractPoints = ((market?.contractSize ?? 1) / (market?.priceSize ?? 1)) * (market?.priceModifier ?? 1)
  } else {
    contractPoints = market?.priceSize ?? 1
  }

  const contractValue = (midPrice ?? 0) * (contractPoints ?? 1)

  return contractValue
}
