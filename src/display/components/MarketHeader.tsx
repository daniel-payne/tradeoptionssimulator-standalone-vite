import { MarketOrNothing } from "@/data/indexDB/types/Market"
import type { HTMLAttributes, PropsWithChildren } from "react"
import MarketNameDescription from "./MarketNameDescription"
import MarketBehaviors from "./MarketBehaviors"
import useBehaviorsSelection from "@/data/localStorage/hooks/useBehaviorsSelection"
import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"

import type { Behavior } from "../controllers/BehaviorSelector"

type ComponentProps = {
  market: MarketOrNothing

  defaultBehaviors?: Behavior

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketHeader({ market, defaultBehaviors, name = "MarketHeader", ...rest }: PropsWithChildren<ComponentProps>) {
  const behaviors = useBehaviorsSelection(defaultBehaviors ?? "on")
  const favorites = useFavoriteList()

  const isFavorite = favorites?.includes(market?.symbol ?? "MISSING")

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full flex flex-row justify-between ">
        <MarketNameDescription className="truncate pe-2" market={market} />
        {behaviors === "on" && <MarketBehaviors market={market} isFavorite={isFavorite} />}
      </div>
    </div>
  )
}
