import type { Category } from "@/data/indexDB/types/Category"
import pluralWord from "@/utilities/pluralWord"
import capitalizedWord from "@/utilities/capitalizedWord"
import useActiveMarkets from "./useActiveMarkets"
import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"

export default function useMarketsByCategories(showOnlyFavorites = false): Array<Category> | undefined {
  const markets = useActiveMarkets()

  const categories: Array<Category> = []

  const favoritesList = useFavoriteList()

  const list = showOnlyFavorites ? markets?.filter((market) => favoritesList.includes(market.symbol)) : markets

  for (const market of list || []) {
    const name = market.category

    let category = categories.find((category) => category.name === name)

    if (!category) {
      const description = capitalizedWord(pluralWord(name))

      category = { name: market.category, description, markets: [] }

      categories.push(category)
    }

    category.markets.push(market)
  }

  for (const category of categories) {
    category.markets.sort((a, b) => {
      if (a.category === "bond") {
        const first = Number.parseInt(a.name)
        const second = Number.parseInt(b.name)

        if (first < second) return -1
        else if (first > second) return 1
        else return 0
      }

      return a.name.localeCompare(b.name)
    })
  }

  return categories
}
