import discoverOptionPrice from "@/data/indexDB/controllers/discoverOptionPrice"
import generateAnalysis from "@/data/indexDB/controllers/generateAnalysis"
import { OptionDirection } from "@/data/indexDB/enums/OptionDirection"
import { OptionExecution } from "@/data/indexDB/enums/OptionExecution"

import { TradeDirection } from "@/data/indexDB/enums/TradeDirection"
import useActiveMarkets from "@/data/indexDB/hooks/useActiveMarkets"
import useCurrentPriceForSymbol from "@/data/indexDB/hooks/useCurrentPriceForSymbol"
import useCurrentRateForKey from "@/data/indexDB/hooks/useCurrentRateForKey"

import useCurrentVolatilityForSymbol from "@/data/indexDB/hooks/useCurrentVolatilityForSymbol"
import useTimer from "@/data/indexDB/hooks/useTimer"
import { Analysis } from "@/data/indexDB/types/Analysis"

import { Market } from "@/data/indexDB/types/Market"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"
import formatNumber from "@/utilities/formatNumber"
import formatValue from "@/utilities/formatValue"

import { ChangeEvent, useEffect, useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function BalancePage({ name = "StatusesBalancePagePage", ...rest }: PropsWithChildren<ComponentProps>) {
  const activeMarkets = useActiveMarkets()
  const timer = useTimer()

  const [symbol, setSymbol] = useState<string | undefined>(undefined)
  const [notional, setNotional] = useState<number>(1000000)
  const [showDelta, setShowDelta] = useState<boolean>(false)

  const [analysis, setAnalysis] = useState<Analysis | undefined>(undefined)

  const [showMakeCall, setShowMakeCall] = useState<boolean | undefined>(undefined)
  const [showMakePut, setShowMakePut] = useState<boolean | undefined>(undefined)
  const [showBuyCall, setShowBuyCall] = useState<number | undefined>(undefined)
  const [showSellCall, setShowSellCall] = useState<number | undefined>(undefined)
  const [showBuyPut, setShowBuyPut] = useState<number | undefined>(undefined)
  const [showSellPut, setShowSellPut] = useState<number | undefined>(undefined)

  const [showProfit, setShowProfit] = useState<boolean>(true)

  // const price = useCurrentPriceForSymbol(selectedSymbol)
  // const volatility = useCurrentVolatilityForSymbol(selectedSymbol)
  // const rate = useCurrentRateForKey("USD")

  const handleToggleDelta = () => {
    setShowDelta(!showDelta)
  }

  const handleChangeNotional = (e: ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value
    setNotional(value)
  }

  const handleChangeSelectedMarket = (market: Market | undefined) => {
    setSymbol(market?.symbol)
  }

  // const handleOnClickCost = async (data: any) => {
  //   const { cost, direction, contractDelta } = data

  //   //alert(JSON.stringify({ item, cost, direction, contractDelta, notional, selectedSymbol }, null, 2))

  //   if (symbol) {
  //     const price = await discoverOptionPrice(symbol, "USD", notional, direction, OptionExecution.European, contractDelta, 30)

  //     alert([price, cost])
  //   }
  // }

  const handleUpdateSelection = (selection: string, value: any = undefined) => {
    // alert(selection)

    if (selection === "showMakeCall") {
      setShowMakeCall(value)
    } else if (selection === "showMakePut") {
      setShowMakePut(value)
    } else if (selection === "showBuyCall") {
      setShowBuyCall(value)
    } else if (selection === "showSellCall") {
      setShowSellCall(value)
    } else if (selection === "showBuyPut") {
      setShowBuyPut(value)
    } else if (selection === "showSellPut") {
      setShowSellPut(value)
    }

    if (selection === "doNothing") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "buySomething") {
      setShowMakeCall(true)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "sellSomething") {
      setShowMakeCall(undefined)
      setShowMakePut(true)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "payBellow") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(25)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "getBellow") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(25)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "payAbove") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(25)
      setShowSellPut(undefined)
    } else if (selection === "getAbove") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(25)
    }

    if (selection === "goLong") {
      setShowMakeCall(true)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "goShort") {
      setShowMakeCall(undefined)
      setShowMakePut(true)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "buyCall") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(25)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "sellCall") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(25)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "proactivePut") {
      setShowMakeCall(true)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(-25)
      setShowSellPut(undefined)
    } else if (selection === "coveredCall") {
      setShowMakeCall(true)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(25)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "buyPut") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(25)
      setShowSellPut(undefined)
    } else if (selection === "proactiveCall") {
      setShowMakeCall(undefined)
      setShowMakePut(true)
      setShowBuyCall(-25)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(undefined)
    } else if (selection === "coveredPut") {
      setShowMakeCall(undefined)
      setShowMakePut(true)
      setShowBuyCall(undefined)
      setShowSellCall(undefined)
      setShowBuyPut(undefined)
      setShowSellPut(-25)
    } else if (selection === "riskReversal") {
      setShowMakeCall(true)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(10)
      setShowBuyPut(-5)
      setShowSellPut(undefined)
    } else if (selection === "protectiveCollar") {
      setShowMakeCall(true)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(50)
      setShowBuyPut(undefined)
      setShowSellPut(25)
    } else if (selection === "longStraddle") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(0)
      setShowSellCall(undefined)
      setShowBuyPut(0)
      setShowSellPut(undefined)
    } else if (selection === "shortStraddle") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(undefined)
      setShowSellCall(0)
      setShowBuyPut(undefined)
      setShowSellPut(0)
    } else if (selection === "doubleBull") {
      setShowMakeCall(undefined)
      setShowMakePut(undefined)
      setShowBuyCall(5)
      setShowSellCall(10)
      setShowBuyPut(-10)
      setShowSellPut(-5)
    }
    //else if (selection === "buyPut") {
    //   setShowMakeCall(undefined)
    //   setShowMakePut(undefined)
    //   setShowBuyCall(undefined)
    //   setShowSellCall(undefined)
    //   setShowBuyPut(25)
    //   setShowSellPut(undefined)
    // } else if (selection === "sellPut") {
    //   setShowMakeCall(undefined)
    //   setShowMakePut(undefined)
    //   setShowBuyCall(undefined)
    //   setShowSellCall(undefined)
    //   setShowBuyPut(undefined)
    //   setShowSellPut(25)
    // }
  }

  const handleUpdateDelta = (selection: string) => (delta: number) => {
    if (selection === "buyCall") {
      setShowBuyCall(delta)
    } else if (selection === "sellCall") {
      setShowSellCall(delta)
    } else if (selection === "buyPut") {
      setShowBuyPut(delta)
    } else if (selection === "sellPut") {
      setShowSellPut(delta)
    }
  }

  useEffect(() => {
    let selectedSymbol

    if (symbol == null) {
      selectedSymbol = activeMarkets?.[0]?.symbol

      setSymbol(selectedSymbol)
    } else {
      selectedSymbol = symbol
    }

    async function run(symbol: string, notional: number) {
      const analysis = await generateAnalysis(symbol, notional)

      setAnalysis(analysis)
    }

    if (selectedSymbol) {
      run(selectedSymbol, notional)
    }
  }, [activeMarkets, symbol, notional])

  return (
    <div {...rest} data-component={name}>
      <div className="m-4 flex flex-row flex-wrap gap-2 items-center justify-between">
        <div className=" flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Analysis</div>
        </div>
        <div className="text-secondary  ms-6">
          <strong>{formatIndexAsDay(timer?.currentIndex)}</strong> {formatIndexAsDate(timer?.currentIndex)}
        </div>
      </div>
      <div className="divider" />
      <div className="flex flex-row gap-2 p-2 items-center">
        <ActiveMarketsSelector selectedSymbol={symbol} activeMarkets={activeMarkets} onChange={handleChangeSelectedMarket} />
        <div>
          <label className="w-64 input input-bordered border-primary flex items-center gap-2">
            Notional
            <input type="text" className="grow" value={notional} onChange={handleChangeNotional} />
          </label>
        </div>
        {/* <div className="border border-secondary rounded-lg py-2 px-4">Buy at {currentAsk}</div>
        <div className="border border-secondary rounded-lg py-2 px-4">Sell at {currentBid}</div> */}
        <button className={` btn btn-primary btn-sm ${showDelta ? "" : "btn-outline"}`} onClick={handleToggleDelta}>
          Show Delta
        </button>

        {/* <div>{selectedSymbol}</div>
        <div>
          <span className="text-secondary">Ask : </span>
          {formatNumber(price?.currentAsk)}
        </div>
        <div>
          <span className="text-secondary">Bid : </span>
          {formatNumber(price?.currentBid)}
        </div>
        <div>
          <span className="text-secondary">30 : </span>
          {formatNumber(volatility?.["30"].volatility)}
        </div>
        <div>
          <span className="text-secondary">60 : </span>
          {formatNumber(volatility?.["60"].volatility)}
        </div>
        <div>
          <span className="text-secondary">90 : </span>
          {formatNumber(volatility?.["90"].volatility)}
        </div>
        <div>
          <span className="text-secondary">Rate : </span>
          {rate?.currentRate}{" "}
        </div> */}
      </div>
      <div className="divider" />
      <div className="flex flex-col gap-2 p-2">
        <ContractActions
          showMakeCall={showMakeCall}
          showMakePut={showMakePut}
          showBuyCall={showBuyCall}
          showSellCall={showSellCall}
          showBuyPut={showBuyPut}
          showSellPut={showSellPut}
          onChange={handleUpdateSelection}
        />
      </div>
      <div className="divider" />
      <div className="flex flex-col gap-2 p-2">
        <UserActions
          showMakeCall={showMakeCall}
          showMakePut={showMakePut}
          showBuyCall={showBuyCall}
          showSellCall={showSellCall}
          showBuyPut={showBuyPut}
          showSellPut={showSellPut}
          onChange={handleUpdateSelection}
        />
        <MarketActions
          showMakeCall={showMakeCall}
          showMakePut={showMakePut}
          showBuyCall={showBuyCall}
          showSellCall={showSellCall}
          showBuyPut={showBuyPut}
          showSellPut={showSellPut}
          onChange={handleUpdateSelection}
        />
      </div>
      <div className="divider" />
      <div className="flex flex-row gap-2 p-2 overflow-auto">
        {/* <ActionColumn /> */}

        {showProfit != null && (
          <ProfitBlock
            notional={notional}
            source={analysis}
            showMakeCall={showMakeCall}
            showMakePut={showMakePut}
            showBuyCall={showBuyCall}
            showSellCall={showSellCall}
            showBuyPut={showBuyPut}
            showSellPut={showSellPut}
            showDelta={showDelta}
          />
        )}

        {showMakeCall != null && <TradeBlock symbol={symbol} source={analysis?.makeCall} showDelta={showDelta} />}
        {showMakePut != null && <TradeBlock symbol={symbol} source={analysis?.makePut} showDelta={showDelta} />}

        {showBuyCall != null && (
          <OptionBlock source={analysis?.buyCall} showDelta={showDelta} selectedDelta={showBuyCall} onUpdateDelta={handleUpdateDelta("buyCall")} />
        )}
        {showSellCall != null && (
          <OptionBlock source={analysis?.sellCall} showDelta={showDelta} selectedDelta={showSellCall} onUpdateDelta={handleUpdateDelta("sellCall")} />
        )}
        {showBuyPut != null && (
          <OptionBlock source={analysis?.buyPut} showDelta={showDelta} selectedDelta={showBuyPut} onUpdateDelta={handleUpdateDelta("buyPut")} />
        )}
        {showSellPut != null && (
          <OptionBlock source={analysis?.sellPut} showDelta={showDelta} selectedDelta={showSellPut} onUpdateDelta={handleUpdateDelta("sellPut")} />
        )}
      </div>
      <div className="flex-auto overflow-auto">{/* <pre>{JSON.stringify(analysis?.buyCall.contracts[3], null, 2)}</pre> */}</div>
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ActiveMarketsSelector = ({
  activeMarkets,
  selectedSymbol,
  onChange,
}: {
  activeMarkets: Array<Market> | undefined
  selectedSymbol?: string | undefined
  onChange: (market: Market | undefined) => void
}) => {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value

    const market = activeMarkets?.find((market) => market.name === name)

    onChange(market)
  }

  return (
    <>
      <select className="select select-bordered border-primary  w-full max-w-xs" defaultValue={selectedSymbol} onChange={handleChange}>
        {activeMarkets?.map((market) => {
          return <option key={market.symbol}>{market.name}</option>
        })}
      </select>
    </>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const MakeCallIcons = ({ priceToday = false }: { priceToday?: boolean }) => {
  return (
    <div className="flex flex-row items-center gap-2 p-2">
      <div className={`font-bold ${priceToday ? "text-primary" : ""}`}>$</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold   ">▤</div>
    </div>
  )
}

const MakePutIcons = ({ priceToday = false }: { priceToday?: boolean }) => {
  return (
    <div className="flex flex-row items-center gap-2 p-2">
      <div className=" font-bold">▤</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-extrabold   ">→</div>
      <div className={`font-bold ${priceToday ? "text-primary" : ""}`}>$</div>
    </div>
  )
}

const BuyCallIcons = () => {
  return (
    <div className="flex flex-row items-baseline gap-1 p-2">
      <div className=" font-bold">$</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-extrabold opacity-30  ">↳</div>
      <div className=" font-bold  opacity-30  ">▤</div>
    </div>
  )
}

const SellCallIcons = () => {
  return (
    <div className="flex flex-row items-baseline gap-1 p-2">
      <div className=" font-bold  opacity-30 ">▤</div>
      <div className="text-xl font-extrabold opacity-30  ">↳</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-bold">→</div>
      <div className=" font-bold">$</div>
    </div>
  )
}

const BuyPutIcons = () => {
  return (
    <div className="flex flex-row items-baseline gap-1 p-2">
      <div className=" font-bold">$</div>
      <div className="text-xl font-extrabold">→</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-extrabold opacity-30  ">↱</div>
      <div className=" font-bold  opacity-30  ">▤</div>
    </div>
  )
}

const SellPutIcons = () => {
  return (
    <div className="flex flex-row items-baseline gap-1 p-2">
      <div className=" font-bold  opacity-30 ">▤</div>
      <div className="text-xl font-extrabold opacity-30  ">↱</div>
      <div className=" font-bold">•</div>
      <div className="text-xl font-bold">→</div>
      <div className=" font-bold">$</div>
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const ActionColumn = () => {
//   return (
//     <div className="flex flex-col items-center gap-4 p-2">
//       <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
//         <div className="text-secondary font-extrabold">Make Call</div>
//         <MakeCallIcons />
//       </div>

//       <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
//         <div className="text-secondary font-extrabold">Make Put</div>
//         <MakePutIcons />
//       </div>

//       <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
//         <div className="text-secondary font-extrabold">Buy Call</div>
//         <BuyCallIcons />
//       </div>

//       <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
//         <div className="text-secondary font-extrabold">Sell Call</div>
//         <SellCallIcons />
//       </div>

//       <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
//         <div className="text-secondary font-extrabold">Buy Put</div>
//         <BuyPutIcons />
//       </div>

//       <div className="w-32 border-primary border-2 rounded-xl flex flex-col items-center gap-2 p-2">
//         <div className="text-secondary font-extrabold">Sell Put</div>
//         <SellPutIcons />
//       </div>
//     </div>
//   )
// }

const ContractActions = ({ showMakeCall, showMakePut, showBuyCall, showSellCall, showBuyPut, showSellPut, onChange }: any) => {
  // const selectedClassName = "btn btn-info h-24 w-40 flex flex-col rounded-tr-none"
  // const unselectedClassName = "btn btn-info btn-outline h-24 w-40 flex flex-col rounded-br-none"
  const baseClassName = "btn btn-primary h-16 w-80 flex flex-row rounded-b-none"

  const selectedClassName = baseClassName
  const unselectedClassName = baseClassName + " btn-outline"

  const makeCallClassName = showMakeCall != null ? selectedClassName : unselectedClassName
  const makePutClassName = showMakePut != null ? selectedClassName : unselectedClassName
  const buyCallClassName = showBuyCall != null ? selectedClassName : unselectedClassName
  const sellCallClassName = showSellCall != null ? selectedClassName : unselectedClassName
  const buyPutClassName = showBuyPut != null ? selectedClassName : unselectedClassName
  const sellPutClassName = showSellPut != null ? selectedClassName : unselectedClassName

  const handleUpdateSelection = (selection: string) => () => {
    if (selection === "showMakeCall") {
      onChange(selection, showMakeCall === undefined ? true : undefined)
    } else if (selection === "showMakePut") {
      onChange(selection, showMakePut === undefined ? true : undefined)
    } else if (selection === "showBuyCall") {
      onChange(selection, showBuyCall === undefined ? 0 : undefined)
    } else if (selection === "showSellCall") {
      onChange(selection, showSellCall === undefined ? 0 : undefined)
    } else if (selection === "showBuyPut") {
      onChange(selection, showBuyPut === undefined ? 0 : undefined)
    } else if (selection === "showSellPut") {
      onChange(selection, showSellPut === undefined ? 0 : undefined)
    }
  }

  return (
    <div className="flex flex-row gap-2  items-center">
      <button className={makeCallClassName} onClick={handleUpdateSelection("showMakeCall")}>
        <div>
          Make Call <span className="opacity-50">Trade</span>
        </div>
        <MakeCallIcons />
      </button>
      <button className={makePutClassName} onClick={handleUpdateSelection("showMakePut")}>
        <div>
          Make Put <span className="opacity-50">Trade</span>
        </div>
        <MakePutIcons />
      </button>
      <button className={buyCallClassName} onClick={handleUpdateSelection("showBuyCall")}>
        <div>
          Buy Call <span className="opacity-50">Option</span>
        </div>
        <BuyCallIcons />
      </button>
      <button className={sellCallClassName} onClick={handleUpdateSelection("showSellCall")}>
        <div>
          Sell Call <span className="opacity-50">Option</span>
        </div>
        <SellCallIcons />
      </button>
      <button className={buyPutClassName} onClick={handleUpdateSelection("showBuyPut")}>
        <div>
          Buy Put <span className="opacity-50">Option</span>
        </div>
        <BuyPutIcons />
      </button>
      <button className={sellPutClassName} onClick={handleUpdateSelection("showSellPut")}>
        <div>
          Sell Put <span className="opacity-50">Option</span>
        </div>
        <SellPutIcons />
      </button>
    </div>
  )
}

const UserActions = ({ showMakeCall, showMakePut, showBuyCall, showSellCall, showBuyPut, showSellPut, onChange }: any) => {
  const selectedClassName = "btn btn-primary w-80 h-16 leading-6"
  const unselectedClassName = "btn btn-primary btn-outline w-80 h-16 leading-6"

  const handleUpdateSelection = (selection: string) => () => {
    onChange(selection)
  }

  const doNothingClassName =
    showMakeCall == null && showMakePut == null && showBuyCall == null && showSellCall == null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const sellSomethingClassName =
    showMakeCall != null && showMakePut == null && showBuyCall == null && showSellCall == null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const buySomethingClassName =
    showMakeCall == null && showMakePut != null && showBuyCall == null && showSellCall == null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const payBelowClassName =
    showMakeCall == null && showMakePut == null && showBuyCall != null && showSellCall == null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const getBelowClassName =
    showMakeCall == null && showMakePut == null && showBuyCall == null && showSellCall != null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const payAboveClassName =
    showMakeCall == null && showMakePut == null && showBuyCall == null && showSellCall == null && showBuyPut != null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const getAboveClassName =
    showMakeCall == null && showMakePut == null && showBuyCall == null && showSellCall == null && showBuyPut == null && showSellPut != null
      ? selectedClassName
      : unselectedClassName

  return (
    <div className="flex flex-row gap-2  items-center">
      <button className={doNothingClassName} onClick={handleUpdateSelection("doNothing")}>
        Do Nothing
      </button>
      <button className={sellSomethingClassName} onClick={handleUpdateSelection("buySomething")}>
        Buy Something, then sell it back
      </button>
      <button className={buySomethingClassName} onClick={handleUpdateSelection("sellSomething")}>
        Sell Something, then buy it back
      </button>
      <button className={payBelowClassName} onClick={handleUpdateSelection("payBellow")}>
        Pay Some Money to have the chance to buy below market price
      </button>
      <button className={getBelowClassName} onClick={handleUpdateSelection("getBellow")}>
        Get Some Money, and have the risk you have to sell below market price
      </button>
      <button className={payAboveClassName} onClick={handleUpdateSelection("payAbove")}>
        Pay Some Money to have the chance to sell above market price
      </button>
      <button className={getAboveClassName} onClick={handleUpdateSelection("getAbove")}>
        Get Some Money, and have the risk you have to buy above market price
      </button>
    </div>
  )
}

const MarketActions = ({ showMakeCall, showMakePut, showBuyCall, showSellCall, showBuyPut, showSellPut, onChange }: any) => {
  const selectedClassName = "btn btn-primary w-32 h-6 leading-6"
  const unselectedClassName = "btn btn-primary btn-outline w-32 h-6 leading-6"

  const handleUpdateSelection = (selection: string) => () => {
    onChange(selection)
  }

  const goLongClassName =
    showMakeCall != null && showMakePut == null && showBuyCall == null && showSellCall == null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const buyCallClassName =
    showMakeCall == null && showMakePut == null && showBuyCall != null && showSellCall == null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const proactivePutClassName =
    showMakeCall != null && showMakePut == null && showBuyCall == null && showSellCall == null && showBuyPut != null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const coveredCallClassName =
    showMakeCall != null && showMakePut == null && showBuyCall == null && showSellCall != null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const goShortClassName =
    showMakeCall == null && showMakePut != null && showBuyCall == null && showSellCall == null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const buyPutClassName =
    showMakeCall == null && showMakePut == null && showBuyCall == null && showSellCall == null && showBuyPut != null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const proactiveCallClassName =
    showMakeCall == null && showMakePut != null && showBuyCall != null && showSellCall == null && showBuyPut == null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const coveredPutClassName =
    showMakeCall == null && showMakePut != null && showBuyCall == null && showSellCall == null && showBuyPut == null && showSellPut != null
      ? selectedClassName
      : unselectedClassName

  const riskReversalClassName =
    showMakeCall != null && showMakePut == null && showBuyCall == null && showSellCall != null && showBuyPut != null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const protectiveCollarClassName =
    showMakeCall != null && showMakePut == null && showBuyCall == null && showSellCall != null && showBuyPut == null && showSellPut != null
      ? selectedClassName
      : unselectedClassName

  const longStraddleClassName =
    showMakeCall == null && showMakePut == null && showBuyCall != null && showSellCall == null && showBuyPut != null && showSellPut == null
      ? selectedClassName
      : unselectedClassName

  const shortStraddleClassName =
    showMakeCall == null && showMakePut == null && showBuyCall == null && showSellCall != null && showBuyPut == null && showSellPut != null
      ? selectedClassName
      : unselectedClassName

  const doubleBullClassName =
    showMakeCall == null && showMakePut == null && showBuyCall != null && showSellCall != null && showBuyPut != null && showSellPut != null
      ? selectedClassName
      : unselectedClassName

  return (
    <div className="flex flex-row gap-2  items-center">
      <button className={goLongClassName} onClick={handleUpdateSelection("goLong")}>
        Go Long
      </button>

      <button className={buyCallClassName} onClick={handleUpdateSelection("buyCall")}>
        Buy a call
      </button>
      <button className={proactivePutClassName} onClick={handleUpdateSelection("proactivePut")}>
        Proactive Put
      </button>
      <button className={coveredCallClassName} onClick={handleUpdateSelection("coveredCall")}>
        Covered Call
      </button>
      <div className="divider divider-horizontal w-1" />
      <button className={goShortClassName} onClick={handleUpdateSelection("goShort")}>
        Go Short
      </button>
      <button className={buyPutClassName} onClick={handleUpdateSelection("buyPut")}>
        Buy a Put
      </button>
      <button className={proactiveCallClassName} onClick={handleUpdateSelection("proactiveCall")}>
        Proactive call
      </button>
      <button className={coveredPutClassName} onClick={handleUpdateSelection("coveredPut")}>
        Covered Put
      </button>
      <div className="divider divider-horizontal w-1" />
      <button className={riskReversalClassName} onClick={handleUpdateSelection("riskReversal")}>
        Risk Reversal
      </button>
      <button className={protectiveCollarClassName} onClick={handleUpdateSelection("protectiveCollar")}>
        Protective Collar
      </button>
      <button className={longStraddleClassName} onClick={handleUpdateSelection("longStraddle")}>
        Long Straddle
      </button>
      <button className={shortStraddleClassName} onClick={handleUpdateSelection("shortStraddle")}>
        Short Straddle
      </button>
      <button className={doubleBullClassName} onClick={handleUpdateSelection("doubleBull")}>
        Double Bull Spread
      </button>

      <div className="divider divider-horizontal w-1" />
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6" disabled>
        Strangle
      </button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6" disabled>
        Long Call Butterfly
      </button>
      <button className="btn btn-primary btn-outline w-32 h-6 leading-6" disabled>
        Iron Condor
      </button>
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const TradeRow = ({ outcome, showDelta = false }: { outcome: any; showDelta?: boolean }) => {
  const displayRate = formatNumber(outcome.rate)

  const displayMinor = displayRate?.split("").reverse().join("").substring(0, 2).split("").reverse().join("")
  const displayMajor = displayRate?.split("").reverse().join("").substring(2).split("").reverse().join("")

  const tradeProfit = outcome.tradeProfit

  const displayProfit = formatValue(tradeProfit, false)

  let containerClassName = "h-6 w-full flex flex-row gap-1 justify-around"
  let profitClassName = "w-16 text-right"

  if (outcome.delta === 0) {
    containerClassName += " text-primary"
  }

  if (tradeProfit > 0) {
    profitClassName += " text-success"
  } else if (tradeProfit < 0) {
    profitClassName += " text-error"
  } else {
    profitClassName += " text-secondary"
  }

  return (
    <div className={containerClassName}>
      {showDelta && (
        <div className="w-16 text-right">
          <span>{outcome.delta}</span>
        </div>
      )}
      {!showDelta && (
        <div className="w-16 text-right">
          <span>{displayMajor}</span>
          <span className="text-xs">{displayMinor}</span>
        </div>
      )}
      <div className={profitClassName}>
        <span>{displayProfit}</span>
      </div>
    </div>
  )
}

const TradeColumn = ({ symbol, source, showDelta = false }: { symbol: string | undefined; source: any; showDelta?: boolean }) => {
  const { direction, outcomes } = source

  const displayTitle = direction === TradeDirection.Call ? "Make Call" : "Make Put"
  const displayInIcons = direction === TradeDirection.Call ? <MakeCallIcons /> : <MakePutIcons />
  const displayOutIcons = direction === TradeDirection.Call ? <MakePutIcons /> : <MakeCallIcons />

  return (
    <div className="w-48 flex flex-col items-center gap-2 p-2">
      <div className="h-6 text-secondary font-extrabold">{displayTitle}</div>
      <div className="h-4 ">{displayInIcons}</div>
      <div className="h-4 text-secondary">{displayOutIcons}</div>

      <div className="divider"></div>

      {outcomes?.map((outcome: any) => (
        <TradeRow outcome={outcome} showDelta={showDelta} key={outcome.delta} />
      ))}
    </div>
  )
}

const TradeBlock = ({ symbol, source, showDelta = false }: { symbol: string | undefined; source: any; showDelta?: boolean }) => {
  if (source == null) {
    return null
  }

  return (
    <div className="flex flex-row gap-2 border border-primary rounded ">
      <TradeColumn symbol={symbol} source={source} showDelta={showDelta} />
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const ProfitRow = ({
  source,
  outcome,
  showMakeCall,
  showMakePut,
  showBuyCall,
  showSellCall,
  showBuyPut,
  showSellPut,
  showDelta = false,
}: {
  source: any
  outcome: any
  showMakeCall?: boolean | undefined
  showMakePut?: boolean | undefined
  showBuyCall?: number | undefined
  showSellCall?: number | undefined
  showBuyPut?: number | undefined
  showSellPut?: number | undefined
  showDelta?: boolean
}) => {
  const displayRate = formatNumber(outcome.midRate)

  const displayMinor = displayRate?.split("").reverse().join("").substring(0, 2).split("").reverse().join("")
  const displayMajor = displayRate?.split("").reverse().join("").substring(2).split("").reverse().join("")

  const outcomeIndex = outcome.index

  let tradeProfit = 0

  if (showMakeCall != null) {
    tradeProfit += source.makeCall.outcomes[outcomeIndex].tradeProfit
  }

  if (showMakePut != null) {
    tradeProfit += source.makePut.outcomes[outcomeIndex].tradeProfit
  }

  if (showBuyCall != null) {
    const contractIndex = source.buyCall.contracts.findIndex((contract: any) => contract.delta === showBuyCall)
    if (contractIndex > -1) {
      tradeProfit += source.buyCall.contracts[contractIndex].outcomes[outcomeIndex].profit
    }
  }

  if (showSellCall != null) {
    const contractIndex = source.sellCall.contracts.findIndex((contract: any) => contract.delta === showSellCall)
    if (contractIndex > -1) {
      tradeProfit += source.sellCall.contracts[contractIndex].outcomes[outcomeIndex].profit
    }
  }

  if (showBuyPut != null) {
    const contractIndex = source.buyPut.contracts.findIndex((contract: any) => contract.delta === showBuyPut)
    if (contractIndex > -1) {
      tradeProfit += source.buyPut.contracts[contractIndex].outcomes[outcomeIndex].profit
    }
  }

  if (showSellPut != null) {
    const contractIndex = source.sellPut.contracts.findIndex((contract: any) => contract.delta === showSellPut)
    if (contractIndex > -1) {
      tradeProfit += source.sellPut.contracts[contractIndex].outcomes[outcomeIndex].profit
    }
  }

  const displayProfit = formatValue(tradeProfit, false)

  let containerClassName = "h-6 w-full flex flex-row gap-1 justify-around"
  let profitClassName = "w-16 text-right"

  if (outcome.delta === 0) {
    containerClassName += " text-primary"
  }

  if (tradeProfit > 0) {
    profitClassName += " text-success"
  } else if (tradeProfit < 0) {
    profitClassName += " text-error"
  } else {
    profitClassName += " text-secondary"
  }

  return (
    <div className={containerClassName}>
      {showDelta && (
        <div className="w-16 text-right">
          <span>{outcome.delta}</span>
        </div>
      )}
      {!showDelta && (
        <div className="w-16 text-right">
          <span>{displayMajor}</span>
          <span className="text-xs">{displayMinor}</span>
        </div>
      )}
      <div className={profitClassName}>
        <span>{displayProfit}</span>
      </div>
    </div>
  )
}

const ProfitColumn = ({
  source,
  notional,
  showMakeCall,
  showMakePut,
  showBuyCall,
  showSellCall,
  showBuyPut,
  showSellPut,
  showDelta = false,
}: {
  source: any
  notional?: number
  showMakeCall?: boolean | undefined
  showMakePut?: boolean | undefined
  showBuyCall?: number | undefined
  showSellCall?: number | undefined
  showBuyPut?: number | undefined
  showSellPut?: number | undefined
  showDelta?: boolean
}) => {
  const { outcomes } = source.profit

  const displayTitle = "Overall Profit"

  let initialMargin
  let displayInitialMargin

  let maxMarginCall = 0
  let displayMaxMarginCall

  let displayMargin

  let contractCost = 0
  let displayContractCost

  if (showMakeCall || showMakePut) {
    initialMargin = (notional ?? 0) * 0.1
  }

  if (showMakeCall) {
    const last = source.makePut.outcomes?.length - 1
    if (last > 0) {
      maxMarginCall = Math.min(maxMarginCall, source.makeCall.outcomes[0].tradeProfit, source.makeCall.outcomes[last].tradeProfit)
    }
  }

  if (showMakePut) {
    const last = source.makePut.outcomes?.length - 1
    if (last > 0) {
      maxMarginCall = Math.min(maxMarginCall, source.makePut.outcomes[0].tradeProfit, source.makePut.outcomes[last].tradeProfit)
    }
  }

  if (showBuyCall != null) {
    const contractIndex = source.buyCall.contracts?.findIndex((contract: any) => contract.delta === showBuyCall)

    if (contractIndex > -1) {
      contractCost += source.buyCall.contracts[contractIndex].contractCost
    }
  }

  if (showSellCall != null) {
    const contractIndex = source.sellCall.contracts?.findIndex((contract: any) => contract.delta === showSellCall)

    if (contractIndex > -1) {
      contractCost -= source.sellCall.contracts[contractIndex].contractCost
    }
  }

  if (showBuyPut != null) {
    const contractIndex = source.buyPut.contracts?.findIndex((contract: any) => contract.delta === showBuyPut)

    if (contractIndex > -1) {
      contractCost += source.buyPut.contracts[contractIndex].contractCost
    }
  }

  if (showSellPut != null) {
    const contractIndex = source.sellPut.contracts?.findIndex((contract: any) => contract.delta === showSellPut)

    if (contractIndex > -1) {
      contractCost -= source.sellPut.contracts[contractIndex].contractCost
    }
  }

  if (initialMargin != 0) {
    displayInitialMargin = formatValue(initialMargin, false)
  }

  if (maxMarginCall != 0) {
    maxMarginCall = maxMarginCall * -1
    displayMaxMarginCall = formatValue(maxMarginCall, false)
  }

  if (displayInitialMargin != null && displayMaxMarginCall != null) {
    displayMargin = displayInitialMargin + " / " + displayMaxMarginCall
  }

  if (contractCost > 0) {
    displayContractCost = formatValue(contractCost, false)
  }

  return (
    <div className="w-48 flex flex-col items-center gap-2 p-2">
      <div className="h-6 text-secondary font-extrabold">{displayTitle}</div>
      <div className="h-4 text-secondary">{displayMargin}</div>
      <div className="h-4 ">{displayContractCost}</div>
      <div className="divider"></div>

      {outcomes?.map((outcome: any) => (
        <ProfitRow
          source={source}
          outcome={outcome}
          showMakeCall={showMakeCall}
          showMakePut={showMakePut}
          showBuyCall={showBuyCall}
          showSellCall={showSellCall}
          showBuyPut={showBuyPut}
          showSellPut={showSellPut}
          showDelta={showDelta}
          key={outcome.delta}
        />
      ))}
    </div>
  )
}

const ProfitBlock = ({
  notional,
  source,
  showMakeCall,
  showMakePut,
  showBuyCall,
  showSellCall,
  showBuyPut,
  showSellPut,
  showDelta = false,
}: {
  source: any
  notional: number
  showMakeCall?: boolean | undefined
  showMakePut?: boolean | undefined
  showBuyCall?: number | undefined
  showSellCall?: number | undefined
  showBuyPut?: number | undefined
  showSellPut?: number | undefined
  showDelta?: boolean
}) => {
  if (source == null) {
    return null
  }

  return (
    <div className="flex flex-row gap-2 border border-primary rounded ">
      <ProfitColumn
        source={source}
        notional={notional}
        showMakeCall={showMakeCall}
        showMakePut={showMakePut}
        showBuyCall={showBuyCall}
        showSellCall={showSellCall}
        showBuyPut={showBuyPut}
        showSellPut={showSellPut}
        showDelta={showDelta}
      />
    </div>
  )
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const PriceRow = ({ item, showDelta = false }: { item: any; showDelta?: boolean }) => {
  const displayRate = formatNumber(item.rate)

  const displayMinor = displayRate?.split("").reverse().join("").substring(0, 2).split("").reverse().join("")
  const displayMajor = displayRate?.split("").reverse().join("").substring(2).split("").reverse().join("")

  let containerClassName = "h-6 w-full flex flex-row gap-1 justify-around"

  if (item.delta === 0) {
    containerClassName += " text-primary"
  }

  return (
    <div className={containerClassName}>
      {showDelta && (
        <div className="w-16 text-right">
          <span>{item.delta}</span>
        </div>
      )}
      {!showDelta && (
        <div className="w-16 text-right">
          <span>{displayMajor}</span>
          <span className="text-xs">{displayMinor}</span>
        </div>
      )}
    </div>
  )
}

const PriceColumn = ({ source, showDelta = false }: { source: any; showDelta?: boolean }) => {
  const { direction, tradeOutcomes } = source

  let displayTitle
  let displayIcons

  switch (direction) {
    case OptionDirection.BuyCall:
      displayTitle = "Buy Call"
      displayIcons = <BuyCallIcons />
      break
    case OptionDirection.SellCall:
      displayTitle = "Sell Call"
      displayIcons = <SellCallIcons />
      break
    case OptionDirection.BuyPut:
      displayTitle = "Buy Put"
      displayIcons = <BuyPutIcons />
      break
    case OptionDirection.SellPut:
      displayTitle = "Sell Put"
      displayIcons = <SellPutIcons />
      break
  }

  return (
    <div className="w-48 flex flex-col items-center gap-2 p-2">
      <div className="h-8 text-secondary font-extrabold">{displayTitle}</div>
      <div className="h-8 ">{displayIcons}</div>
      <div className="divider"></div>

      {tradeOutcomes?.map((item: any) => (
        <PriceRow item={item} showDelta={showDelta} key={item.delta} />
      ))}
    </div>
  )
}

const OptionRow = ({
  item,
  cost,
  direction,
  contractDelta,
  onClick,
}: {
  item: any
  cost: number
  direction: OptionDirection
  contractDelta: number
  onClick?: (data: any) => null
}) => {
  const profit = item.profit
  // const profit = item.percentage * 10000

  // if (balance < maxLoss) {
  //   balance = maxLoss
  // }

  const displayProfit = formatValue(profit, false)

  let profitClassName = ""

  if (profit <= cost * -1) {
    profitClassName += " text-error"
  } else if (profit > 0) {
    profitClassName += " text-success"
    // } else if (profit === cost) {
    //   profitClassName += " text-success opacity-50"
    // } else if (profit > -1 && profit < 1) {
    //   profitClassName += " text-secondary"
  } else {
    profitClassName += " text-warning"
  }

  if (item.delta === contractDelta && (cost > 1 || cost < -1)) {
    profitClassName += " border rounded border-primary w-full text-center"
  }

  if (direction === OptionDirection.BuyCall) {
    if (profit === cost * -1) {
      profitClassName += " opacity-50"
    }
  }

  if (direction === OptionDirection.SellCall) {
    if (profit === cost) {
      profitClassName += " opacity-50"
    }
  }

  if (direction === OptionDirection.BuyPut) {
    if (profit === cost * -1) {
      profitClassName += " opacity-50"
    }
  }

  if (direction === OptionDirection.SellPut) {
    if (profit === cost) {
      profitClassName += " opacity-50"
    }
  }

  const handleClick = () => {
    if (onClick != null) {
      onClick({ item, cost, direction, contractDelta })
    }
  }

  return (
    <div className={profitClassName} onClick={handleClick}>
      {displayProfit}
    </div>
  )
}

const OptionColumn = ({
  direction,
  source,
  showDelta,
  isSelected,
  onClick,
  onUpdateDelta,
}: {
  direction: OptionDirection
  source: any
  showDelta?: boolean
  isSelected?: boolean
  onClick?: any
  onUpdateDelta?: any
}) => {
  const displayRate = formatNumber(source.strikePrice)

  const displayMinor = displayRate?.split("").reverse().join("").substring(0, 2).split("").reverse().join("")
  const displayMajor = displayRate?.split("").reverse().join("").substring(2).split("").reverse().join("")

  let unitCost = source.unitCost
  let contractCost = source.contractCost

  const contractDelta = source.delta

  if (contractCost < 50) {
    unitCost = null
    contractCost = null
  }

  const displayUnitCost = unitCost == null ? null : formatNumber(unitCost * 100, 4) + "%"
  const displayContractCost = contractCost == null ? null : formatValue(contractCost, false)

  const buttonClassBase = "btn btn-sm btn-primary"

  const displayButtonClass = isSelected ? buttonClassBase : buttonClassBase + " btn-outline"

  const handleUpdateDelta = (value: number) => () => {
    onUpdateDelta(value)
  }

  return (
    <div className="w-24 flex flex-col justify-start items-center gap-2 p-2">
      <div className="h-8 text-secondary font-extrabold  ">
        {showDelta && (
          <div className="w-16 text-center">
            <span>{source.delta}</span>
          </div>
        )}
        {!showDelta && (
          <div className="w-16 text-center">
            <span>{displayMajor}</span>
            <span className="text-xs">{displayMinor}</span>
          </div>
        )}
      </div>

      <div className="h-8 ">
        {contractCost != null && (
          <button className={displayButtonClass} onClick={handleUpdateDelta(contractDelta)}>
            {showDelta ? displayUnitCost : displayContractCost}
          </button>
        )}
      </div>
      <div className="divider"></div>
      {source.outcomes?.map((item: any) => (
        <OptionRow item={item} cost={contractCost} contractDelta={contractDelta} direction={direction} onClick={onClick} />
      ))}
    </div>
  )
}

const OptionBlock = ({
  source,
  showDelta = false,
  selectedDelta = undefined,
  onClick,
  onUpdateDelta,
}: {
  source: any
  showDelta?: boolean
  selectedDelta?: unknown | number
  onClick?: any
  onUpdateDelta?: any
}) => {
  if (source == null) {
    return null
  }

  return (
    <div className="flex flex-row gap-2 border border-primary rounded ">
      <PriceColumn source={source} showDelta={showDelta} />
      {source?.contracts?.map((contract: any) => {
        const isSelected = contract.delta === selectedDelta

        return (
          <OptionColumn
            direction={source.direction}
            source={contract}
            showDelta={showDelta}
            isSelected={isSelected}
            key={contract.delta}
            onClick={onClick}
            onUpdateDelta={onUpdateDelta}
          />
        )
      })}
    </div>
  )
}
