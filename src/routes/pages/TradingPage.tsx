import timerStart from "@/data/indexDB/controllers/timerStart"
import timerStop from "@/data/indexDB/controllers/timerStop"
import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"
import useActiveSymbols from "@/data/indexDB/hooks/useActiveSymbols"
import contractOpen from "@/data/indexDB/managers/contractOpen"
import useContentSelection from "@/data/localStorage/hooks/useContentSelection"
import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"
import useRangeSelection from "@/data/localStorage/hooks/useRangeSelection"
import SymbolManager from "@/display/coordinators/SymbolManager"
import TradingFooter from "@/display/coordinators/TradingFooter"
import TradingHeader from "@/display/coordinators/TradingHeader"
import { Settings } from "@/display/Settings"
import sizeForCount from "@/utilities/sizeForCount"
import { act, type HTMLAttributes, type PropsWithChildren } from "react"
import { TbRuler3 } from "react-icons/tb"
import { useParams } from "react-router-dom"

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

  const handleAction = async ({ action, options }: any) => {
    const { symbol, size, direction } = options

    timerStop(true)

    // alert(JSON.stringify({ action, options: { symbol, size, direction } }, null, 2))

    switch (action) {
      case "contractOpen":
        await contractOpen(symbol, size, direction)
        break
    }

    timerStart(ScenarioSpeed.Slow)

    // contractOpen(symbol,size,direction)

    // tradeQuote(symbol, amount, direction, stop, take, expiry)
    // tradeConfirm(id)
    // tradeClose(id)

    // optionQuote(symbol, amount, call, put, american, strike, expiry)
    // optionConfirm(id)
    // optionExercise(id)
    // optionCancelQuote(id)
    // optionCancel(id)
  }

  const settings = {
    view: "expanded",
    content: "both",
    behaviors: "off",
    actions: "on",
    trade: "contract",

    range,

    showMultiples: true,
    showDescription: true,

    onAction: handleAction,
  } as Settings

  return (
    <div {...rest} data-component={name}>
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
  )
}
