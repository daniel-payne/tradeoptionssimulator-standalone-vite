import { Link } from "react-router"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"

import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"
import { TransactionSource } from "@/data/indexDB/enums/TransactionSource"
import isObject from "@/utilities/isObject"

import timerStart from "@/data/indexDB/controllers/timerStart"
import timerStop from "@/data/indexDB/controllers/timerStop"
import currenciesLoadAll from "@/data/indexDB/controllers/currenciesLoadAll"
import marketsLoadAll from "@/data/indexDB/controllers/marketsLoadAll"
import ohlcLoadAll from "@/data/indexDB/controllers/ohlcLoadAll"
import ohlcLoadFor from "@/data/indexDB/controllers/ohlcLoadFor"
import timerReset from "@/data/indexDB/controllers/timerReset"
import SymbolSelector from "@/display/components/SymbolSelector"
import CodeSelector from "@/display/components/CodeSelector"
import useTimer from "@/data/indexDB/hooks/useTimer"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import CurrentDateDisplay from "@/display/components/CurrentDateDisplay"
import CurrentOpenDisplay from "@/display/components/CurrentOpenDisplay"
import useMarketFor from "@/data/indexDB/hooks/useMarketFor"
import { TradeDirection } from "@/data/indexDB/enums/TradeDirection"
import openContract from "@/data/indexDB/controllers/contractOpen"
import timerNextDay from "@/data/indexDB/controllers/timerNextDay"
import scenariosLoadAll from "@/data/indexDB/controllers/scenariosLoadAll"
import transactionsAdd from "@/data/indexDB/controllers/transactionsAdd"
import clearAllData from "@/data/indexDB/controllers/clearAllData"
import clearUserData from "@/data/indexDB/controllers/clearUserData"
import ratesLoadAll from "@/data/indexDB/controllers/ratesLoadAll.1"
import ratesLoadFor from "@/data/indexDB/controllers/ratesLoadFor"
import applicationLoad from "@/data/indexDB/controllers/applicationLoad"
import contractOpen from "@/data/indexDB/controllers/contractOpen"
import { useLatest } from "react-use"
import useActiveLatestTradeFor from "@/data/indexDB/hooks/useActiveLatestTradeFor"
import contractClose from "@/data/indexDB/controllers/tradeClose"
import favoritesClear from "@/data/localStorage/controllers/favoritesClear"
import favoritesAdd from "@/data/localStorage/controllers/favoritesAdd"
import favoritesRemove from "@/data/localStorage/controllers/favoritesRemove"
import favoritesToggle from "@/data/localStorage/controllers/favoritesToggle"

