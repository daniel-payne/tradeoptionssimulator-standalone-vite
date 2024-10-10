import db from "../db"

import { ScenarioSpeed } from "../enums/ScenarioSpeed"

import type { PriceSimulatorDexie } from "../db"
import type { Timer } from "../types/Timer"

import { DEFAULT_START } from "../constants/DEFAULT_START"

export async function controller(db: PriceSimulatorDexie, newValues: Partial<Timer> = {}) {
  const guid = db.guid

  const collection = await db.timer.limit(1)
  const currentTimer = await collection.first()

  const defaultTimer = {
    guid,
    speed: ScenarioSpeed.Slow,
    startDay: DEFAULT_START,
    currentDay: DEFAULT_START,
    currentTimestamp: new Date(DEFAULT_START).getTime(),
    isTimerActive: false,
  }

  let updatedTimer: Timer | undefined

  if (currentTimer == null) {
    updatedTimer = { ...defaultTimer, ...newValues, guid }
  } else if (currentTimer.guid === guid) {
    updatedTimer = { ...currentTimer, ...newValues }
  } else {
    updatedTimer = { ...currentTimer, ...newValues, guid }
  }

  await db.transaction("rw", ["timer"], async () => {
    await db.timer.clear()
    await db.timer.add(updatedTimer)
  })
}

export default async function timerUpdate(newValues: Partial<Timer> = {}) {
  return await controller(db, newValues)
}
