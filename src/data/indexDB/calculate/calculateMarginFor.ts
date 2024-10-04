import { MarketOrNothing } from "../types/Market"
import { PriceOrNothing } from "../types/Price"
import { TradeOrNothing } from "../types/Trade"

export default function calculateMarginFor(trade: TradeOrNothing, market: MarketOrNothing, price: PriceOrNothing) {
  const { amount, direction, entryPrice, entryValue, expiryIndex } = trade ?? {}

  let priceModifier = market?.priceModifier ?? 1
  let priceSize = market?.priceSize ?? 1

  if (!Number.isFinite(priceModifier)) {
    priceModifier = 1
  }

  if (!Number.isFinite(priceSize)) {
    priceSize = 1
  }

  if (price != null && entryPrice != null && entryValue != null && expiryIndex != null) {
    const currentPrice = direction === "CALL" ? price.priorClosingAsk : price.priorClosingBid

    const currentDifference = direction === "CALL" ? currentPrice - entryPrice : entryPrice - currentPrice

    const currentPercent = currentDifference / entryPrice

    const currentValue = ((currentPrice * priceModifier) / priceSize) * (amount ?? 0)

    const currentProfit = direction === "CALL" ? currentValue - entryValue : entryValue - currentValue

    return {
      currentPrice,
      currentDifference,
      currentPercent,
      currentValue,
      currentProfit,
    }
  }
}
