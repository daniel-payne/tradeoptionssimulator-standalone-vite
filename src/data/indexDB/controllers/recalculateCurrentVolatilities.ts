import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import getTimer from "./getTimer"

import getPriceSummaries from "./getPriceSummaries"
import getMarketOvernightVolatilityValuesForSymbol from "./getMarketOvernightVolatilityValuesForSymbol"
import getMarketParkinsonVolatilityValuesForSymbol from "./getMarketParkinsonVolatilityValuesForSymbol"
import getMarketRogersSatchellVolatilityValuesForSymbol from "./getMarketRogersSatchellVolatilityValuesForSymbol"
import getMarketGarminKlassVolatilityValuesForSymbol from "./getMarketGarminKlassVolatilityValuesForSymbol"
import getMarketYangZhangVolatilityValuesForSymbol from "./getMarketYangZhangVolatilityValuesForSymbol"
import extractVolatilityForIndex from "../calculate/extractVolatilityForIndex"
import { VOLATILITY_DURATIONS } from "../constants/VOLATILITY_DURATIONS"

export async function controller(db: PriceSimulatorDexie) {
  const timer = await getTimer()
  const priceSummaries = await getPriceSummaries()

  const currentIndex = timer?.currentIndex

  if (currentIndex == null) {
    return undefined
  }

  const activeSymbols = timer?.activeSymbols
  const targetSummaries =
    activeSymbols && activeSymbols.length > 0
      ? priceSummaries.filter((s) => s.symbol != null && activeSymbols.includes(s.symbol))
      : priceSummaries

  await db.currentVolatilities.clear()

  await Promise.all(
    targetSummaries.map(async (priceSummary) => {
      const symbol = priceSummary.symbol
      const currentVolatilities = { symbol } as any

      if (symbol != null) {
        await Promise.all(
          VOLATILITY_DURATIONS.map(async (duration) => {
            const overnightVolatility = await getMarketOvernightVolatilityValuesForSymbol(symbol, duration)
            const parkinsonVolatility = await getMarketParkinsonVolatilityValuesForSymbol(symbol, duration)
            const rogersSatchellVolatility = await getMarketRogersSatchellVolatilityValuesForSymbol(symbol, duration)
            const garminKlassVolatility = await getMarketGarminKlassVolatilityValuesForSymbol(symbol, duration)
            const yangZhangVolatility = await getMarketYangZhangVolatilityValuesForSymbol(symbol, duration)

            const Volatility = extractVolatilityForIndex(
              currentIndex,
              overnightVolatility,
              parkinsonVolatility,
              rogersSatchellVolatility,
              garminKlassVolatility,
              yangZhangVolatility,
              priceSummary
            )

            currentVolatilities[duration.toString()] = Volatility
          })
        )
      }

      if (currentVolatilities[VOLATILITY_DURATIONS[0].toString()] != null) {
        await db.currentVolatilities.put(currentVolatilities)
      }
    })
  )

  return db
}

export default function recalculateCurrentVolatilities() {
  return controller(db)
}
