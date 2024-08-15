import db from "../db"

import { ScenarioSpeed } from "../enums/ScenarioSpeed"

import type { PriceSimulatorDexie } from "../db"
import type { Timer } from "../types/Timer"

import { DEFAULT_START } from "../constants/DEFAULT_START"

export async function controller(db: PriceSimulatorDexie, newValues: Timer = {}) {
  const id = db.id

  const collection = await db.timer.limit(1)
  const currentTimer = await collection.first()

  const defaultTimer = {
    id,
    speed: ScenarioSpeed.Slow,
    startDay: DEFAULT_START,
    currentDay: DEFAULT_START,
    currentTimestamp: new Date(DEFAULT_START).getTime(),
    isTimerActive: false,
  }

  let updatedTimer: Timer | undefined

  if (currentTimer == null) {
    updatedTimer = { ...defaultTimer, ...newValues, id }

    await db.timer.add(updatedTimer)
  } else {
    updatedTimer = { ...currentTimer, ...newValues, id }
    await collection.modify(updatedTimer)
  }
}

export default async function updateTimer(newValues: Timer = {}) {
  return await controller(db, newValues)
}
