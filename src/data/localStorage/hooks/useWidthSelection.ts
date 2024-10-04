import { useQueryState } from "@keldan-systems/state-mutex"

import type { Width } from "@/display/controllers/WidthChooser"

export default function useWidthSelection(defaultSelection?: Width) {
  const [selection] = useQueryState<Width>("width", defaultSelection ?? "auto")

  return selection
}
