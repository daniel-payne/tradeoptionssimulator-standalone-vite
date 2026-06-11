import { useState, type HTMLAttributes, type PropsWithChildren } from "react"

import StartContract from "@/display/controllers/StartContract"
import StopContract from "@/display/controllers/StopContract"

import DisplayMargin from "@/display/components/DisplayMargin"
import ContractDescription from "@/display/components/ContractDescription"
import DisplayOutcome from "@/display/components/DisplayOutcome"

import type { MarketOrNothing } from "@/data/indexDB/types/Market"
import type { PriceOrNothing } from "@/data/indexDB/types/Price"
import type { TradeOrNothing } from "@/data/indexDB/types/Trade"
import type { TimerOrNothing } from "@/data/indexDB/types/Timer"
import type { MarginOrNothing } from "@/data/indexDB/types/Margin"

import closeContract from "@/data/indexDB/controllers/tradeClose"

import { Settings } from "../Settings"

type ComponentProps = {
  market: MarketOrNothing

  timer?: TimerOrNothing
  price?: PriceOrNothing
  margin?: MarginOrNothing | null | undefined

  currentTrade?: TradeOrNothing
  lastTrade?: TradeOrNothing

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ContractController({
  market,
  price,
  currentTrade,
  lastTrade,
  margin,
  timer,

  settings = {},

  name = "ContractManager",
  ...rest
}: PropsWithChildren<ComponentProps>) {
  const [showOutcome, setShowOutcome] = useState(false)

  const { showMultiples = false } = settings

  const displayInstructions = showMultiples ? "Instructions to Broker" : "Instructions to Market"

  const handleStartAgain = async () => {
    setShowOutcome(false)
  }

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full overflow-auto">
        <div className="text-info p-2 text-lg font-bold">{displayInstructions}</div>

        <ContractDescription market={market} price={price} timer={timer} settings={settings} />
        {currentTrade == null && showOutcome === false && <StartContract market={market} price={price} settings={settings} />}
        {currentTrade != null && <StopContract market={market} price={price} trade={currentTrade} settings={settings} />}
        {currentTrade != null && <DisplayMargin market={market} price={price} trade={currentTrade} margin={margin} timer={timer} settings={settings} />}
        {lastTrade != null && showOutcome === true && <DisplayOutcome market={market} trade={lastTrade} margin={margin} onStartAgain={handleStartAgain} />}

        {/* <pre>{JSON.stringify(currentTrade, null, 2)}</pre> */}
      </div>
    </div>
  )
}
