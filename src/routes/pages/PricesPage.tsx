import useMarketsByCategories from "@/data/indexDB/hooks/useMarketsByCategories"

import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"
import useFavoriteSelection from "@/data/localStorage/hooks/useFavoriteSelection"
import useRangeSelection from "@/data/localStorage/hooks/useRangeSelection"

import { Favorites } from "@/display/controllers/FavoritesSelector"
import { View } from "@/display/controllers/ViewChooser"
import BalanceModal from "@/display/coordinators/BalanceModal"
import PricesHeader from "@/display/coordinators/PricesHeader"
import SymbolManager from "@/display/coordinators/SymbolManager"
import TradingFooter from "@/display/coordinators/TradingFooter"

import { Settings } from "@/display/Settings"
import capitalizedWord from "@/utilities/capitalizedWord"
import sizeForCount from "@/utilities/sizeForCount"
import { useQueryState } from "@keldan-systems/state-mutex"
import { useEffect, type HTMLAttributes, type PropsWithChildren } from "react"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function PricesPage({ name = "PricesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const favorite = useFavoriteSelection()

  const favoriteSymbols = useFavoriteList()

  const range = useRangeSelection("1m")

  const categories = useMarketsByCategories(favorite === "on")

  const symbolCount = categories?.reduce((count, category) => count + category.markets?.length, 0)

  const [favorites] = useQueryState<Favorites>("favorites")
  const [view, setView] = useQueryState<View>("view")

  const displayClassName = view === "expanded" ? sizeForCount(symbolCount ?? 1) + " p-2" : `h-auto w-full sm:w-1/2 md:w-1/4 lg:w-1/6 p-2`

  const displayWrapperClassName =
    view === "expanded"
      ? "h-full w-full min-h-0 flex flex-row flex-wrap overflow-auto justify-start items-start"
      : "h-auto w-full min-h-0 flex flex-row flex-wrap overflow-auto justify-start items-start"

  useEffect(() => {
    if (favorites === "off" && view === "expanded") {
      setView("contracted")
    }
  }, [favorites])

  const settings = {
    view: view,
    content: "sparkline",
    behaviors: "on",
    actions: "off",
    range,
    showMultiples: false,
  } as Settings

  return (
    <div {...rest} data-component={name}>
      <BalanceModal />
      <div className="h-full w-full flex flex-col">
        <PricesHeader />
        <div className="flex-auto overflow-auto">
          <div className={displayWrapperClassName}>
            {categories?.map((category) => (
              <>
                {favorite === "off" && <div className="ps-4 py-2 fg--subheading w-full">{capitalizedWord(category.name)}</div>}

                {category.markets?.map((market) => (
                  <div className={displayClassName} key={market.symbol}>
                    <SymbolManager className="h-full w-full" symbol={market.symbol} settings={settings} favoriteSymbols={favoriteSymbols} />
                  </div>
                ))}
              </>
            ))}
          </div>
        </div>
        <TradingFooter />
      </div>
    </div>
  )
}
