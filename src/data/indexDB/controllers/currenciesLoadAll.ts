import Dexie from "dexie"
import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import type { Currency } from "@/data/indexDB/types/Currency"

export async function controller(db: PriceSimulatorDexie) {
  const count = await db.currencies.count()

  if (count > 0) {
    return
  }

  const response = await fetch(`/public/setup/Currencies.csv`, {})

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const csv = await response.text()

  const json = Papa.parse(csv, { header: true })

  const currencies = json.data.filter((item: any) => item?.code?.length > 0) as Array<Currency>

  await db.currencies.clear()

  await db.currencies.bulkPut(currencies).catch(Dexie.BulkError, function (e) {
    console.error("loadCurrencies Loading Error: " + e.failures?.length)
  })

  return currencies
}

export default function currenciesLoadAll() {
  return controller(db)
}
