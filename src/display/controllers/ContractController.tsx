import { setState } from "@keldan-systems/state-mutex"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import StartContract from "./StartContract"

// import openContract from "@/data/indexDB/controllers/openContract"
// import closeContract from "@/data/indexDB/controllers/closeContract"

import StopContract from "./StopContract"
import DisplayMargin from "../components/DisplayMargin"
import ContractDescription from "../components/ContractDescription"
import DisplayOutcome from "../components/DisplayOutcome"

import timerStart from "@/data/indexDB/controllers/timerStart"

import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"

import type { MarketOrNothing } from "@/data/indexDB/types/Market"
import type { PriceOrNothing } from "@/data/indexDB/types/Price"
import type { TradeOrNothing } from "@/data/indexDB/types/Trade"
import type { TimerOrNothing } from "@/data/indexDB/types/Timer"
import type { Margin } from "@/data/indexDB/types/Margin"
import openContract from "@/data/indexDB/managers/contractOpen"
import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"
import closeContract from "@/data/indexDB/managers/contractClose"
import timerStop from "@/data/indexDB/controllers/timerStop"

type ComponentProps = {
  market: MarketOrNothing

  timer?: TimerOrNothing
  price?: PriceOrNothing
  margin?: Margin | null | undefined

  currentTrade?: TradeOrNothing
  lastTrade?: TradeOrNothing

  showMultiples?: boolean

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ContractController({
  market,
  price,
  currentTrade,
  lastTrade,
  margin,
  timer,

  showMultiples = true,

  name = "ContractManager",
  ...rest
}: PropsWithChildren<ComponentProps>) {
  const [showOutcome, setShowOutcome] = useState(false)

  const symbol = market?.symbol

  const displayInstructions = showMultiples ? "Instructions to Broker" : "Instructions to Market"

  const handleOpenContract = async (settings: any) => {
    if (symbol) {
      const { direction, size } = settings

      await openContract(timer, market, price, direction, size)

      timerStart(ScenarioSpeed.Slow)
    }
  }

  const handleCloseContract = async () => {
    if (currentTrade) {
      await closeContract(timer, market, price, currentTrade)

      timerStop()

      setShowOutcome(true)
    }
  }

  const handleStartAgain = async () => {
    setShowOutcome(false)
  }

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full ">
        <div className="text-info p-2 text-lg font-bold">{displayInstructions}</div>

        <ContractDescription market={market} price={price} timer={timer} settings={{ showMultiples }} />
        {currentTrade == null && showOutcome === false && (
          <StartContract market={market} price={price} settings={{ showMultiples }} onOrder={handleOpenContract} />
        )}
        {currentTrade != null && <StopContract market={market} price={price} trade={currentTrade} settings={{ showMultiples }} onOrder={handleCloseContract} />}
        {currentTrade != null && (
          <DisplayMargin market={market} price={price} trade={currentTrade} margin={margin} timer={timer} settings={{ showMultiples }} />
        )}
        {lastTrade != null && showOutcome === true && <DisplayOutcome market={market} trade={lastTrade} margin={margin} onStartAgain={handleStartAgain} />}

        {/* <pre>{JSON.stringify(currentTrade, null, 2)}</pre> */}
      </div>
    </div>
  )
}
