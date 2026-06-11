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

import consoleInfo from "@/utilities/consoleInfo"

export async function controller(db: PriceSimulatorDexie, symbol: string | undefined) {
  consoleInfo(`ohlcLoadFor: controller started for symbol = ${symbol}`)
  if (symbol == null) {
    consoleInfo("ohlcLoadFor: symbol is null/undefined, returning early")
    return
  }

  consoleInfo(`ohlcLoadFor: checking caches for ${symbol}...`)
  const cachedOpens = db.opensCache[symbol]
  const cachedHighs = db.highsCache[symbol]
  const cachedLows = db.lowsCache[symbol]
  const cachedCloses = db.closesCache[symbol]
  const cachedVolatilities = db.volatilitiesCache[symbol]

  if (cachedOpens != null && cachedHighs != null && cachedLows != null && cachedCloses != null && cachedVolatilities != null) {
    consoleInfo(`ohlcLoadFor: caches found for ${symbol}, returning early`)
    return
  }

  consoleInfo(`ohlcLoadFor: querying db for stored opens/highs/lows/closes/volatilities for ${symbol}...`)
  const storedOpens = await db.opens.get(symbol)
  const storedHighs = await db.highs.get(symbol)
  const storedLows = await db.lows.get(symbol)
  const storedCloses = await db.closes.get(symbol)
  const storedVolatilities = await db.volatilities.get(symbol)
  consoleInfo(`ohlcLoadFor: stored opens found? = ${storedOpens != null}, volatilities found? = ${storedVolatilities != null}`)

  if (storedOpens != null && storedHighs != null && storedLows != null && storedCloses != null && storedVolatilities != null) {
    consoleInfo(`ohlcLoadFor: storing retrieved db records into cache for ${symbol}`)
    db.opensCache[symbol] = storedOpens.data
    db.highsCache[symbol] = storedHighs.data
    db.lowsCache[symbol] = storedLows.data
    db.closesCache[symbol] = storedCloses.data
    db.volatilitiesCache[symbol] = storedVolatilities.data

    return
  }

  // if (LOADING[symbol] === true) {
  //   LOADING[symbol] = false

  //   return
  // }

  consoleInfo(`ohlcLoadFor: symbol ${symbol} not in cache/db. Fetching metadata from db.markets...`)
  LOADING[symbol] = true

  const market = await db.markets.get(symbol)
  consoleInfo(`ohlcLoadFor: retrieved market metadata from db for ${symbol}`, market)

  if (market?.symbol == null) {
    consoleInfo(`ohlcLoadFor: market symbol for ${symbol} not found in db.markets!`)
    LOADING[symbol] = false
    return
  }

  if (market?.firstActiveIndex != null) {
    consoleInfo(`ohlcLoadFor: firstActiveIndex is already populated in db for ${symbol}, skipping fetch`)
    LOADING[symbol] = false
    return
  }

  const url = `/prices/${encodeURIComponent(market.symbol.toLowerCase())}.txt`
  consoleInfo(`ohlcLoadFor: fetching price file from ${url}...`)
  const response = await fetch(url, {})
  consoleInfo(`ohlcLoadFor: fetch response status = ${response.status}, ok = ${response.ok}`)

  if (response.ok === false) {
    consoleInfo(`ohlcLoadFor: fetch failed for ${symbol}. status text: ${response.statusText}`)
    LOADING[symbol] = false
    return { error: response.statusText }
  }

  const csv = await response.text()
  consoleInfo(`ohlcLoadFor: csv text length = ${csv.length}`)

  const json = Papa.parse(csv, { header: true })
  consoleInfo(`ohlcLoadFor: parsed csv rows count = ${json.data?.length}`)

  const prices = json.data
    .map(csvToObjectForPrices)
    .filter((item: any) => item?.open)
    .filter((item) => item.index >= 0)
  consoleInfo(`ohlcLoadFor: filtered prices count = ${prices.length}`)

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
  consoleInfo(`ohlcLoadFor: parsed summary:`, summary)

  consoleInfo(`ohlcLoadFor: updating market in db for ${symbol}...`)
  await marketUpdate(summary)

  consoleInfo(`ohlcLoadFor: fetching volatility file for ${symbol}...`)
  const volUrl = `/volatilities/${encodeURIComponent(market.symbol.toLowerCase())}.json`
  let volatilitiesData: any = null
  try {
    const volResponse = await fetch(volUrl, {})
    if (volResponse.ok) {
      volatilitiesData = await volResponse.json()
    } else {
      console.warn(`ohlcLoadFor: volatility fetch failed for ${symbol}: ${volResponse.statusText}`)
    }
  } catch (err) {
    console.error(`ohlcLoadFor: error fetching volatility for ${symbol}:`, err)
  }

  consoleInfo(`ohlcLoadFor: saving opens/highs/lows/closes/volatilities arrays to db...`)
  await db.opens.put(opens)
  await db.highs.put(highs)
  await db.lows.put(lows)
  await db.closes.put(closes)
  if (volatilitiesData != null) {
    await db.volatilities.put({ symbol, data: volatilitiesData })
  }

  db.opensCache = structuredClone(db.opensCache)
  db.highsCache = structuredClone(db.highsCache)
  db.lowsCache = structuredClone(db.lowsCache)
  db.closesCache = structuredClone(db.closesCache)
  db.volatilitiesCache = structuredClone(db.volatilitiesCache)

  db.opensCache[symbol] = opens.data
  db.highsCache[symbol] = highs.data
  db.lowsCache[symbol] = lows.data
  db.closesCache[symbol] = closes.data
  if (volatilitiesData != null) {
    db.volatilitiesCache[symbol] = volatilitiesData
  }

  consoleInfo(`ohlcLoadFor: data loaded successfully for ${symbol}`)
  LOADING[symbol] = false
}

export default function ohlcLoadFor(symbol: string | undefined) {
  return controller(db, symbol)
}
