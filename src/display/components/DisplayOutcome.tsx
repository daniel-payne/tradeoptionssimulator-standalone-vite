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

  // const isOpen = trade.status === TradeStatus.OPEN
  const isClosed = trade.status === TradeStatus.Closed

  const profit = isClosed ? trade.profit : margin?.currentProfit ?? 0
  const movement = isClosed ? trade.exitPrice - trade.entryPrice : margin?.currentPrice - trade.entryPrice
  const percent = (movement / trade.entryPrice) * 100

  const displayMovement = formatNumber(movement)
  const classNameMovement = movement > 0 ? "text-xl text-profit" : "text-xl text-loss"

  const displayProfit = formatValue(profit)
  const classNameProfit = profit > 0 ? "w-24 text-center rounded-lg p-2 bg-profit" : "w-24 text-center rounded-lg p-2 bg-loss"

  const handleStartAgain = () => {
    if (onStartAgain) {
      onStartAgain()
    }
  }

  return (
    <div {...rest} data-component={name}>
      <div className="p-2">
        <div className="divider">My last trade was for</div>
        <div className="flex flex-col justify-start items-center p-2 gap-4">
          {/* 1 */}
          <div className="flex flex-row gap-2 justify-center items-baseline">
            <div>{trade?.size} contract</div>
          </div>
          {/* 2 */}
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className="text-xs fg--subheading">
              {market?.contractName} for delivery on {formatIndexAsDate(trade?.expiryIndex)}
            </div>
          </div>
          {/* 3 */}
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className="flex flex-row gap-2 justify-center items-center">
              <div>{trade?.direction}</div>
              <div className="text-xs fg--subheading">{trade?.direction === "CALL" ? <FaArrowTrendUp /> : <FaArrowTrendDown />}</div>
            </div>
            <div>{formatValue(trade?.amount, false, "USD")}</div>
          </div>
          {/* 4 */}
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className="text-xs fg--subheading">{trade?.direction === "CALL" ? "buy now - sell later" : "sell now - buy later"}</div>
          </div>
          {/* 5 */}
          <div className="flex flex-row gap-2 justify-center items-baseline">
            <div>{trade?.entryPrice}</div>
            <div className={classNameMovement}>{displayMovement}</div>
            <div>{trade?.exitPrice}</div>
          </div>
          {/* 6 */}
          <div className="flex flex-row gap-2 justify-center items-baseline">
            <div className={classNameMovement}>
              <div className="text-xs">{formatNumber(percent, 4)}% </div>
            </div>
          </div>
          {/* 7 */}
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className={classNameProfit}>{displayProfit}</div>
          </div>
        </div>
        <div className="divider" />
        <div className="flex flex-row gap-2 justify-center items-baseline">
          <button className="btn  btn-primary rounded-3xl " onClick={handleStartAgain}>
            Continue Trading
          </button>
        </div>
      </div>
    </div>
  )
}
