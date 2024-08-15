// @ts-expect-error no type
import * as gauss from "gaussian-analytics"

export default async function calculateGreeks(
  spotPrice: number,
  strikePrice: number,
  range: number,
  volatility: number,
  domesticRate: number, // term Currency
  foreignRate?: number // base Currency
) {
  let price

  if (foreignRate == null) {
    price = gauss.eqBlackScholes(spotPrice, strikePrice, range / 365, volatility, 0, domesticRate / 100)
  } else {
    price = gauss.fxBlackScholes(spotPrice, strikePrice, range / 365, volatility, foreignRate / 100, domesticRate / 100)
  }

  return price
}
