import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import timerReset from "./timerReset"

export async function controller(db: PriceSimulatorDexie) {
  // await db.timer.clear()

  // await db.scenarios.clear()
  // await db.markets.clear()
  // await db.currencies.clear()

  await db.trades.clear()
  await db.transactions.clear()

  // await db.marketHighs.clear()
  // await db.marketLows.clear()
  // await db.marketOpens.clear()
  // await db.marketCloses.clear()
  // await db.marketVolumes.clear()
  // await db.marketInterests.clear()

  // await db.averageOpenCloses.clear()
  // await db.averageHighLows.clear()

  // await db.percentageCloseYesterdays.clear()
  // await db.percentageOpenCloses.clear()
  // await db.percentageHighLows.clear()

  // await db.logSquaredHighLows.clear()
  // await db.logSquaredCloseOpens.clear()

  // await db.logOpenYesterdays.clear()
  // await db.logHighOpens.clear()
  // await db.logLowOpens.clear()
  // await db.logCloseOpens.clear()

  // await db.garminKlassValues.clear()
  // await db.rogersSatchellValues.clear()

  // await db.overnightVolatilities.clear()
  // await db.parkinsonVolatilities.clear()
  // await db.rogersSatchellVolatilities.clear()
  // await db.garminKlassVolatilities.clear()
  // await db.yangZhangVolatilities.clear()

  // await db.currencyRates.clear()

  // await db.priceSummaries.clear()
  // await db.rateSummaries.clear()

  await db.currentBalance.clear()
  await db.currentPrices.clear()
  await db.currentRates.clear()
  await db.currentMargins.clear()

  await timerReset()
  // await recalculatePrices()
  // await recalculateMargins()

  return
}

export default function clearUserData() {
  return controller(db)
}
