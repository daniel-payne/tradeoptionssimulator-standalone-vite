import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { controller as olchLoadFor } from "./ohlcLoadFor"

export async function controller(db: PriceSimulatorDexie) {
  const markets = await db.markets.toArray()

  for await (const market of markets) {
    await olchLoadFor(db, market.symbol)
  }

  return db ? null : db
}

export default function ohlcLoadAll() {
  return controller(db)
}
