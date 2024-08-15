import db from "../db"

import updateTimer from "./updateTimer"

import type { PriceSimulatorDexie } from "../db"
import timerNextDay from "./timerNextDay"
import { DEFAULT_START } from "../constants/DEFAULT_START"

export async function controller(db: PriceSimulatorDexie, day?: string) {
  if (db.timeout != null) {
    window.clearTimeout(db.timeout)
  }

  if (day == null) {
    await updateTimer({ isTimerActive: false, currentIndex: DEFAULT_START })

    return
  }

  const currentDate = new Date(day)

  const currentEpoch = currentDate.getTime()

  const currentIndex = Math.floor(currentEpoch / 1000 / 60 / 60 / 24)

  await updateTimer({ isTimerActive: false, currentIndex })

  await timerNextDay(true)
}

export default function timerReset(day?: string) {
  return controller(db, day)
}
