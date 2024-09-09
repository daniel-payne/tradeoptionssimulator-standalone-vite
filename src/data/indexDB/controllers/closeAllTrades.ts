import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import closeTrade from "./closeTrade"

export async function controller(db: PriceSimulatorDexie) {
  const currentMargins = await db.currentMargins.toArray()

  for await (const currentMargin of currentMargins) {
    await closeTrade(currentMargin.id)
  }

  return
}

export default function closeAllTrades() {
  return controller(db)
}
