import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"

import { DEFAULT_START } from "@/data/indexDB/constants/DEFAULT_START"

import type { Timer } from "@/data/indexDB/types/Timer"

export default function useTimer(): Timer {
  let timer = useLiveQuery(async () => {
    const data = await db.timer?.limit(1).first()

    return data
  })

  const defaultTimer = {
    guid: db.guid,
    speed: ScenarioSpeed.Slow,
    currentIndex: DEFAULT_START,
    isTimerActive: false,
  }

  return timer ?? (defaultTimer as Timer)
}
