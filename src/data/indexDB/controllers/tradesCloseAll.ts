import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TradeStatus } from "../enums/TradeStatus"
import { controller as tradeClose } from "./tradeClose"

export async function controller(db: PriceSimulatorDexie) {
  const activeTrades = await db.trades?.where({ status: TradeStatus.Open }).toArray()

  for (const trade of activeTrades) {
    await tradeClose(db, trade.id)
  }
}

export default function tradesCloseAll() {
  return controller(db)
}
