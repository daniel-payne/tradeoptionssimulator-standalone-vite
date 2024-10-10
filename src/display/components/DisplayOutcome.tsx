import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import { Margin } from "@/data/indexDB/types/Margin"
import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { TradeOrNothing } from "@/data/indexDB/types/Trade"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatNumber from "@/utilities/formatNumber"

import formatValue from "@/utilities/formatValue"
import type { HTMLAttributes, PropsWithChildren } from "react"
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6"

type ComponentProps = {
  market?: MarketOrNothing
  trade?: TradeOrNothing
  margin?: Margin | null | undefined

  onStartAgain?: () => void

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function DisplayOutcome({ market, trade, margin, onStartAgain, name = "DisplayOutcome", ...rest }: PropsWithChildren<ComponentProps>) {
  if (trade == null) {
    return <div>Outcome not found </div>
  }
  if (trade.entryPrice == null || trade.exitPrice == null) {
    return <div>Outcome not found </div>
  }

  const isClosed = trade.status === TradeStatus.Closed

  const profit = isClosed ? trade.profit : margin?.currentProfit ?? 0

  const displayProfit = formatValue(profit)

  let classNameProfit = "w-24 text-center rounded-lg p-2"
  classNameProfit += profit > 0 ? " bg-profit " : " bg-loss"

  const handleStartAgain = () => {
    if (onStartAgain) {
      onStartAgain()
    }
  }

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="divider">My last trade was</div>
        <div className="flex flex-col justify-start items-center p-2 gap-4">
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className="flex flex-row gap-2 justify-center items-center">
              <div>{trade?.direction}</div>
              <div>{formatValue(trade?.entryValue, false, "USD")}</div>
              <div className="text-xs fg--subheading">{trade?.direction === "CALL" ? <FaArrowTrendUp /> : <FaArrowTrendDown />}</div>
              <div>{formatValue(trade?.exitValue, false, "USD")}</div>
              <div className={classNameProfit}>{displayProfit}</div>
            </div>
          </div>
        </div>
        <div className="h-4">&nbsp;</div>
        <div className="flex flex-row gap-2 justify-center items-baseline">
          <button className="btn  btn-primary rounded-3xl " onClick={handleStartAgain}>
            Continue Trading
          </button>
        </div>
      </div>
    </div>
  )
}
