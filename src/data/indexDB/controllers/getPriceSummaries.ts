import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie) {
  const priceSummaries = await db.priceSummaries.toArray()

  return priceSummaries
}

export default function getPriceSummaries() {
  return controller(db)
}
