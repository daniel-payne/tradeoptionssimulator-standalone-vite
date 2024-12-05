import { useState } from "react"
import { Link } from "react-router"

import useClosesFor from "@/data/indexDB/hooks/useClosesFor"
import useCurrencies from "@/data/indexDB/hooks/useCurrencies"
import useHighsFor from "@/data/indexDB/hooks/useHighsFor"
import SymbolSelector from "@/display/components/SymbolSelector"
import useLowsFor from "@/data/indexDB/hooks/useLowsFor"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import useMarkets from "@/data/indexDB/hooks/useMarkets"
import useOpensFor from "@/data/indexDB/hooks/useOpensFor"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import useRatesFor from "@/data/indexDB/hooks/useRatesFor"
import useScenarios from "@/data/indexDB/hooks/useScenarios"
import useSymbols from "@/data/indexDB/hooks/useSymbols"
import useTimer from "@/data/indexDB/hooks/useTimer"
import useTrades from "@/data/indexDB/hooks/useTrades"
import useTransactions from "@/data/indexDB/hooks/useTransactions"

import useActionsSelection from "@/data/localStorage/hooks/useActionsSelection"
import useBehaviorsSelection from "@/data/localStorage/hooks/useBehaviorsSelection"
import useContentSelection from "@/data/localStorage/hooks/useContentSelection"
import useCountdown from "@/data/localStorage/hooks/useCountdown"
import useFavoriteSelection from "@/data/localStorage/hooks/useFavoriteSelection"
import useRangeSelection from "@/data/localStorage/hooks/useRangeSelection"
import useViewSelection from "@/data/localStorage/hooks/useViewSelection"
import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"

import type { HTMLAttributes, PropsWithChildren } from "react"
import CodeSelector from "@/display/components/CodeSelector"
import useActiveTrades from "@/data/indexDB/hooks/useActiveTrades"
import useActiveTradesFor from "@/data/indexDB/hooks/useActiveTradesFor"
import useInactiveTradesFor from "@/data/indexDB/hooks/useInactiveTradesFor"
import useInactiveTrades from "@/data/indexDB/hooks/useInactiveTrades"

import useActiveSymbols from "@/data/indexDB/hooks/useActiveSymbols"
import useFavoriteSymbols from "@/data/indexDB/hooks/useFavoriteSymbols"
import useInactiveLatestTradeFor from "@/data/indexDB/hooks/useInactiveLatestTradeFor"
import useActiveLatestTradeFor from "@/data/indexDB/hooks/useActiveLatestTradeFor"

import useVariationMargins from "@/data/indexDB/hooks/useVariationMargins"
import useVariationMarginsFor from "@/data/indexDB/hooks/useVariationMarginsFor"
import useVariationMarginFor from "@/data/indexDB/hooks/useVariationMarginFor"
import useBalance from "@/data/indexDB/hooks/useBalance"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

const SelectHook = ({ name, symbol, code, disabled, onSelect }: PropsWithChildren<any>): JSX.Element => {
  let displayName

  if (symbol != null) {
    displayName = `${name}(${symbol})`
  } else if (code != null) {
    displayName = `${name}(${code})`
  } else {
    displayName = `${name}()`
  }

  const handleSelection = () => {
    if (onSelect != null) {
      onSelect(displayName)
    }
  }

  const displayClasses = symbol == null || code == null ? "w-48 btn btn-primary btn-sm" : "w-48 btn btn-info btn-sm"

  return (
    <button className={displayClasses} disabled={disabled} onClick={handleSelection}>
      {name}
    </button>
  )
}

