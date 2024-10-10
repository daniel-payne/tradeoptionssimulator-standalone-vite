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

  opensCache: Record<string, Array<number | null | undefined> | null | undefined> = {}
  highsCache: Record<string, Array<number | null | undefined> | null | undefined> = {}
  lowsCache: Record<string, Array<number | null | undefined> | null | undefined> = {}
  closesCache: Record<string, Array<number | null | undefined> | null | undefined> = {}
  ratesCache: Record<string, Array<number | null | undefined> | null | undefined> = {}

  constructor() {
    super("PriceSimulator")

    this.version(2).stores({
      timer: "guid",

      scenarios: "ref",

      markets: "symbol",
      opens: "symbol",
      highs: "symbol",
      lows: "symbol",
      closes: "symbol",

      currencies: "code",
      rates: "code",

      trades: "id, symbol, status, [id+status], [symbol+status]",
      transactions: "id, timestamp",
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
