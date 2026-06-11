import { useQueryState } from "@keldan-systems/state-mutex"

import type { Behavior } from "@/display/controllers/BehaviorSelector"

export default function useBehaviorsSelection(defaultSelection?: Behavior) {
  const [selection] = useQueryState<Behavior>("behaviors", defaultSelection ?? "off")

  return selection
}
