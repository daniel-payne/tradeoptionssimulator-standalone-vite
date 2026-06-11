// import { Margin } from "@/data/indexDB/types/Margin"
// import { Trade } from "@/data/indexDB/types/Trade"

import calculateMarginFor from "@/data/indexDB/calculate/computeMarginFor"
import useMarginFor from "@/data/indexDB/hooks/useVariationMarginFor"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import useTradeFor from "@/data/indexDB/hooks/useTradeFor"
import formatValue from "@/utilities/formatValue"
import type { HTMLAttributes, PropsWithChildren } from "react"
import type { Settings } from "../Settings"

type ComponentProps = {
  // trade?: Trade | undefined | null
  // margin?: Margin | undefined | null
  id: string | undefined | null

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradeBadge({ id, settings = {}, name = "TradeBadge", ...rest }: PropsWithChildren<ComponentProps>) {
  const trade = useTradeFor(id)
  const price = usePriceFor(trade?.symbol)
  const market = useMarketFor(trade?.symbol)

  const margin = useMarginFor(id)

  const isActive = trade?.profit == null

  const value = isActive ? margin?.currentProfit ?? 0 : trade?.profit ?? 0

  const displayValue = formatValue(Math.abs(value))

  let classNames = "btn btn-sm"

  if (isActive) {
    if (value > 0) {
      classNames += " bg-profit"
    } else if (value < 0) {
      classNames += " bg-loss "
    } else {
      classNames += " bg-neutral  "
    }
  } else {
    if (value > 0) {
      classNames += " outline-profit text-profit "
    } else if (value < 0) {
      classNames += " outline-loss text-loss "
    } else {
      classNames += " outline-neutral text-neutral "
    }
  }

  const handleClick = () => {
    if (isActive) {
      if (settings.onAction) {
        settings.onAction({
          action: "tradeClose",
          options: {
            id,
          },
        })
      }
    }
  }

  return (
    <div {...rest} data-component={name}>
      <div className={classNames} onClick={handleClick}>
        <span className="font-xs fg--subheading">{market?.name}</span>
        &nbsp;
        {displayValue}
      </div>
    </div>
  )
}
