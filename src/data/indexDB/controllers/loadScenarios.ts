import Dexie from "dexie"
import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import type { Scenario } from "@/data/indexDB/types/Scenario"

export async function controller(db: PriceSimulatorDexie) {
  const response = await fetch(`/source_data/Scenarios.csv`, {})

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const csv = await response.text()

  const json = Papa.parse(csv, { header: true })

  const scenarios = json.data.filter((item: any) => item?.code?.length > 0) as Array<Scenario>

  await db.scenarios.clear()

  await db.scenarios.bulkPut(scenarios).catch(Dexie.BulkError, function (e) {
    console.error("loadScenarios Loading Error: " + e.failures.length)
  })

  return scenarios
}

export default function loadScenarios() {
  return controller(db)
}
