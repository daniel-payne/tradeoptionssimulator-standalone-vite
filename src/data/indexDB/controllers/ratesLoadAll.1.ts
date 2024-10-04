import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { controller as ratesLoadFor } from "./ratesLoadFor"

export async function controller(db: PriceSimulatorDexie) {
  const currencies = await db.currencies.toArray()

  for await (const currency of currencies) {
    await ratesLoadFor(db, currency.code)
  }

  return db ? null : db
}

export default function ratesLoadAll() {
  return controller(db)
}
