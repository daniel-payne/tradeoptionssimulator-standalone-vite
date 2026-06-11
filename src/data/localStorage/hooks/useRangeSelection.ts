import { useQueryState } from "@keldan-systems/state-mutex"

import type { Range } from "@/display/controllers/RangeChooser"

export default function useRangeSelection(defaultSelection?: Range) {
  const [selection] = useQueryState<Range>("range", defaultSelection ?? "1m")

  return selection
}
