import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import consoleInfo from "@/utilities/consoleInfo"

export async function controller(db: PriceSimulatorDexie) {
  consoleInfo("clearAllData: controller started. Clearing all IndexedDB tables...")

  consoleInfo("clearAllData: clearing db.timer...")
  await db.timer.clear()

  consoleInfo("clearAllData: clearing db.scenarios...")
  await db.scenarios.clear()

  consoleInfo("clearAllData: clearing db.markets...")
  await db.markets.clear()

  consoleInfo("clearAllData: clearing db.currencies...")
  await db.currencies.clear()

  consoleInfo("clearAllData: clearing db.trades...")
  await db.trades.clear()

  consoleInfo("clearAllData: clearing db.transactions...")
  await db.transactions.clear()

  consoleInfo("clearAllData: clearing db.opens...")
  await db.opens.clear()

  consoleInfo("clearAllData: clearing db.highs...")
  await db.highs.clear()

  consoleInfo("clearAllData: clearing db.lows...")
  await db.lows.clear()

  consoleInfo("clearAllData: clearing db.closes...")
  await db.closes.clear()

  consoleInfo("clearAllData: clearing db.rates...")
  await db.rates.clear()

  consoleInfo("clearAllData: clearing memory caches...")
  db.opensCache = {}
  db.highsCache = {}
  db.lowsCache = {}
  db.closesCache = {}
  db.ratesCache = {}
  db.volatilitiesCache = {}

  consoleInfo("clearAllData: clearing db.percentageCloseYesterdays...")
  await db.percentageCloseYesterdays.clear()

  consoleInfo("clearAllData: clearing db.percentageOpenCloses...")
  await db.percentageOpenCloses.clear()

  consoleInfo("clearAllData: clearing db.percentageHighLows...")
  await db.percentageHighLows.clear()

  consoleInfo("clearAllData: clearing db.logSquaredHighLows...")
  await db.logSquaredHighLows.clear()

  consoleInfo("clearAllData: clearing db.logSquaredCloseOpens...")
  await db.logSquaredCloseOpens.clear()

  consoleInfo("clearAllData: clearing db.logOpenYesterdays...")
  await db.logOpenYesterdays.clear()

  consoleInfo("clearAllData: clearing db.logHighOpens...")
  await db.logHighOpens.clear()

  consoleInfo("clearAllData: clearing db.logLowOpens...")
  await db.logLowOpens.clear()

  consoleInfo("clearAllData: clearing db.logCloseOpens...")
  await db.logCloseOpens.clear()

  consoleInfo("clearAllData: clearing db.garminKlassValues...")
  await db.garminKlassValues.clear()

  consoleInfo("clearAllData: clearing db.rogersSatchellValues...")
  await db.rogersSatchellValues.clear()

  consoleInfo("clearAllData: clearing db.volatilities...")
  await db.volatilities.clear()

  consoleInfo("clearAllData: clearing db.currencyRates...")
  await db.currencyRates.clear()

  consoleInfo("clearAllData: clearing db.priceSummaries...")
  await db.priceSummaries.clear()

  consoleInfo("clearAllData: clearing db.rateSummaries...")
  await db.rateSummaries.clear()

  consoleInfo("clearAllData: clearing db.currentBalance...")
  await db.currentBalance.clear()

  consoleInfo("clearAllData: clearing db.currentPrices...")
  await db.currentPrices.clear()

  consoleInfo("clearAllData: clearing db.currentVolatilities...")
  await db.currentVolatilities.clear()

  consoleInfo("clearAllData: clearing db.currentRates...")
  await db.currentRates.clear()

  consoleInfo("clearAllData: clearing db.currentMargins...")
  await db.currentMargins.clear()

  consoleInfo("clearAllData: controller completed successfully.")
  return
}

export default function clearAllData() {
  return controller(db)
}