export default function TestHooksPage({ name = "HooksTestHooksPagePage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [selection, setSelection] = useState<string>("useMarkets")

  const [symbol, setSymbol] = useState<string>("^SPX")
  const [code, setCode] = useState<string>("USD")
  const [id, setId] = useState<string>("")

  const activeTrades = useActiveTrades()
  const activeTradesFor = useActiveTradesFor(symbol)
  const activeLatestTradeFor = useActiveLatestTradeFor(symbol)

  const closesFor = useClosesFor(symbol)
  const currencies = useCurrencies()
  const highsFor = useHighsFor(symbol)
  const inactiveTrades = useInactiveTrades()
  const inactiveTradesFor = useInactiveTradesFor(symbol)
  const inactiveLatestTradeFor = useInactiveLatestTradeFor(symbol)

  const lowsFor = useLowsFor(symbol)
  const marketFor = useMarketFor(symbol)
  const markets = useMarkets()
  const opensFor = useOpensFor(symbol)
  const priceFor = usePriceFor(symbol)

  const ratesFor = useRatesFor(code)

  const scenarios = useScenarios()

  const timer = useTimer()
  const trades = useTrades()
  const transactions = useTransactions()

  const symbols = useSymbols()
  const activeSymbols = useActiveSymbols()
  const favoriteSymbols = useFavoriteSymbols()

  const actionsSelection = useActionsSelection()
  const behaviorsSelection = useBehaviorsSelection()
  const contentSelection = useContentSelection()
  const countdown = useCountdown()
  const favoriteList = useFavoriteList()
  const favoriteSelection = useFavoriteSelection()
  const rangeSelection = useRangeSelection()
  const viewSelection = useViewSelection()

  const variationMargins = useVariationMargins()
  const variationMarginsFor = useVariationMarginsFor(symbol)
  const variationMarginFor = useVariationMarginFor(id)

  const balance = useBalance()

  let data

  const checkIfSelected = (name: string) => {
    const target = selection.toLowerCase()

    const match = "use" + name.toLowerCase() + "("

    const found = target.includes(match)

    return found
  }

  if (checkIfSelected("activeTrades")) {
    data = activeTrades
  } else if (checkIfSelected("activeTradesFor")) {
    data = activeTradesFor
  } else if (checkIfSelected("activeLatestTradeFor")) {
    data = activeLatestTradeFor
  } else if (checkIfSelected("closesFor")) {
    data = closesFor
  } else if (checkIfSelected("currencies")) {
    data = currencies
  } else if (checkIfSelected("highsFor")) {
    data = highsFor
  } else if (checkIfSelected("inactiveTrades")) {
    data = inactiveTrades
  } else if (checkIfSelected("inactiveTradesFor")) {
    data = inactiveTradesFor
  } else if (checkIfSelected("inactiveLatestTradeFor")) {
    data = inactiveLatestTradeFor
  } else if (checkIfSelected("lowsFor")) {
    data = lowsFor
  } else if (checkIfSelected("marketFor")) {
    data = marketFor
  } else if (checkIfSelected("markets")) {
    data = markets
  } else if (checkIfSelected("opensFor")) {
    data = opensFor
  } else if (checkIfSelected("priceFor")) {
    data = priceFor
  } else if (checkIfSelected("ratesFor")) {
    data = ratesFor
  } else if (checkIfSelected("scenarios")) {
    data = scenarios
  } else if (checkIfSelected("symbols")) {
    data = symbols
  } else if (checkIfSelected("timer")) {
    data = timer
  } else if (checkIfSelected("trades")) {
    data = trades
  } else if (checkIfSelected("transactions")) {
    data = transactions
  } else if (checkIfSelected("symbols")) {
    data = transactions
  } else if (checkIfSelected("activeSymbols")) {
    data = activeSymbols
  } else if (checkIfSelected("favoriteSymbols")) {
    data = favoriteSymbols
  } else if (checkIfSelected("variationMargins")) {
    data = variationMargins
  } else if (checkIfSelected("variationMarginsFor")) {
    data = variationMarginsFor
  } else if (checkIfSelected("variationMarginFor")) {
    data = variationMarginFor
  } else if (checkIfSelected("balance")) {
    data = balance
  }
  // Local Storage
  else if (checkIfSelected("actionsSelection")) {
    data = actionsSelection
  } else if (checkIfSelected("behaviorsSelection")) {
    data = behaviorsSelection
  } else if (checkIfSelected("contentSelection")) {
    data = contentSelection
  } else if (checkIfSelected("countdown")) {
    data = countdown
  } else if (checkIfSelected("favoriteList")) {
    data = favoriteList
  } else if (checkIfSelected("favoriteSelection")) {
    data = favoriteSelection
  } else if (checkIfSelected("rangeSelection")) {
    data = rangeSelection
  } else if (checkIfSelected("viewSelection")) {
    data = viewSelection
  }

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full p-2 flex flex-col overflow-auto">
        <div className=" flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 mt-2 items-center flex-wrap">
            <Link to="/">
              <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
            </Link>
            <Link to="/test">
              <h1 className="text-md text-secondary">Tests</h1>
            </Link>
            <h1 className="text-xl text-secondary">Application Hooks</h1>
          </div>
          <div className="flex flex-row gap-2 mt-2 items-center flex-wrap">
            <SymbolSelector symbol={symbol} onSelectionChanged={setSymbol} />
            <CodeSelector code={code} onSelectionChanged={setCode} />
          </div>
        </div>

        <div className="w-full h-full flex flex-row  ">
          <div className="w-1/2 flex flex-col gap-2 overflow-auto">
            <div className="divider">Symbols/Codes</div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useSymbols" onSelect={setSelection} />
              <SelectHook name="useActiveSymbols" onSelect={setSelection} />
              <SelectHook name="useFavoriteSymbols" onSelect={setSelection} />
            </div>
            <div className="divider">Loaded</div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useScenarios" onSelect={setSelection} />
              <SelectHook name="useCurrencies" onSelect={setSelection} />
              <SelectHook name="useMarkets" onSelect={setSelection} />
              <SelectHook name="useMarketFor" symbol={symbol} onSelect={setSelection} />
            </div>
            <div className="divider">Stored</div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useTimer" onSelect={setSelection} />
              <SelectHook name="useTrades" onSelect={setSelection} />
              <SelectHook name="useTransactions" onSelect={setSelection} />
            </div>
            {/* <div className="divider">Loaded</div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useActiveMarkets" disabled onSelect={setSelection} />
              <SelectHook name="useFavoriteMarket" disabled onSelect={setSelection} />
              <SelectHook name="useFListedMarket" disabled onSelect={setSelection} />
            </div> */}
            <div className="divider">Price</div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useOpensFor" symbol={symbol} onSelect={setSelection} />
              <SelectHook name="useHighsFor" symbol={symbol} onSelect={setSelection} />
              <SelectHook name="useLowsFor" symbol={symbol} onSelect={setSelection} />
              <SelectHook name="useClosesFor" symbol={symbol} onSelect={setSelection} />

              <SelectHook name="usePriceFor" symbol={symbol} onSelect={setSelection} />
              <SelectHook name="useRatesFor" code={code} onSelect={setSelection} />
              <SelectHook name="useRateFor" code={code} onSelect={setSelection} />
            </div>
            <div className="divider">Trade</div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useActiveTrades" onSelect={setSelection} />
              <SelectHook name="useActiveTradesFor" symbol={symbol} onSelect={setSelection} />
              <SelectHook name="useActiveLatestTradeFor" symbol={symbol} onSelect={setSelection} />
            </div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useInactiveTrades" onSelect={setSelection} />
              <SelectHook name="useInactiveTradesFor" symbol={symbol} onSelect={setSelection} />
              <SelectHook name="useInactiveLatestTradeFor" symbol={symbol} onSelect={setSelection} />
            </div>
            <div className="divider">Margin</div>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="ID"
              className="ms-2 w-48 input input-sm input-primary input-bordered"
            />
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useVariationMargins" onSelect={setSelection} />
              <SelectHook name="useVariationMarginsFor" symbol={symbol} onSelect={setSelection} />
              <SelectHook name="useVariationMarginFor" symbol={id} onSelect={setSelection} />
            </div>
            <div className="divider">Balance</div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useBalance" onSelect={setSelection} />
            </div>

            <div className="divider">IndexDB Hooks</div>
            <div className="p-2 flex flex-row flex-wrap gap-4">
              <SelectHook name="useActionsSelection" onSelect={setSelection} />
              <SelectHook name="useBehaviorsSelection" onSelect={setSelection} />
              <SelectHook name="useContentSelection" onSelect={setSelection} />
              <SelectHook name="useCountdown" onSelect={setSelection} />
              <SelectHook name="useFavoriteList" onSelect={setSelection} />
              <SelectHook name="useFavoriteSelection" onSelect={setSelection} />
              <SelectHook name="useRangeSelection" onSelect={setSelection} />
              <SelectHook name="useViewSelection" onSelect={setSelection} />
            </div>
          </div>

          <div className="w-1/2 h-full flex flex-col   relative">
            <div className="divider">{selection}</div>
            <div className="flex-auto border border-gray-600 rounded relative min-h-0 overflow-auto ">
              <div className="h-full p-4 ">
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
