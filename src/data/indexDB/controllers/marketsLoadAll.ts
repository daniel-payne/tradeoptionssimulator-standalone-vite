import Dexie from "dexie"
import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import type { Market } from "@/data/indexDB/types/Market"

export async function controller(db: PriceSimulatorDexie) {
  const count = await db.markets.count()

  if (count > 0) {
    return
  }

  const response = await fetch(`/source_data/Markets.csv`, {})

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const csv = await response.text()

  const json = Papa.parse(csv, { header: true })

  const markets = json.data.filter((item: any) => item?.symbol?.length > 0) as Array<Market>

  await db.markets.clear()

  await db.markets.bulkPut(markets).catch(Dexie.BulkError, function (e) {
    console.error("loadScenarios Loading Error: " + e.failures.length)
  })

  return markets
}

export default function marketsLoadAll() {
  return controller(db)
}
