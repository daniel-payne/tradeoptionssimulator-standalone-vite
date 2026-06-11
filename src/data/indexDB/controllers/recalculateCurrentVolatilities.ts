import db from "@/data/indexDB/db"
import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import getTimer from "./getTimer"
import getPriceSummaries from "./getPriceSummaries"
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
      if (symbol == null) return

      let vData = db.volatilitiesCache[symbol]
      if (vData == null) {
        const stored = await db.volatilities.get(symbol)
        if (stored?.data != null) {
          db.volatilitiesCache[symbol] = stored.data
          vData = stored.data
        }
      }

      if (vData == null) {
        return
      }

      const { firstActiveIndex, lastActiveIndex, durations } = vData

      if (currentIndex < firstActiveIndex || currentIndex > lastActiveIndex) {
        return
      }

      const arrayIndex = currentIndex - firstActiveIndex
      const currentVolatilities = { symbol } as any

      for (const duration of VOLATILITY_DURATIONS) {
        const durationStr = duration.toString()
        const durationData = durations[durationStr]

        if (durationData != null) {
          const overnightVolatility = durationData.overnight[arrayIndex]
          const parkinsonVolatility = durationData.parkinson[arrayIndex]
          const rogersSatchellVolatility = durationData.rogersSatchell[arrayIndex]
          const garminKlassVolatility = durationData.garminKlass[arrayIndex]
          const yangZhangVolatility = durationData.yangZhang[arrayIndex]
          const volatility = durationData.volatility[arrayIndex]

          currentVolatilities[durationStr] = {
            symbol,
            currentIndex,
            overnightVolatility,
            parkinsonVolatility,
            rogersSatchellVolatility,
            garminKlassVolatility,
            yangZhangVolatility,
            volatility,
          }
        }
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
