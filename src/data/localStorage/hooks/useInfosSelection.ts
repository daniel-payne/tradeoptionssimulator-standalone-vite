import { useQueryState } from "@keldan-systems/state-mutex"

import type { Info } from "@/display/controllers/InfoSelector"

export default function useInfosSelection(defaultSelection?: Info) {
  const [selection] = useQueryState<Info>("info", defaultSelection ?? "off")

  return selection
}
