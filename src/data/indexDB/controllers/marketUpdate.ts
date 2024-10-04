import db from "../db"

import type { PriceSimulatorDexie } from "../db"
import type { Market } from "../types/Market"

export async function controller(db: PriceSimulatorDexie, newValues: Partial<Market> = {}) {
  const symbol = newValues.symbol

  console.log("marketUpdate", newValues)

  const markets = await db.markets.toArray()

  console.log("markets", markets)

  const currentMarket = await db.markets.where({ symbol }).first()

  let updatedMarket

  if (currentMarket == null) {
    updatedMarket = newValues as Market
  } else {
    updatedMarket = { ...currentMarket, ...newValues }
  }

  await db.markets.put(updatedMarket)
}

export default async function marketUpdate(newValues: Partial<Market> = {}) {
  return await controller(db, newValues)
}
