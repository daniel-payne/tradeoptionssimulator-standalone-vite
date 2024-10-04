import { useQueryState } from "@keldan-systems/state-mutex"

import type { Favorites } from "@/display/controllers/FavoritesSelector"

export default function useFavoriteSelection(defaultSelection?: Favorites) {
  const [selection] = useQueryState<Favorites>("favorites", defaultSelection ?? "off")

  return selection
}
