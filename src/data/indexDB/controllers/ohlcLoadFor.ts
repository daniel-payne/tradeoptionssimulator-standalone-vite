import * as Papa from "papaparse"

import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import marketUpdate from "./marketUpdate"

const TIMEGAP_CUTOFF = 10

const LOADING = {} as Record<string, boolean>

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

export async function controller(db: PriceSimulatorDexie, symbol: string | undefined) {
  if (symbol == null) {
    return
  }

  const cachedOpens = db.opensCache[symbol]
  const cachedHighs = db.highsCache[symbol]
  const cachedLows = db.lowsCache[symbol]
  const cachedCloses = db.closesCache[symbol]

  if (cachedOpens != null && cachedHighs != null && cachedLows != null && cachedCloses != null) {
    return
  }

  const storedOpens = await db.opens.get(symbol)
  const storedHighs = await db.highs.get(symbol)
  const storedLows = await db.lows.get(symbol)
  const storedCloses = await db.closes.get(symbol)

  if (storedOpens != null && storedHighs != null && storedLows != null && storedCloses != null) {
    db.opensCache[symbol] = storedOpens.data
    db.highsCache[symbol] = storedHighs.data
    db.lowsCache[symbol] = storedLows.data
    db.closesCache[symbol] = storedCloses.data

    return
  }

  // if (LOADING[symbol] === true) {
  //   LOADING[symbol] = false

  //   return
  // }

  LOADING[symbol] = true

  const market = await db.markets.get(symbol)

  if (market?.symbol == null) {
    return
  }

  if (market?.firstActiveIndex != null) {
    return
  }

  const response = await fetch(`/public/prices/${market.symbol}.txt`, {})

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

  for (let i = closes.data?.length - 1; i >= 0; i--) {
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

  const summary = {
    symbol,
    priceCount,
    firstActiveIndex,
    firstInterDayIndex,
  }

  await marketUpdate(summary)

  await db.opens.put(opens)
  await db.highs.put(highs)
  await db.lows.put(lows)
  await db.closes.put(closes)

  db.opensCache = structuredClone(db.opensCache)
  db.highsCache = structuredClone(db.highsCache)
  db.lowsCache = structuredClone(db.lowsCache)
  db.closesCache = structuredClone(db.closesCache)

  db.opensCache[symbol] = opens.data
  db.highsCache[symbol] = highs.data
  db.lowsCache[symbol] = lows.data
  db.closesCache[symbol] = closes.data

  LOADING[symbol] = false
}

export default function ohlcLoadFor(symbol: string | undefined) {
  return controller(db, symbol)
}
