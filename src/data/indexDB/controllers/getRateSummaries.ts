import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie) {
  const rateSummaries = await db.rateSummaries.toArray()

  return rateSummaries
}

export default function getRateSummaries() {
  return controller(db)
}
