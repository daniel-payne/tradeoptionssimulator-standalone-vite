import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { controller as recalculateCurrentBalance } from "./recalculateCurrentBalance"
import { controller as recalculateCurrentPrices } from "./recalculateCurrentPrices"
import { controller as recalculateCurrentRates } from "./recalculateCurrentRates"
import { controller as recalculateCurrentMargins } from "./recalculateCurrentMargins"
import { controller as recalculateCurrentVolatilities } from "./recalculateCurrentVolatilities"

import closeAllTrades from "./closeAllTrades"
import closeExpiringTrades from "./closeExpiringTrades"

export async function controller(db: PriceSimulatorDexie) {
  await recalculateCurrentPrices(db)
  await recalculateCurrentVolatilities(db)
  await recalculateCurrentRates(db)
  await recalculateCurrentMargins(db)

  const newBalance = await recalculateCurrentBalance(db)

  if (newBalance.availableBalance < 250) {
    await closeAllTrades()
    return
  }

  await closeExpiringTrades()
  // await executeExpiringOptions()

  return
}

export default function recalculateAll() {
  return controller(db)
}
