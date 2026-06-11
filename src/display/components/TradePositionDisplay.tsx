import { MarginOrNothing } from "@/data/indexDB/types/Margin"
import type { HTMLAttributes, PropsWithChildren } from "react"
import { Settings } from "../Settings"
import formatNumber from "@/utilities/formatNumber"
import formatValue from "@/utilities/formatValue"

type ComponentProps = {
  margin?: MarginOrNothing

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradePositionDisplay({ margin, settings = {}, name = "TradePositionDisplay", children, ...rest }: PropsWithChildren<ComponentProps>) {
  let classNamePrice = "0"
  let classNameOutcome = "text-sm rounded-lg p-2 bg-bg-neutral"

  let displayCurrentPrice
  let displayCurrentProfit = "0"
  let displayCurrentProfitPrefix = "No Profit/Loss yet"

  if (margin?.currentProfit != null && margin?.currentProfit != 0) {
    classNamePrice = margin.currentProfit > 0 ? "text-profit" : "text-loss"
    classNameOutcome = margin.currentProfit > 0 ? "text-sm rounded-lg p-2 bg-profit" : "text-sm rounded-lg p-2 bg-loss"
  }

  if (displayCurrentPrice != null) {
    displayCurrentPrice = "(" + formatNumber(displayCurrentPrice, 6) + ")"
  }

  if (margin?.currentProfit != null) {
    displayCurrentProfit = formatValue(Math.abs(margin?.currentProfit ?? 0), false)
    displayCurrentProfitPrefix = margin.currentProfit > 0 ? "Profit at last close" : "Loss at last close"
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className="fg--subheading">{displayCurrentProfitPrefix}</div>
        <div className={classNameOutcome}>{displayCurrentProfit}</div>
      </div>
    </div>
  )
}
