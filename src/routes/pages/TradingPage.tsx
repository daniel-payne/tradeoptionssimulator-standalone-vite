import timerStart from "@/data/indexDB/controllers/timerStart"
import timerStop from "@/data/indexDB/controllers/timerStop"
import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"

import tradeClose from "@/data/indexDB/controllers/tradeClose"
import contractOpen from "@/data/indexDB/controllers/contractOpen"

import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"
import useRangeSelection from "@/data/localStorage/hooks/useRangeSelection"
import BalanceModal from "@/display/coordinators/BalanceModal"
import SymbolManager from "@/display/coordinators/SymbolManager"
import TradingFooter from "@/display/coordinators/TradingFooter"
import TradingHeader from "@/display/coordinators/TradingHeader"
import { Settings } from "@/display/Settings"
import sizeForCount from "@/utilities/sizeForCount"
import { type HTMLAttributes, type PropsWithChildren } from "react"

import { useParams } from "react-router"
import actionProcess from "@/data/indexDB/controllers/actionProcess"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradingPage({ name = "TradingPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const { symbols } = useParams()

  const favoriteSymbols = useFavoriteList()
  const range = useRangeSelection("1m")

  if (symbols === undefined) {
    return
  }

  const symbolList = symbols?.split(",")

  const displayWrapperClassName = "h-full w-full min-h-0 min-w-0 flex flex-row flex-wrap overflow-hidden justify-start items-start"

  const displayClassName = sizeForCount(symbolList.length ?? 1) + " p-2"

  // const handleAction = async ({ action, options }: any) => {
  //   const { symbol, size, direction, id } = options

  //   timerStop(true)

  //   // alert(JSON.stringify({ action, options: { symbol, size, direction } }, null, 2))

  //   // contractOpen(symbol,size,direction)

  //   // tradeQuote(symbol, amount, direction, stop, take, expiry)
  //   // quoteConfirm(id)
  //   // tradeClose(id)

  //   // optionQuote(symbol, amount, call, put, american, strike, expiry)
  //   // optionExercise(id)
  //   // optionCancelQuote(id)
  //   // optionCancel(id)

  //   switch (action) {
  //     case "contractOpen":
  //       await contractOpen(symbol, size, direction)
  //       break
  //     case "tradeClose":
  //       await tradeClose(id)
  //       break
  //   }

  //   timerStart(ScenarioSpeed.Slow)
  // }

  const settings = {
    view: "expanded",
    content: "chart",
    behaviors: "off",
    actions: "on",
    trade: "contract",

    range,

    showMultiples: true,
    showDescription: true,

    onAction: actionProcess,
  } as Settings

  return (
    <div {...rest} data-component={name}>
      <BalanceModal />
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col">
          <TradingHeader />
          <div className="flex-auto p-2">
            <div className={displayWrapperClassName}>
              {symbolList.map((symbol) => {
                return (
                  <div className={displayClassName} key={symbol}>
                    <div className="h-full w-full">
                      <SymbolManager className="h-full w-full" symbol={symbol} settings={settings} favoriteSymbols={favoriteSymbols} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <TradingFooter />
        </div>
      </div>
    </div>
  )
}
