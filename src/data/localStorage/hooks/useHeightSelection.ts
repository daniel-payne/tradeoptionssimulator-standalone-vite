import { useQueryState } from "@keldan-systems/state-mutex"

import type { Height } from "@/display/controllers/HeightChooser"

export default function useHeightSelection(defaultSelection?: Height) {
  const [selection] = useQueryState<Height>("height", defaultSelection ?? "auto")

  return selection
}
