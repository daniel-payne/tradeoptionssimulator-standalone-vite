import type { HTMLAttributes, PropsWithChildren } from "react"

import type { Settings } from "../Settings"
import useTradeFor from "@/data/indexDB/hooks/useTradeFor"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import formatValue from "@/utilities/formatValue"
import useVariationMarginFor from "@/data/indexDB/hooks/useVariationMarginFor"

import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"
import formatValueAsContractFraction from "@/utilities/formatValueAsContractFraction"
import { TradeDirection } from "@/data/indexDB/enums/TradeDirection"
import TradeChart from "../elements/TradeChart"
import useClosesFor from "@/data/indexDB/hooks/useClosesFor"

type ComponentProps = {
  id: string

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradeSummary({ id, name = "TradeSummary", ...rest }: PropsWithChildren<ComponentProps>) {
  const trade = useTradeFor(id)
  const market = useMarketFor(trade?.symbol)
  const margin = useVariationMarginFor(id)

  const closes = useClosesFor(trade?.symbol)

  const currentProfit = margin?.currentProfit ?? trade?.profit ?? 0

  const profitClassName = currentProfit > 0 ? "text-profit" : "text-loss"

  const directionIcon =
    trade?.direction === TradeDirection.Call ? <FaArrowTrendUp className="text-secondary text-sm" /> : <FaArrowTrendDown className="text-secondary text-sm" />

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full rounded-xl p-4 bg-base-300 shadow-xl relative" key={trade?.id}>
        <div className="text-secondary text-4xl opacity-25 absolute top-3 right-4">{trade?.no}</div>
        <div className="h-full w-full flex flex-col items-stretch gap-2 z-10">
          <div className="text-primary text-xl">{market?.name}</div>
          <div className="flex flex-row justify-between items-center gap-2">
            <div className="flex flex-row justify-start items-center gap-2">
              <div className="text-primary">{trade?.direction}</div>
              {directionIcon}
              <div>{formatValue(trade?.amount)}</div>
              <div className="text-secondary text-xs">{formatValueAsContractFraction(trade?.size)}</div>
            </div>
            <div className={profitClassName}>{formatValue(currentProfit, false)}</div>
          </div>

          <TradeChart className="h-40 w-full" closes={closes} trade={trade} margin={margin} />
          {/* <div className="flex-auto overflow-y-auto overflow-x-hidden w-full">
            <pre>{JSON.stringify(margin, null, 2)}</pre>
          </div> */}
        </div>
      </div>
    </div>
  )
}
