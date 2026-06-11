import Dexie, { Table } from "dexie"

import generateID from "@/utilities/generateID"

import { controller as applicationLoad } from "./controllers/applicationLoad"

import type { Timer } from "@/data/indexDB/types/Timer"
import type { Scenario } from "@/data/indexDB/types/Scenario"
import type { Market } from "@/data/indexDB/types/Market"
import type { Trade } from "@/data/indexDB/types/Trade"
import type { Transaction } from "@/data/indexDB/types/Transaction"
import type { MarketData } from "./types/MarketData"
import type { CurrencyData } from "./types/CurrencyData"
import type { Currency } from "./types/Currency"

import type { Margin } from "@/data/indexDB/types/Margin"
import type { Balance } from "@/data/indexDB/types/Balance"
import type { Price } from "@/data/indexDB/types/Price"
import type { Rate } from "@/data/indexDB/types/Rate"
import type { PriceSummary } from "@/data/indexDB/types/PriceSummary"
import type { RateSummary } from "@/data/indexDB/types/RateSummary"
import type { SymbolData } from "@/data/indexDB/types/SymbolData"
import type { RangeData } from "@/data/indexDB/types/RangeData"
import type { KeyData } from "@/data/indexDB/types/KeyData"
import type { Volatility } from "./types/Volatility"

export const DIXIE_BALANCE_KEY = "DIXIE_BALANCE_KEY"

export class PriceSimulatorDexie extends Dexie {
  timeout: number | null = null

  guid: string

  timer!: Table<Timer>

  scenarios!: Table<Scenario>

  // update the markets instras of summaries

  markets!: Table<Market>
  opens!: Table<MarketData>
  highs!: Table<MarketData>
  lows!: Table<MarketData>
  closes!: Table<MarketData>

  currencies!: Table<Currency>
  rates!: Table<CurrencyData>

  trades!: Table<Trade>
  transactions!: Table<Transaction>

  marketHighs!: Table<SymbolData>
  marketLows!: Table<SymbolData>
  marketOpens!: Table<SymbolData>
  marketCloses!: Table<SymbolData>
  marketVolumes!: Table<SymbolData>
  marketInterests!: Table<SymbolData>

  averageOpenCloses!: Table<SymbolData>
  averageHighLows!: Table<SymbolData>

  percentageCloseYesterdays!: Table<SymbolData>
  percentageOpenCloses!: Table<SymbolData>
  percentageHighLows!: Table<SymbolData>

  logSquaredHighLows!: Table<SymbolData>
  logSquaredCloseOpens!: Table<SymbolData>

  logOpenYesterdays!: Table<SymbolData>
  logHighOpens!: Table<SymbolData>
  logLowOpens!: Table<SymbolData>
  logCloseOpens!: Table<SymbolData>

  garminKlassValues!: Table<SymbolData>
  rogersSatchellValues!: Table<SymbolData>

  overnightVolatilities!: Table<RangeData>
  parkinsonVolatilities!: Table<RangeData>
  rogersSatchellVolatilities!: Table<RangeData>
  garminKlassVolatilities!: Table<RangeData>
  yangZhangVolatilities!: Table<RangeData>

  currencyRates!: Table<KeyData>

  priceSummaries!: Table<PriceSummary>
  rateSummaries!: Table<RateSummary>

  currentBalance!: Table<Balance>
  currentPrices!: Table<Price>
  currentVolatilities!: Table<Volatility>
  currentRates!: Table<Rate>
  currentMargins!: Table<Margin>

  opensCache: Record<string, Array<number | null | undefined> | null | undefined> = {}
  highsCache: Record<string, Array<number | null | undefined> | null | undefined> = {}
  lowsCache: Record<string, Array<number | null | undefined> | null | undefined> = {}
  closesCache: Record<string, Array<number | null | undefined> | null | undefined> = {}
  ratesCache: Record<string, Array<number | null | undefined> | null | undefined> = {}

  constructor() {
    super("PriceSimulator")

    this.version(10).stores({
      timer: "guid",

      scenarios: "ref, name",
      markets: "symbol, name",
      currencies: "code, name",

      trades: "id, symbol, status, [symbol+status]",
      transactions: "reference,  timestamp",

      marketHighs: "symbol",
      marketLows: "symbol",
      marketOpens: "symbol",
      marketCloses: "symbol",
      marketVolumes: "symbol",
      marketInterests: "symbol",

      averageOpenCloses: "symbol",
      averageHighLows: "symbol",

      percentageCloseYesterdays: "symbol",
      percentageOpenCloses: "symbol",
      percentageHighLows: "symbol",

      logSquaredHighLows: "symbol",
      logSquaredCloseOpens: "symbol",

      logOpenYesterdays: "symbol",
      logHighOpens: "symbol",
      logLowOpens: "symbol",
      logCloseOpens: "symbol",

      garminKlassValues: "symbol",
      rogersSatchellValues: "symbol",

      overnightVolatilities: "[symbol+duration]",
      parkinsonVolatilities: "[symbol+duration]",
      rogersSatchellVolatilities: "[symbol+duration]",
      garminKlassVolatilities: "[symbol+duration]",
      yangZhangVolatilities: "[symbol+duration]",

      currencyRates: "key",

      priceSummaries: "symbol",
      rateSummaries: "key",

      currentBalance: "guid",
      currentPrices: "symbol",
      currentVolatilities: "symbol",
      currentRates: "key",
      currentMargins: "id, status",
    })

    this.guid = generateID()
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const db = new PriceSimulatorDexie()

db.on("ready", function () {
  applicationLoad(db)
  // window.addEventListener("onbeforeunload", async () => {
  //   const id = db.guid
  //   const collection = await db.status.limit(1)
  //   const currentStatus = await collection.first()
  //   const newStatus = { isTimerActive: false }
  //   if (currentStatus?.id === id) {
  //     await collection.modify({ ...currentStatus, ...newStatus, id })
  //   }
  // })
})

export default db
