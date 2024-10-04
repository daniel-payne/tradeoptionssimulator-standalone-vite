import type { MarketOrNothing } from "@/data/indexDB/types/Market"
import type { HTMLAttributes, PropsWithChildren } from "react"

import YesterdayMovementDisplay from "./YesterdayMovementDisplay"
import CurrentOpenDisplay from "./CurrentOpenDisplay"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import useInfosSelection from "@/data/localStorage/hooks/useInfosSelection"
import { Info } from "../controllers/InfoSelector"
import { Action } from "../controllers/ActionSelector"
import useActionsSelection from "@/data/localStorage/hooks/useActionsSelection"

type ComponentProps = {
  market: MarketOrNothing
  price?: PriceOrNothing

  defaultInfos?: Info
  defaultActions?: Action

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketFooter({ market, price, defaultInfos, defaultActions, name = "MarketFooter", ...rest }: PropsWithChildren<ComponentProps>) {
  if (market == null || price == null) {
    return
  }

  const infos = useInfosSelection(defaultInfos ?? "on")
  const actions = useActionsSelection(defaultActions ?? "on")

  const hasNoPrices = price == null
  const hasPrices = !hasNoPrices

  // const actions = useActionsSelection()

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full flex flex-row justify-between ">
        {/* <div className="w-full flex flex-row justify-between items-center gap-2"> */}
        {/* {hasPrices && infos === "on" && (
          <div className="flex-auto">
            <YesterdayMovementDisplay price={price} />
            <CurrentOpenDisplay market={market} price={price} />
          </div>
        )} */}
        {/* {hasNoPrices && <div className="text-xs text-secondary opacity-50">Market Not Active</div>} */}
        {/* {actions && <div>Actions</div>} */}
        <div className="flex-auto flex flex-row gap-2 items-center">
          {hasPrices && infos === "on" && (
            <>
              <YesterdayMovementDisplay price={price} />
              <CurrentOpenDisplay market={market} price={price} />
            </>
          )}
          {hasNoPrices && <div className="text-xs text-secondary opacity-50">Market Not Active</div>}
        </div>
        <div className="flex-auto flex flex-row gap-2 justify-end items-center">
          {actions === "on" && (
            <>
              <div className="btn btn-sm btn-primary opacity-75 ">Quote</div>
            </>
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  )
}
