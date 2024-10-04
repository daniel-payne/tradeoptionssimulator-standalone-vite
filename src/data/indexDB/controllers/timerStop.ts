import db from "../db"

import timerUpdate from "./timerUpdate"

import type { PriceSimulatorDexie } from "../db"
import { TradeStatus } from "../enums/TradeStatus"

export async function controller(db: PriceSimulatorDexie, force: boolean) {
  const activeTradeCount = await db.trades?.where({ status: TradeStatus.Open }).count()

  if (activeTradeCount > 0 && force === false) {
    return
  }

  if (db.timeout != null) {
    window.clearTimeout(db.timeout)
  }

  timerUpdate({ isTimerActive: false })
}

export default function timerStop(force = false) {
  return controller(db, force)
}
