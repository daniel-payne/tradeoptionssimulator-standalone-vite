import { MarketOrNothing } from "@/data/indexDB/types/Market"

import type { HTMLAttributes, PropsWithChildren } from "react"

import MarketNameDescription from "./MarketNameDescription"
import MarketContractDescription from "./MarketContractDescription"
import MarketSummaryDescription from "./MarketSummaryDescription"
import ohlcLoadFor from "@/data/indexDB/controllers/ohlcLoadFor"
import MarketBehaviors from "./MarketBehaviors"
import { MarketDisplay } from "@/data/indexDB/enums/MarketDisplay"
import SparklineManager from "@/display/coordinators/ClosesManager"

type ComponentProps = {
  market: MarketOrNothing

  favorites?: Array<string>

  display?: MarketDisplay

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketDetails({ market, display, favorites, name = "ScenarioOverview", ...rest }: PropsWithChildren<ComponentProps>) {
  if (market == null) {
    return
  }

  const isFavorite = favorites?.includes(market.symbol)
  const hasPrices = (market.priceCount ?? 0) > 0
  const hasNoPrices = !hasPrices

  return (
    <div {...rest} data-component={name}>
      <div className="rounded-xl p-4 bg-base-300 shadow-xl">
        <div className="p-2">
          <div className="flex flex-row justify-between ">
            <MarketNameDescription market={market} />
            {favorites != null && <MarketBehaviors market={market} isFavorite={isFavorite} />}
          </div>
          {display === MarketDisplay.Info && (
            <>
              <div className="flex flex-col gap-2 pt-2">
                <MarketContractDescription market={market} />
                <MarketSummaryDescription market={market} />
              </div>
              {hasNoPrices && (
                <div className="flex flex-row justify-end">
                  <button className="btn btn-sm btn-primary" disabled={market.priceCount > 0} onClick={() => ohlcLoadFor(market.symbol)}>
                    Load Data
                  </button>
                </div>
              )}
            </>
          )}
          {display === MarketDisplay.Line && <SparklineManager symbol={market?.symbol} />}
        </div>
      </div>
    </div>
  )
}
