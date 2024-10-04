import { useQueryState } from "@keldan-systems/state-mutex"

import type { Content } from "@/display/controllers/ContentChooser"

export default function useContentSelection(defaultSelection?: Content) {
  const [selection] = useQueryState<Content>("content", defaultSelection ?? "info")

  return selection
}
