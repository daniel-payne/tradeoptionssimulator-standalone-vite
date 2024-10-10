import type { Action } from "./controllers/ActionSelector"
import type { Behavior } from "./controllers/BehaviorSelector"
import type { Content } from "./controllers/ContentChooser"
import type { View } from "./controllers/ViewChooser"
import type { Range } from "./controllers/RangeChooser"
import type { Trade } from "./controllers/TradeChooser"

export type Settings = {
  view?: View
  content?: Content
  behaviors?: Behavior
  actions?: Action
  range?: Range
  trade?: Trade

  showMultiples?: boolean

  onAction?: ({ action, options }: { action: string; options?: any }) => void

  [key: string]: any
}
