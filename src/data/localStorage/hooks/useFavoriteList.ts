import { useLocalState } from "@keldan-systems/state-mutex"

export default function useFavoriteList() {
  const [favorites] = useLocalState<Array<string>>("MARKET-FAVORITES", [])

  return favorites
}
