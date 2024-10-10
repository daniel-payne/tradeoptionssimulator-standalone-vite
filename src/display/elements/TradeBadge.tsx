// import { Margin } from "@/data/indexDB/types/Margin"
// import { Trade } from "@/data/indexDB/types/Trade"

import calculateMarginFor from "@/data/indexDB/calculate/calculateMarginFor"
import useMarginFor from "@/data/indexDB/hooks/useVariationMarginFor"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import useTradeFor from "@/data/indexDB/hooks/useTradeFor"
import formatValue from "@/utilities/formatValue"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  // trade?: Trade | undefined | null
  // margin?: Margin | undefined | null
  id: string | undefined | null

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradeBadge({ id, name = "TradeBadge", ...rest }: PropsWithChildren<ComponentProps>) {
  const trade = useTradeFor(id)
  const price = usePriceFor(trade?.symbol)
  const market = useMarketFor(trade?.symbol)

  const margin = useMarginFor(id)

  const isActive = trade?.profit == null

  const value = isActive ? margin?.currentProfit ?? 0 : trade?.profit ?? 0

  const displayValue = formatValue(Math.abs(value))
  let classNames

  // = isActive ? "rounded px-2 py-1 bg-profit text-sm" : "rounded px-2 py-1 outline-loss text-loss text-sm"

  if (isActive) {
    if (value > 0) {
      classNames = "rounded px-2 py-1 bg-profit text-sm"
    } else if (value < 0) {
      classNames = "rounded px-2 py-1 bg-loss text-sm"
    } else {
      classNames = "rounded px-2 py-1 bg-neutral text-sm"
    }
  } else {
    if (value > 0) {
      classNames = "rounded px-2 py-1 outline-profit text-profit text-sm"
    } else if (value < 0) {
      classNames = "rounded px-2 py-1 outline-loss text-loss text-sm"
    } else {
      classNames = "rounded px-2 py-1 outline-neutral text-neutral text-sm"
    }
  }

  return (
    <div {...rest} data-component={name}>
      <div className={classNames}>
        <span className="font-xs fg--subheading">{market?.name}</span>
        &nbsp;
        {displayValue}
      </div>
    </div>
  )
}
