import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TradeStatus } from "../enums/TradeStatus"
import { controller as tradeClose } from "./tradeClose"

export async function controller(db: PriceSimulatorDexie, currentIndex: number) {
  const activeTrades = await db.trades?.where({ status: TradeStatus.Open }).toArray()

  for (const trade of activeTrades) {
    if (trade.expiryIndex != null && currentIndex >= trade.expiryIndex) {
      await tradeClose(db, trade.id)
    }
  }
}

export default function tradesCloseExpired(currentIndex: number) {
  return controller(db, currentIndex)
}
