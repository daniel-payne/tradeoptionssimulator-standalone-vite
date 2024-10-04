import type { HTMLAttributes, PropsWithChildren } from "react"

import MarketContractDescription from "../components/MarketContractDescription"
import MarketSummaryDescription from "../components/MarketSummaryDescription"

import useMarketFor from "@/data/indexDB/hooks/useMarketFor"

import usePriceFor from "@/data/indexDB/hooks/usePriceFor"

import MarketHeader from "../components/MarketHeader"
import MarketFooter from "../components/MarketFooter"
import TradingManager from "./TradingManager"

import MarketPriceDescription from "../components/MarketPriceDescription"

import useViewSelection from "@/data/localStorage/hooks/useViewSelection"
import useContentSelection from "@/data/localStorage/hooks/useContentSelection"

import ClosesManager from "./ClosesManager"
import HighLowManager from "./HighLowManager"
import useActiveTradesFor from "@/data/indexDB/hooks/useActiveTradesFor"
import { View } from "../controllers/ViewChooser"
import { Content } from "../controllers/ContentChooser"
import { Behavior } from "../controllers/BehaviorSelector"
import { Action } from "../controllers/ActionSelector"

type ComponentProps = {
  symbol: string

  defaultView?: View
  defaultContent?: Content
  defaultBehaviors?: Behavior
  defaultActions?: Action

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function SymbolManager({
  symbol,

  defaultView,
  defaultContent,
  defaultBehaviors,
  defaultActions,

  name = "SymbolManager",
  ...rest
}: PropsWithChildren<ComponentProps>) {
  const market = useMarketFor(symbol)
  const price = usePriceFor(symbol)

  const view = useViewSelection(defaultView ?? "expanded")
  const content = useContentSelection(defaultContent ?? "both")

  if (market == null || price == null) {
    return null
  }

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full rounded-xl p-4 bg-base-300 shadow-xl ">
        <div className="h-full w-full flex flex-col gap-2 ">
          <MarketHeader market={market} defaultBehaviors={defaultBehaviors} />
          <div className="flex-auto overflow-auto">
            {view === "expanded" && (
              <div className="h-full w-full relative">
                {content === "info" && (
                  <>
                    <MarketContractDescription market={market} />
                    <MarketSummaryDescription market={market} />
                  </>
                )}
                {content === "price" && <MarketPriceDescription market={market} price={price} />}
                {content === "sparkline" && <ClosesManager className="h-full w-full" symbol={symbol} />}
                {content === "chart" && <HighLowManager className="h-full w-full" symbol={symbol} />}
                {content === "form" && <TradingManager className="h-full w-full " symbol={symbol} />}
                {content === "both" && (
                  <div className="h-full w-full flex flex-row gap-2">
                    <div className="flex-auto">
                      <HighLowManager className="h-full w-full" symbol={symbol} />
                    </div>
                    <div className="w-96 border border-primary rounded-lg overflow-auto">
                      <TradingManager className="h-full w-full " symbol={symbol} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <MarketFooter market={market} price={price} defaultActions={defaultActions} />
        </div>
      </div>
    </div>
  )
}

/*


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
          {display === MarketDisplay.Line && <SymbolSparkline symbol={market?.symbol} />}
            </div>

*/
