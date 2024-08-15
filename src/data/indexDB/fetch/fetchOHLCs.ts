"use server"

import * as Papa from "papaparse"

const FIRST_PRICE = "1970-01-01"

const NO_PRICES = {
  timestamps: [],
  opens: [],
  highs: [],
  lows: [],
  closes: [],
}

const csvToObjectForPrices = (item: any) => {
  if (!item["<DATE>"]) {
    return
  }

  const date = item["<DATE>"].substring(0, 4) + "-" + item["<DATE>"].substring(4, 6) + "-" + item["<DATE>"].substring(6, 8)

  const timestamp = new Date(date).getTime()

  const data = {
    date,
    timestamp,
    open: Number.parseFloat(item["<OPEN>"]),
    high: Number.parseFloat(item["<HIGH>"]),
    low: Number.parseFloat(item["<LOW>"]),
    close: Number.parseFloat(item["<CLOSE>"]),
    volume: Number.parseFloat(item["<VOL>"]),
  } as any

  return data
}

const csvParseWithHeaderOptions = {
  header: true,
}

export default async function openPrices(filePath: string): Promise<any> {
  let csv

  try {
    const response = await fetch(`/ohlc/` + filePath, {})

    if (response.ok === false) {
      return { error: response.statusText }
    }

    csv = await response.text()
  } catch {
    return NO_PRICES
  }

  if (csv == null) {
    return NO_PRICES
  }

  const json = Papa.parse(csv, csvParseWithHeaderOptions)

  const prices = json.data
    .map(csvToObjectForPrices)
    .filter((item: any) => item?.open)
    .filter((item: any) => item.date >= FIRST_PRICE)

  return {
    timestamps: prices.map((item: any) => item.timestamp as number),
    opens: prices.map((item: any) => item.open as number),
    highs: prices.map((item: any) => item.high as number),
    lows: prices.map((item: any) => item.low as number),
    closes: prices.map((item: any) => item.close as number),
    volumes: prices.map((item: any) => item.volume as number),
  }
}
