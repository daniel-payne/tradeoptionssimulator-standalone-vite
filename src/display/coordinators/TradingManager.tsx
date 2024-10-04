import type { HTMLAttributes, PropsWithChildren } from "react"
import ContractController from "../controllers/ContractController"
import useTimer from "@/data/indexDB/hooks/useTimer"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import useTradeSelection from "@/data/localStorage/hooks/useTradeSelection"

import useInactiveLatestTradeFor from "@/data/indexDB/hooks/useInactiveLatestTradeFor"
import useActiveLatestTradeFor from "@/data/indexDB/hooks/useActiveLatestTradeFor"
import calculateMarginFor from "@/data/indexDB/calculate/calculateMarginFor"

type ComponentProps = {
  symbol: string

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradingManager({ symbol, name = "TradingManager", ...rest }: PropsWithChildren<ComponentProps>) {
  const timer = useTimer()
  const market = useMarketFor(symbol)
  const price = usePriceFor(symbol)

  const currentTrade = useActiveLatestTradeFor(symbol)
  const lastTrade = useInactiveLatestTradeFor(symbol)

  //const margin = useMarginFor(currentTrade?.id)

  const display = useTradeSelection("contract")

  const showMultiples = display === "contract" ? false : true

  const margin = calculateMarginFor(currentTrade, market, price)

  return (
    <div {...rest} data-controller={name}>
      {display === "contract" && (
        <ContractController
          className="h-full w-full"
          timer={timer}
          market={market}
          price={price}
          margin={margin}
          currentTrade={currentTrade}
          lastTrade={lastTrade}
          showMultiples={showMultiples}
        />
      )}
    </div>
  )
}
