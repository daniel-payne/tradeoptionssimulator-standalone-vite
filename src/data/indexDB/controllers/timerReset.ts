import db from "../db"

import timerUpdate from "./timerUpdate"

import type { PriceSimulatorDexie } from "../db"
import timerNextDay from "./timerNextDay"
import { DEFAULT_START } from "../constants/DEFAULT_START"

export async function controller(db: PriceSimulatorDexie, day?: string) {
  if (db.timeout != null) {
    window.clearTimeout(db.timeout)
  }

  if (day == null) {
    await timerUpdate({ isTimerActive: false, currentIndex: DEFAULT_START, activeSymbols: undefined })

    return
  }

  const currentDate = new Date(day)

  const currentEpoch = currentDate.getTime()

  const currentIndex = Math.floor(currentEpoch / 1000 / 60 / 60 / 24)

  await timerUpdate({ isTimerActive: false, currentIndex, activeSymbols: undefined })

  await timerNextDay(true)
}

export default function timerReset(day?: string) {
  return controller(db, day)
}
