import { ScenarioSpeed } from "../enums/ScenarioSpeed"

export type Timer = {
  guid: string

  speed?: ScenarioSpeed

  currentIndex?: number

  isTimerActive?: boolean

  activeSymbols?: Array<string>
}

export type TimerOrNothing = Timer | null | undefined
