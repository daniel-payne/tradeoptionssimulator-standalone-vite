import { MarketOrNothing } from "@/data/indexDB/types/Market"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  market: MarketOrNothing
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketNameDescription({ market, name = "MarketNameDescription", ...rest }: PropsWithChildren<ComponentProps>) {
  if (market == null) {
    return
  }

  const showDescription = market.description?.length > 0

  return (
    <div {...rest} data-component={name}>
      <div className="truncate">
        <span className="text-xl font-semibold text-primary">{market.name}</span>
        {showDescription && <span className="ps-2 text-secondary text-sm"> {market.description}</span>}
      </div>
    </div>
  )
}
