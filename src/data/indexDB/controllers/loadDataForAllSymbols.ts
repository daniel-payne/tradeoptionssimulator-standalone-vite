import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { controller as loadDataForSymbol } from "./loadDataForSymbol"

export async function controller(db: PriceSimulatorDexie) {
  const markets = await db.markets.toArray()

  for await (const market of markets) {
    await loadDataForSymbol(db, market.symbol)
  }

  return
}

export default function loadDataForAllSymbols() {
  return controller(db)
}
