import type { HTMLAttributes, PropsWithChildren } from "react"
import { Settings } from "../Settings"
import ContractOpenActions from "../components/ContractOpenActions"
// import { MarketOrNothing } from "@/data/indexDB/types/Market"
// import { PriceOrNothing } from "@/data/indexDB/types/Price"
// import useTimer from "@/data/indexDB/hooks/useTimer"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import useActiveLatestTradeFor from "@/data/indexDB/hooks/useActiveLatestTradeFor"
// import useInactiveLatestTradeFor from "@/data/indexDB/hooks/useInactiveLatestTradeFor"
import ContractCloseAction from "../components/ContractCloseAction"
import TradePositionDisplay from "../components/TradePositionDisplay"
import useVariationMarginFor from "@/data/indexDB/hooks/useVariationMarginFor"
// import formatValue from "@/utilities/formatValue"
import computeContractValueFor from "@/data/indexDB/calculate/computeContractValueFor"

type ComponentProps = {
  symbol?: string

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ActionManager({ symbol, settings = {}, name = "TradingActions", children, ...rest }: PropsWithChildren<ComponentProps>) {
  const { trade = "contract" } = settings

  // const timer = useTimer()
  const market = useMarketFor(symbol)
  const price = usePriceFor(symbol)

  const currentTrade = useActiveLatestTradeFor(symbol)
  // const lastTrade = useInactiveLatestTradeFor(symbol)

  const margin = useVariationMarginFor(currentTrade?.id)

  if (symbol == null) {
    return
  }

  const contractValue = computeContractValueFor(market, price)

  return (
    <div {...rest} data-component={name}>
      {trade === "contract" && currentTrade == null && <ContractOpenActions symbol={symbol} contractValue={contractValue} settings={settings} />}
      {trade === "contract" && currentTrade != null && (
        <div className="flex flex-row gap-2 items-center">
          <TradePositionDisplay margin={margin} settings={settings} />
          <ContractCloseAction trade={currentTrade} settings={settings} />
        </div>
      )}
    </div>
  )
}
