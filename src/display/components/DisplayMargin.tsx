import { ONE_DAY } from "@/data/indexDB/constants/ONE_DAY"
import { Margin } from "@/data/indexDB/types/Margin"
import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import { TimerOrNothing } from "@/data/indexDB/types/Timer"
import { TradeOrNothing } from "@/data/indexDB/types/Trade"
import formatNumber from "@/utilities/formatNumber"
import formatValue from "@/utilities/formatValue"
import { type HTMLAttributes, type PropsWithChildren } from "react"

type ComponentSettings = {
  showMultiples?: boolean | null | undefined
}

type ComponentProps = {
  market?: MarketOrNothing
  price?: PriceOrNothing
  trade?: TradeOrNothing
  margin?: Margin | null | undefined
  timer?: TimerOrNothing

  settings?: ComponentSettings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function DisplayMargin({ market, trade, margin, price, timer, settings, name = "DisplayMargin", ...rest }: PropsWithChildren<ComponentProps>) {
  if (trade == null || market == null) {
    return null
  }

  const { showMultiples = false } = settings || {}

  const displayCallLabel = showMultiples ? "Call" : "Buy"
  const displayPutLabel = showMultiples ? "Put" : "Sell"

  const displayClassesSizeQuarter = trade.size === 0.25 ? "btn btn-sm btn-primary" : "hidden"
  const displayClassesSizeHalf = trade.size === 0.5 ? "btn btn-sm btn-primary" : "hidden"
  const displayClassesSizeOne = trade.size === 1 ? "btn btn-sm btn-primary" : "hidden"
  const displayClassesSizeTwo = trade.size === 2 ? "btn btn-sm btn-primary" : "hidden"

  const classNamesBuy = trade.direction === "CALL" ? "btn btn-sm btn-primary btn-buy" : "hidden"
  const classNamesSell = trade.direction === "PUT" ? "btn btn-sm btn-primary btn-sell" : "hidden"

  const currentIndex = timer?.currentIndex ?? 0
  const expiryIndex = trade.expiryIndex ?? 0

  const daysLeft = expiryIndex - currentIndex

  const classNamesDaysLeft = daysLeft < 7 ? "text-warning text-xs" : "fg--subheading text-xs"

  let contractPrefix = ""
  let contractSuffix = ""

  if (trade.size === 0.25) {
    contractPrefix = "of a"
  } else if (trade.size === 0.5) {
    contractPrefix = "a"
  } else if (trade.size === 2) {
    contractSuffix = "s"
  }

  let classNamePrice = "0"
  let classNameOutcome = "rounded-lg p-2 bg-bg-neutral"

  let displayCurrentPrice
  let displayCurrentProfit = "0"
  let displayCurrentProfitPrefix = "No Profit/Loss yet"

  if (margin?.currentProfit != null && margin?.currentProfit != 0) {
    classNamePrice = margin.currentProfit > 0 ? "text-profit" : "text-loss"
    classNameOutcome = margin.currentProfit > 0 ? "rounded-lg p-2 bg-profit" : "rounded-lg p-2 bg-loss"
  }

  if (price?.isMarketClosed) {
    displayCurrentPrice = trade.direction === "CALL" ? price?.priorClosingBid : price?.currentClosingAsk
  } else {
    displayCurrentPrice = trade.direction === "CALL" ? price?.currentBid : price?.currentAsk
  }

  if (displayCurrentPrice != null) {
    displayCurrentPrice = "(" + formatNumber(displayCurrentPrice, 6) + ")"
  }

  if (margin?.currentProfit != null) {
    displayCurrentProfit = formatValue(Math.abs(margin?.currentProfit ?? 0), false)
    displayCurrentProfitPrefix = margin.currentProfit > 0 ? "Profit at last close" : "Loss at last close"
  }

  return (
    <div {...rest} data-controller={name}>
      <div className="p-2">
        <div className="divider">I currently own</div>
        <div className="flex flex-col justify-start items-center p-2 gap-4">
          <div className="flex flex-row gap-2 justify-center items-center">
            {showMultiples && <button className={displayClassesSizeQuarter}>Quarter</button>}
            {showMultiples && <button className={displayClassesSizeHalf}>Half</button>}
            <button className={displayClassesSizeOne}>One</button>
            {showMultiples && <button className={displayClassesSizeTwo}>Two</button>}
            <div>
              <span>{contractPrefix}</span> Contract<span>{contractSuffix}</span>
            </div>
          </div>

          <div className="flex flex-row gap-2 justify-center items-center">
            <div>To</div>
            <button className={classNamesBuy}>{displayCallLabel}</button>
            <button className={classNamesSell}>{displayPutLabel}</button>
            <div>{market?.name}</div>
            <div className="fg--subheading">@</div>
            <div className={classNamePrice}>{formatNumber(trade.entryPrice)}</div>
            <div className="fg--subheading text-xs">{displayCurrentPrice}</div>
          </div>

          <div className="flex flex-row gap-2 justify-center items-center">
            <div className={classNamesDaysLeft}>Due for delivery in {daysLeft} days</div>
          </div>

          {/* <button className="btn  btn-primary rounded-3xl " onClick={handlePlaceOrder}>
            Place the order
          </button> */}
          <div className="flex flex-row gap-2 justify-center items-center">
            <div className="fg--subheading">{displayCurrentProfitPrefix}</div>
            <div className={classNameOutcome}>{displayCurrentProfit}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
