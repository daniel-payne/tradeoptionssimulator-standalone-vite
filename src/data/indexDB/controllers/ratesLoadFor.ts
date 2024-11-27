import Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import currencyUpdate from "./currencyUpdate"

const TIMEGAP_CUTOFF = 10

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

export async function controller(db: PriceSimulatorDexie, code: string | undefined) {
  if (code == null) {
    return
  }

  if (db.ratesCache != null && db.ratesCache[code] != null && db.ratesCache[code].length > 0) {
    return
  }

  const count = await db.rates.where({ code }).count()

  if (count > 0) {
    const savedRates = await db.rates.where({ code }).first()

    db.ratesCache[code] = savedRates?.data

    return
  }

  const currency = await db.currencies.get(code)

  if (currency?.code == null) {
    return
  }

  await db.rates.where({ code }).delete()

  const response = await fetch(`/public/rates/${currency?.code}.csv`, {})

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const csv = await response.text()

  const json = Papa.parse(csv, { header: true })

  const rates = json.data
    .map(csvToObjectForRates)
    .filter((item: any) => item?.value)
    .filter((item) => item.index >= 0)

  const interestRates = { code, data: Array(20000).fill(undefined) }

  for (const rate of rates) {
    const index = rate.index

    interestRates.data[index] = rate.value
  }

  let firstActiveIndex: number | null = null

  let lastActiveIndex: number | null = null

  let daysSincePrice = 0
  let timeGapFound = false
  let dataStarted = false
  let rateCount = 0

  for (let i = interestRates.data?.length - 1; i >= 0; i--) {
    if (timeGapFound === false) {
      const rate = interestRates.data[i]

      if (rate == null) {
        daysSincePrice++
      } else {
        dataStarted = true

        rateCount += 1

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

  const summary = {
    code,
    rateCount,
    firstActiveIndex,
  }

  await currencyUpdate(summary)

  await db.rates.put(interestRates)

  db.ratesCache = structuredClone(db.ratesCache)

  db.ratesCache[code] = interestRates.data

  return
}

export default function ratesLoadFor(code: string | undefined) {
  return controller(db, code)
}
