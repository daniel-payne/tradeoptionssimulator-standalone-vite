import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"
import { DEFAULT_START } from "@/data/indexDB/constants/DEFAULT_START"
import { Timer } from "../types/Timer"

export async function controller(db: PriceSimulatorDexie) {
  const id = db.id

  let timer = await db.timer.limit(1).first()

  if (timer == null) {
    const defaultTimer = {
      id,
      speed: ScenarioSpeed.Slow,
      currentIndex: DEFAULT_START,
      isTimerActive: false,
    }

    timer = { ...defaultTimer, id } as Timer

    await db.timer.put(timer)
  }

  return timer
}

export default function getTimer() {
  return controller(db)
}
