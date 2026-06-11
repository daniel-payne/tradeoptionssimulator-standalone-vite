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

  const response = await fetch(`/public/setup/Markets.csv`, {})

  if (response.ok === false) {
    return { error: response.statusText }
  }

  const csv = await response.text()

  const json = Papa.parse(csv, { header: true })

  const markets = json.data.filter((item: any) => item?.symbol?.length > 0) as Array<Market>

  for (const market of markets) {
    market.market = market.market === "" ? undefined : market.market
    market.country = market.country === "" ? undefined : market.country
    market.description = market.description === "" ? undefined : market.description
    market.code = market.code === "" ? undefined : market.code
    market.priceModifier = market.priceModifier === "" ? undefined : market.priceModifier
    market.priceSize = market.priceSize === "" ? undefined : market.priceSize
    market.priceSpread = market.priceSpread === "" ? undefined : market.priceSpread
    market.priceDecimals = market.priceDecimals === "" ? undefined : market.priceDecimals
    market.contractSize = market.contractSize === "" ? undefined : market.contractSize
    market.contractUnit = market.contractUnit === "" ? undefined : market.contractUnit
    market.contractName = market.contractName === "" ? undefined : market.contractName
    market.baseCurrency = market.baseCurrency === "" ? undefined : market.baseCurrency
    market.quoteCurrency = market.quoteCurrency === "" ? undefined : market.quoteCurrency
    market.baseSymbol = market.baseSymbol === "" ? undefined : market.baseSymbol
  }

  await db.markets.clear()

  await db.markets.bulkPut(markets).catch(Dexie.BulkError, function (e) {
    console.error("loadScenarios Loading Error: " + e.failures?.length)
  })

  return markets
}

export default function marketsLoadAll() {
  return controller(db)
}
