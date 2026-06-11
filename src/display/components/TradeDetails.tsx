import type { Trade } from "@/data/indexDB/types/Trade"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  trade: Trade

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradeDetails({ trade, name = "TradeDetails", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <div className="rounded-xl p-4 bg-base-300 shadow-xl min-w-64">
        <div className="p-2">
          <pre>{JSON.stringify(trade, null, 2)}</pre>
          {/* <MarketNameDescription market={market} />
          <MarketContractDescription className="py-2" market={market} />
          <MarketSummaryDescription className="py-2" market={market} />

          <div className="flex flex-row justify-end">
            <button className="btn btn-sm btn-primary" disabled={market.priceCount > 0} onClick={() => ohlcLoadFor(market.symbol)}>
              {market.priceCount ?? "Load Data"}
            </button>
          </div> */}
        </div>
      </div>
    </div>
  )
}
