import useActiveTrades from "@/data/indexDB/hooks/useActiveTrades"
import type { HTMLAttributes, PropsWithChildren } from "react"
import TradeBadge from "../elements/TradeBadge"
import type { Settings } from "../Settings"

type ComponentProps = {
  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ActiveTradesSummary({ settings = {}, name = "ActiveTradesSummary", ...rest }: PropsWithChildren<ComponentProps>) {
  const trades = useActiveTrades()

  if (trades == null || trades?.length === 0) {
    return <div className="text-sm fg--subheading opacity-25">Active Trades Will be displayed here</div>
  }

  return (
    <div {...rest} data-controller={name}>
      <div className="ps-2 flex flex-row gap-2 items-baseline">
        {trades?.map((trade) => (
          <TradeBadge id={trade.id} key={trade.id} settings={settings} />
        ))}
      </div>
    </div>
  )
}
