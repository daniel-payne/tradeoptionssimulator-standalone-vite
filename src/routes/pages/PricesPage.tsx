import useActiveSymbols from "@/data/indexDB/hooks/useActiveSymbols"
import useFavoriteSymbols from "@/data/indexDB/hooks/useFavoriteSymbols"
import useMarketsByCategories from "@/data/indexDB/hooks/useMarketsByCategories"
import useContentSelection from "@/data/localStorage/hooks/useContentSelection"
import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"
import useFavoriteSelection from "@/data/localStorage/hooks/useFavoriteSelection"
import useViewSelection from "@/data/localStorage/hooks/useViewSelection"
import { Favorites } from "@/display/controllers/FavoritesSelector"
import { View } from "@/display/controllers/ViewChooser"
import PricesHeader from "@/display/coordinators/PricesHeader"
import SymbolManager from "@/display/coordinators/SymbolManager"
import TradingFooter from "@/display/coordinators/TradingFooter"
import TradingHeader from "@/display/coordinators/TradingHeader"
import capitalizedWord from "@/utilities/capitalizedWord"
import { useLocalState, useQueryState } from "@keldan-systems/state-mutex"
import { useEffect, type HTMLAttributes, type PropsWithChildren } from "react"

const layoutForCountOf = (count: number | undefined): string => {
  if (count == null || count > 9) {
    return "h-full sm:h-1/2 md:h-1/4 lg:h-1/6 w-full sm:w-1/2 md:w-1/4 lg:w-1/6 p-2"
  }

  switch (count) {
    case 1:
      return "h-full w-full p-2"
    case 2:
      return "h-1/2 w-full p-2"
    case 3:
    case 4:
      return "h/1/4 lg:h-1/2 w-full lg:w-1/2 p-2"
    case 5:
    case 6:
      return "h/1/4 lg:h-1/2 h-1/2 w-full lg:w-1/3 p-2"
    case 7:
    case 8:
    case 9:
      return "h/1/6 lg:h-1/3 w-full lg:w-1/3 p-2"
    default:
      return "h-1/3 w-full lg:w-1/4 p-2"
  }
}

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function PricesPage({ name = "PricesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const favorite = useFavoriteSelection()

  // const favoriteSymbols = useFavoriteSymbols()
  // const activeSymbols = useActiveSymbols()
  const categories = useMarketsByCategories(favorite === "on")

  const symbolCount = categories?.reduce((count, category) => count + category.markets.length, 0)

  // const displayList = favorite === "on" ? favoriteSymbols : activeSymbols

  const [favorites] = useQueryState<Favorites>("favorites")
  const [view, setView] = useQueryState<View>("view")

  const displayClassName = view === "expanded" ? layoutForCountOf(symbolCount ?? 0) : `h-auto w-full sm:w-1/2 md:w-1/4 lg:w-1/6 p-2`

  const displayWrapperClassName =
    view === "expanded"
      ? "h-full w-full min-h-0 flex flex-row flex-wrap overflow-auto justify-start items-start"
      : "h-auto w-full min-h-0 flex flex-row flex-wrap overflow-auto justify-start items-start"

  useEffect(() => {
    if (favorites === "off" && view === "expanded") {
      setView("contracted")
    }
  }, [favorites])

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full flex flex-col">
        <PricesHeader />
        <div className="flex-auto overflow-auto">
          <div className={displayWrapperClassName}>
            {categories?.map((category) => (
              <>
                {favorite === "off" && <div className="ps-4 py-2 fg--subheading w-full">{capitalizedWord(category.name)}</div>}

                {category.markets?.map((market) => (
                  <div className={displayClassName} key={market.symbol}>
                    <SymbolManager className="h-full w-full" symbol={market.symbol} defaultView="contracted" defaultContent="sparkline" defaultBehaviors="on" />
                  </div>
                ))}
              </>
            ))}
          </div>
          {/* 
          <div className={displayWrapperClassName}>
            {displayList?.map((symbol) => (
              <div className={displayClassName} key={symbol}>
                <SymbolManager className="h-full w-full" symbol={symbol} defaultView="contracted" defaultContent="sparkline" defaultBehaviors="on" />
              </div>
            ))}
          </div> 
          */}
        </div>
        <TradingFooter />
      </div>
    </div>
  )
}
