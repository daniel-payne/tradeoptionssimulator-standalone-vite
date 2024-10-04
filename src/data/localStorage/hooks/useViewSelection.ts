import { useQueryState } from "@keldan-systems/state-mutex"

import type { View } from "@/display/controllers/ViewChooser"

export default function useViewSelection(defaultSelection?: View) {
  const [selection] = useQueryState<View>("view", defaultSelection ?? "contracted")

  return selection
}
