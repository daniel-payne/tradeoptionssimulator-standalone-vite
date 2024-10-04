import { ScenarioSpeed } from "../enums/ScenarioSpeed"

export type Timer = {
  guid: string

  speed?: ScenarioSpeed

  currentIndex?: number

  isTimerActive?: boolean
}

export type TimerOrNothing = Timer | null | undefined