const SelectController = ({ name, disabled, type, large, onRun }: PropsWithChildren<any>): JSX.Element => {
  let displayClasses = "w-48 btn btn-sm"

  if (type == null || type === "primary") {
    displayClasses += " btn-primary"
  } else if (type === "secondary") {
    displayClasses += " btn-secondary"
  } else if (type === "success") {
    displayClasses += " btn-success"
  } else if (type === "error") {
    displayClasses += " btn-error"
  } else if (type === "warning") {
    displayClasses += " btn-warning"
  } else if (type === "info") {
    displayClasses += " btn-info"
  } else if (type === "accent") {
    displayClasses += " btn-accent"
  }

  if (large) {
    displayClasses += " btn-lg"
  }

  const handleRunController = () => {
    if (onRun != null) {
      onRun()
    }
  }

  return (
    <button className={displayClasses} disabled={disabled} onClick={handleRunController}>
      {name}
    </button>
  )
}

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TestControllersPage({ name = "TestControllersPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [symbol, setSymbol] = useState<string>("^SPX")
  const [code, setCode] = useState<string>("USD")

  const [transactionValue] = useState<string>("500")
  const [transactionSource] = useState<string>(TransactionSource.User)

  const timer = useTimer()
  const market = useMarketFor(symbol)
  const price = usePriceFor(symbol)

  const trade = useActiveLatestTradeFor(symbol)

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full p-2 flex flex-col ">
        <div className=" flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 mt-2 items-center flex-wrap">
            <Link to="/">
              <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
            </Link>
            <Link to="/test">
              <h1 className="text-md text-secondary">Tests</h1>
            </Link>
            <h1 className="text-xl text-secondary">Controllers</h1>
          </div>
          <div className="flex flex-row gap-2 mt-2 items-center flex-wrap">
            <CurrentOpenDisplay market={market} price={price} />
            <CurrentDateDisplay timer={timer} />
            <SymbolSelector symbol={symbol} onSelectionChanged={setSymbol} />
            <CodeSelector code={code} onSelectionChanged={setCode} />
          </div>
        </div>

        <div className="divider">Timer</div>
        <div className="p-2 flex flex-row flex-wrap gap-4 items-center">
          <SelectController name="timer Stop" type="warning" large onRun={() => timerStop(true)} />
          <SelectController name="timer Start" type="success" large onRun={() => timerStart()} />
          <SelectController name="timer Next Day" type="primary" onRun={() => timerNextDay(true)} />
          <SelectController name="timer Reset" type="error" onRun={() => timerReset()} />
        </div>

        <div className="divider">Delete</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="clear User Data" type="warning" onRun={() => clearUserData()} />
          <SelectController name="clear All Data" type="error" onRun={() => clearAllData()} />
        </div>
        <div className="divider">Load</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="application Load" type="success" onRun={() => applicationLoad()} />
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="currencies Load All" type="primary" onRun={() => currenciesLoadAll()} />
          <SelectController name="markets Load All" type="primary" onRun={() => marketsLoadAll()} />
          <SelectController name="scenarios Load All" type="primary" onRun={() => scenariosLoadAll()} />
          <SelectController name="ohlc Load All" type="primary" onRun={() => ohlcLoadAll()} />
          <SelectController name="rates Load All" type="primary" onRun={() => ratesLoadAll()} />
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name={`ohlc Load For ${symbol}`} type="info" onRun={() => ohlcLoadFor(symbol)} />
          <SelectController name={`ohlc Load For ${symbol}`} type="info" onRun={() => ratesLoadFor(symbol)} />
        </div>

        <div className="divider">Timer</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="timer Start Fast" type="success" onRun={() => timerStart(ScenarioSpeed.Fast)} />
          <SelectController name="timer Start Medium" type="success" onRun={() => timerStart(ScenarioSpeed.Medium)} />
          <SelectController name="timer Start Slow" type="success" onRun={() => timerStart(ScenarioSpeed.Slow)} />
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="timer Reset 1978" type="error" onRun={() => timerReset("1978-04-09")} />
          <SelectController name="timer Reset 2020" type="error" onRun={() => timerReset("2020-01-06")} />
        </div>

        <div className="divider">Transaction</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="transactionsAdd" type="success" onRun={() => transactionsAdd(+transactionValue, transactionSource as TransactionSource)} />
          <SelectController name="transaction Deposit 500" value={500} />
        </div>

        <div className="divider">Trade</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="contract Open CALL 1" onRun={() => contractOpen(symbol, 1, TradeDirection.Call)} />
          <SelectController name="contract Open PUT 1" onRun={() => contractOpen(symbol, 1, TradeDirection.Put)} />

          <SelectController name={`tradeClose ${trade?.id ?? ""}`} disabled={trade?.id == null} onRun={() => contractClose(trade?.id ?? "")} />
        </div>

        <div className="divider">Local Controllers</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="favoritesAdd" onRun={() => favoritesAdd("OJ.F")} />
          <SelectController name="favoritesRemove" onRun={() => favoritesRemove("OJ.F")} />
          <SelectController name="favoritesToggle" onRun={() => favoritesToggle("OJ.F")} />
          <SelectController name="favoritesClear" onRun={() => favoritesClear()} />
        </div>
      </div>
    </div>
  )
}
