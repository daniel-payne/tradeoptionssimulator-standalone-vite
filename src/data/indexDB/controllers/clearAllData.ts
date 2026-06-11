import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie) {
  await db.timer.clear()

  await db.scenarios.clear()
  await db.markets.clear()
  await db.currencies.clear()

  await db.trades.clear()
  await db.transactions.clear()

  await db.opens.clear()
  await db.highs.clear()
  await db.lows.clear()
  await db.closes.clear()

  await db.rates.clear()

  db.opensCache = {}
  db.highsCache = {}
  db.lowsCache = {}
  db.closesCache = {}
  db.ratesCache = {}

  await db.percentageCloseYesterdays.clear()
  await db.percentageOpenCloses.clear()
  await db.percentageHighLows.clear()

  await db.logSquaredHighLows.clear()
  await db.logSquaredCloseOpens.clear()

  await db.logOpenYesterdays.clear()
  await db.logHighOpens.clear()
  await db.logLowOpens.clear()
  await db.logCloseOpens.clear()

  await db.garminKlassValues.clear()
  await db.rogersSatchellValues.clear()

  await db.overnightVolatilities.clear()
  await db.parkinsonVolatilities.clear()
  await db.rogersSatchellVolatilities.clear()
  await db.garminKlassVolatilities.clear()
  await db.yangZhangVolatilities.clear()

  await db.currencyRates.clear()

  await db.priceSummaries.clear()
  await db.rateSummaries.clear()

  await db.currentBalance.clear()
  await db.currentPrices.clear()
  await db.currentVolatilities.clear()
  await db.currentRates.clear()
  await db.currentMargins.clear()

  return
}

export default function clearAllData() {
  return controller(db)
}
