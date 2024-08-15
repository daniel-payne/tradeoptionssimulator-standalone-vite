import { ScenarioSpeed } from "../enums/ScenarioSpeed"

export type Timer = {
  id?: string

  speed?: ScenarioSpeed

  currentIndex?: number

  isTimerActive?: boolean
}
