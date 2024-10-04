import { useQueryState } from "@keldan-systems/state-mutex"

import type { Trade } from "@/display/controllers/TradeChooser"

export default function useTradeSelection(defaultSelection?: Trade) {
  const [selection] = useQueryState<Trade>("trade", defaultSelection ?? "dollar")

  return selection
}
