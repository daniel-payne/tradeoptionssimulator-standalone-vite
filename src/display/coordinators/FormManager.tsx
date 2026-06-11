import type { HTMLAttributes, PropsWithChildren } from "react"

import ContractController from "@/display/controllers/ContractController"

import useTimer from "@/data/indexDB/hooks/useTimer"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import useInactiveLatestTradeFor from "@/data/indexDB/hooks/useInactiveLatestTradeFor"
import useActiveLatestTradeFor from "@/data/indexDB/hooks/useActiveLatestTradeFor"

import calculateMarginFor from "@/data/indexDB/calculate/computeMarginFor"

import type { Settings } from "@/display/Settings"

type ComponentProps = {
  symbol: string

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function FormManager({ symbol, settings = {}, name = "TradingManager", ...rest }: PropsWithChildren<ComponentProps>) {
  const timer = useTimer()
  const market = useMarketFor(symbol)
  const price = usePriceFor(symbol)

  const currentTrade = useActiveLatestTradeFor(symbol)
  const lastTrade = useInactiveLatestTradeFor(symbol)

  const { trade = "contract" } = settings

  const margin = calculateMarginFor(currentTrade, market, price)

  return (
    <div {...rest} data-controller={name}>
      {trade === "contract" && (
        <ContractController
          className="h-full w-full"
          timer={timer}
          market={market}
          price={price}
          margin={margin}
          currentTrade={currentTrade}
          lastTrade={lastTrade}
          settings={settings}
        />
      )}
    </div>
  )
}
