import Dexie from "dexie"
import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import type { Scenario } from "@/data/indexDB/types/Scenario"

export async function controller(db: PriceSimulatorDexie) {
  const count = await db.scenarios.count()

  if (count > 0) {
    return
  }

  const response = await fetch(`/public/setup/Scenarios.csv`, {})

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const csv = await response.text()

  const json = Papa.parse(csv, { header: true })

  const scenarios = json.data.filter((item: any) => item?.ref?.length > 0) as Array<Scenario>

  await db.scenarios.clear()

  await db.scenarios.bulkPut(scenarios).catch(Dexie.BulkError, function (e) {
    console.error("loadScenarios Loading Error: " + e.failures?.length)
  })

  // db.scenariosCache = scenarios

  return scenarios
}

export default function scenariosLoadAll() {
  return controller(db)
}
