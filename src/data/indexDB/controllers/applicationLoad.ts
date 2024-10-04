import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { controller as currenciesLoadAll } from "./currenciesLoadAll"
import { controller as marketsLoadAll } from "./marketsLoadAll"
import { controller as scenariosLoadAll } from "./scenariosLoadAll"
import { controller as ohlcLoadFor } from "./ohlcLoadFor"
import { controller as ratesLoadFor } from "./ratesLoadFor"

export async function controller(db: PriceSimulatorDexie) {
  await currenciesLoadAll(db)
  await marketsLoadAll(db)
  await scenariosLoadAll(db)

  await ohlcLoadFor(db, "LC.F")
  await ratesLoadFor(db, "USD")

  return
}

export default function applicationLoad() {
  return controller(db)
}
