import { MarketOrNothing } from "@/data/indexDB/types/Market"
import type { HTMLAttributes, PropsWithChildren } from "react"
import MarketNameDescription from "./MarketNameDescription"
import MarketBehaviors from "./MarketBehaviors"
import useBehaviorsSelection from "@/data/localStorage/hooks/useBehaviorsSelection"
import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"

import type { Behavior } from "../controllers/BehaviorSelector"
import { Settings } from "../Settings"

type ComponentProps = {
  market: MarketOrNothing

  settings?: Settings
  favoriteSymbols?: Array<string>

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketHeader({ market, settings = {}, favoriteSymbols = [], name = "MarketHeader", ...rest }: PropsWithChildren<ComponentProps>) {
  const { behaviors = "off" } = settings

  const isFavorite = favoriteSymbols?.includes(market?.symbol ?? "MISSING")

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full flex flex-row justify-between ">
        <MarketNameDescription className="truncate pe-2" market={market} />
        {behaviors === "on" && <MarketBehaviors market={market} isFavorite={isFavorite} />}
      </div>
    </div>
  )
}
