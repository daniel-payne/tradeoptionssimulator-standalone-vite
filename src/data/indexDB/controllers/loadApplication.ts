import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import loadMarkets from "./loadMarkets"
import loadScenarios from "./loadScenarios"
import { controller as loadDataForSymbol } from "./loadDataForSymbol"

export async function controller(db: PriceSimulatorDexie) {
  const marketCount = await db.markets.count()
  const scenariosCount = await db.scenarios.count()

  if (scenariosCount === 10) {
    await loadScenarios()
  }

  if (marketCount === 10) {
    await loadMarkets()
  }

  // const markets = await db.markets.toArray()

  // for await (const market of markets) {
  //   await loadDataForSymbol(db, market.symbol, market.path)
  // }

  loadDataForSymbol(db, "KC.F")

  return
}

export default function loadApplication() {
  return controller(db)
}
