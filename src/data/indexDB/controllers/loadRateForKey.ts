import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import Papa from "papaparse"

const TIMEGAP_CUTOFF = 10

export async function controller(db: PriceSimulatorDexie, key: string) {
  const currency = await db.currencies.get(key)
  const path = currency?.filePath

  if (path == null) {
    return
  }

  const count = await db.currencyRates.where({ key }).count()

  if (count > 0) {
    return
  }

  await db.rateSummaries.where({ key }).delete()

  await db.rateSummaries.add({ key, status: "FETCHING", message: "Fetching data" })

  const response = await fetch(`/source_data` + path, {})

  await db.rateSummaries.put({ key, status: "LOADING", message: "Loading data" })

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const csv = await response.text()

  const json = Papa.parse(csv, { header: true })

  const rates = json.data
    .map(csvToObjectForRates)
    .filter((item: any) => item?.value)
    .filter((item) => item.index >= 0)

  const interestRates = { key, data: Array(20000).fill(undefined) }

  for (const rate of rates) {
    const index = rate.index

    interestRates.data[index] = rate.value
  }

  let firstActiveIndex: number | null = null

  let lastActiveIndex: number | null = null

  let daysSincePrice = 0
  let timeGapFound = false
  let dataStarted = false

  for (let i = interestRates.data.length - 1; i >= 0; i--) {
    if (timeGapFound === false) {
      const rate = interestRates.data[i]

      if (rate == null) {
        daysSincePrice++
      } else {
        dataStarted = true

        if (lastActiveIndex == null) {
          lastActiveIndex = i
        }

        firstActiveIndex = i
        daysSincePrice = 0
      }

      if (dataStarted == true && daysSincePrice >= TIMEGAP_CUTOFF) {
        timeGapFound = true
      }
    }
  }

  await db.currencyRates.where({ key }).delete()

  await db.currencyRates.put(interestRates)

  await db.rateSummaries.where({ key }).modify({
    key,
    firstActiveIndex,
    lastActiveIndex,
    status: "READY",
    message: "Data Ready",
  })

  return
}

export default function loadRateForKey(key: string) {
  return controller(db, key)
}

const csvToObjectForRates = (item: any) => {
  if (!item["date"]) {
    return
  }

  const date = item["date"]

  const index = Math.floor(new Date(date).getTime() / 1000 / 60 / 60 / 24)

  const data = {
    date,
    index,
    value: Number.parseFloat(item["value"]),
  } as any

  return data
}
