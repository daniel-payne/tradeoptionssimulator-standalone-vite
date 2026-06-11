import { Market, MarketOrNothing } from "@/data/indexDB/types/Market"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  market: Market
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketSummaryDescription({ market, name = "MarketSummaryDescription", ...rest }: PropsWithChildren<ComponentProps>) {
  if (market == null) {
    return
  }

  if (market.firstActiveIndex == null) {
    return <div>Data not loaded</div>
  }

  return (
    <div {...rest} data-component={name}>
      <div className="text-xs text-secondary opacity-50">Market started trading (Inter day prices from)</div>
      <div className="text-secondary">
        <span className="font-bold">{formatIndexAsDay(market.firstActiveIndex)} </span>
        <span>{formatIndexAsDate(market.firstActiveIndex)}</span>
        {market.firstInterDayIndex > 0 && <span className="text-xs"> ({formatIndexAsDate(market.firstInterDayIndex)})</span>}
      </div>
    </div>
  )
}
