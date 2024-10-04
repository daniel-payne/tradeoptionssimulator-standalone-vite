import { useQueryState } from "@keldan-systems/state-mutex"

import type { Action } from "@/display/controllers/ActionSelector"

export default function useActionsSelection(defaultSelection?: Action) {
  const [selection] = useQueryState<Action>("actions", defaultSelection ?? "off")

  return selection
}
