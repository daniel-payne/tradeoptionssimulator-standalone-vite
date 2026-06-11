import { MarketOrNothing } from "../types/Market"
import { PriceOrNothing } from "../types/Price"
import { TradeOrNothing } from "../types/Trade"

export default function computeMarginFor(trade: TradeOrNothing, market: MarketOrNothing, price: PriceOrNothing) {
  const { id, amount, direction, entryPrice, entryValue, expiryIndex } = trade ?? {}

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

    const currentDifference = currentPrice - entryPrice

    const currentPercent = currentDifference / entryPrice

    const currentModifier = direction === "CALL" ? 1 : -1

    const currentProfit = (amount ?? 0) * currentModifier * currentPercent

    const currentValue = entryValue + currentProfit

    const currentIndex = price.currentIndex

    // const currentValue = ((currentPrice * priceModifier) / priceSize) * (amount ?? 0)

    // const currentDifference = currentValue - entryValue

    // const currentPercent = currentDifference / entryValue

    // const currentProfit = direction === "CALL" ? currentValue - entryValue : entryValue - currentValue

    // const entryValues = (entryPrice / priceModifier) * priceSize * (amount ?? 0)

    return {
      id,
      amount,
      priceModifier,
      priceSize,
      entryPrice,
      entryValue,

      currentIndex,
      currentPrice,
      currentDifference,
      currentPercent,
      currentModifier,
      currentValue,
      currentProfit,
    }
  }
}
