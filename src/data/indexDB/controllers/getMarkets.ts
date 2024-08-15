import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import loadMarkets from "@/data/indexDB/controllers/loadMarkets"
import { Market } from "../types/Market"

export async function controller(db: PriceSimulatorDexie) {
  let markets = await db.markets.toArray()

  if ((markets?.length ?? 0) < 1) {
    markets = (await loadMarkets()) as Array<Market>
  }

  return markets
}

export default function getMarkets() {
  return controller(db)
}
