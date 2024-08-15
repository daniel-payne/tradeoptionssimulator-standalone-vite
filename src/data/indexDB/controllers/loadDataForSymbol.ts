import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import calculateVariances from "../calculate/calculateVariances"
import calculateVolatilities from "../calculate/calculateVolatilities"

const TIMEGAP_CUTOFF = 10

export async function controller(db: PriceSimulatorDexie, symbol: string) {
  const market = await db.markets.get(symbol)
  const path = market?.filePath

  if (path == null) {
    return
  }

  const count = await db.marketOpens.where({ symbol }).count()

  if (count > 0) {
    return
  }

  await db.priceSummaries.where({ symbol }).delete()

  await db.priceSummaries.add({ symbol, status: "FETCHING", message: "Fetching data" })

  const response = await fetch(`/source_data` + path, {})

  await db.priceSummaries.put({ symbol, status: "LOADING", message: "Loading data" })

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const csv = await response.text()

  const json = Papa.parse(csv, { header: true })

  const prices = json.data
    .map(csvToObjectForPrices)
    .filter((item: any) => item?.open)
    .filter((item) => item.index >= 0)

  const opens = { symbol, data: Array(20000).fill(undefined) }
  const highs = { symbol, data: Array(20000).fill(undefined) }
  const lows = { symbol, data: Array(20000).fill(undefined) }
  const closes = { symbol, data: Array(20000).fill(undefined) }
  const volumes = { symbol, data: Array(20000).fill(undefined) }
  const interests = { symbol, data: Array(20000).fill(undefined) }

  for (const price of prices) {
    const index = price.index

    opens.data[index] = price.open
    highs.data[index] = price.high
    lows.data[index] = price.low
    closes.data[index] = price.close
    volumes.data[index] = price.volume
    interests.data[index] = price.interest
  }

  let firstActiveIndex: number | null = null
  let firstInterDayIndex: number | null = null

  let lastActiveIndex: number | null = null

  let daysSincePrice = 0
  let timeGapFound = false
  let dataStarted = false
  let priceCount = 0

  for (let i = closes.data.length - 1; i >= 0; i--) {
    if (timeGapFound === false) {
      const open = opens.data[i]
      const close = closes.data[i]

      if (close == null) {
        daysSincePrice++
      } else {
        dataStarted = true

        priceCount++

        if (lastActiveIndex == null) {
          lastActiveIndex = i
        }

        if (open != close) {
          firstInterDayIndex = i
        }
        firstActiveIndex = i
        daysSincePrice = 0
      }

      if (dataStarted == true && daysSincePrice >= TIMEGAP_CUTOFF) {
        timeGapFound = true
      }
    }
  }

  await db.marketOpens.where({ symbol }).delete()
  await db.marketHighs.where({ symbol }).delete()
  await db.marketLows.where({ symbol }).delete()
  await db.marketCloses.where({ symbol }).delete()
  await db.marketVolumes.where({ symbol }).delete()
  await db.marketInterests.where({ symbol }).delete()

  await db.marketOpens.put(opens)
  await db.marketHighs.put(highs)
  await db.marketLows.put(lows)
  await db.marketCloses.put(closes)
  await db.marketVolumes.put(volumes)
  await db.marketInterests.put(interests)

  await db.priceSummaries.where({ symbol }).modify({
    symbol,
    firstActiveIndex,
    firstInterDayIndex,
    lastActiveIndex,
    priceCount,
    status: "CALCULATING",
    message: "Calculating Variances",
  })

  const variances = await calculateVariances({ opens, highs, lows, closes })

  const {
    averageOpenCloses,
    averageHighLows,

    percentageCloseYesterdays,
    percentageOpenCloses,
    percentageHighLows,

    logSquaredHighLows,
    logSquaredCloseOpens,

    logOpenYesterdays,
    logHighOpens,
    logLowOpens,
    logCloseOpens,

    garminKlassValues,
    rogersSatchellValues,
  } = variances

  await db.averageOpenCloses.where({ symbol }).delete()
  await db.averageHighLows.where({ symbol }).delete()
  await db.percentageCloseYesterdays.where({ symbol }).delete()
  await db.percentageOpenCloses.where({ symbol }).delete()
  await db.percentageHighLows.where({ symbol }).delete()
  await db.logSquaredHighLows.where({ symbol }).delete()
  await db.logSquaredCloseOpens.where({ symbol }).delete()
  await db.logOpenYesterdays.where({ symbol }).delete()
  await db.logHighOpens.where({ symbol }).delete()
  await db.logLowOpens.where({ symbol }).delete()
  await db.logCloseOpens.where({ symbol }).delete()
  await db.garminKlassValues.where({ symbol }).delete()
  await db.rogersSatchellValues.where({ symbol }).delete()

  await db.averageOpenCloses.put({ symbol, data: averageOpenCloses })
  await db.averageHighLows.put({ symbol, data: averageHighLows })
  await db.percentageCloseYesterdays.put({ symbol, data: percentageCloseYesterdays })
  await db.percentageOpenCloses.put({ symbol, data: percentageOpenCloses })
  await db.percentageHighLows.put({ symbol, data: percentageHighLows })
  await db.logSquaredHighLows.put({ symbol, data: logSquaredHighLows })
  await db.logSquaredCloseOpens.put({ symbol, data: logSquaredCloseOpens })
  await db.logOpenYesterdays.put({ symbol, data: logOpenYesterdays })
  await db.logHighOpens.put({ symbol, data: logHighOpens })
  await db.logLowOpens.put({ symbol, data: logLowOpens })
  await db.logCloseOpens.put({ symbol, data: logCloseOpens })
  await db.garminKlassValues.put({ symbol, data: garminKlassValues })
  await db.rogersSatchellValues.put({ symbol, data: rogersSatchellValues })

  const durations = [30, 60, 90]

  for (const duration of durations) {
    const volatilities = await calculateVolatilities(variances, duration)

    const { overnightVolatilities, parkinsonVolatilities, rogersSatchellVolatilities, garminKlassVolatilities, yangZhangVolatilities } = volatilities

    await db.overnightVolatilities.where({ symbol, duration }).delete()
    await db.parkinsonVolatilities.where({ symbol, duration }).delete()
    await db.rogersSatchellVolatilities.where({ symbol, duration }).delete()
    await db.garminKlassVolatilities.where({ symbol, duration }).delete()
    await db.yangZhangVolatilities.where({ symbol, duration }).delete()

    await db.overnightVolatilities.put({ symbol, duration, data: overnightVolatilities })
    await db.parkinsonVolatilities.put({ symbol, duration, data: parkinsonVolatilities })
    await db.rogersSatchellVolatilities.put({ symbol, duration, data: rogersSatchellVolatilities })
    await db.garminKlassVolatilities.put({ symbol, duration, data: garminKlassVolatilities })
    await db.yangZhangVolatilities.put({ symbol, duration, data: yangZhangVolatilities })
  }

  await db.priceSummaries.where({ symbol }).modify({
    symbol,
    status: "READY",
    message: "Data Ready",
  })

  return
}

export default function loadDataForSymbol(symbol: string) {
  return controller(db, symbol)
}

const csvToObjectForPrices = (item: any) => {
  if (!item["<DATE>"]) {
    return
  }

  const date = item["<DATE>"].substring(0, 4) + "-" + item["<DATE>"].substring(4, 6) + "-" + item["<DATE>"].substring(6, 8)

  const index = Math.floor(new Date(date).getTime() / 1000 / 60 / 60 / 24)

  const data = {
    date,
    index,
    open: Number.parseFloat(item["<OPEN>"]),
    high: Number.parseFloat(item["<HIGH>"]),
    low: Number.parseFloat(item["<LOW>"]),
    close: Number.parseFloat(item["<CLOSE>"]),
    volume: Number.parseFloat(item["<VOL>"]),
    interest: Number.parseFloat(item["<OPENINT>"]),
  } as any

  return data
}
