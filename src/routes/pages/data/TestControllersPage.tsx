import { Link } from "react-router-dom"

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
import openContract from "@/data/indexDB/managers/contractOpen"
import timerNextDay from "@/data/indexDB/controllers/timerNextDay"
import scenariosLoadAll from "@/data/indexDB/controllers/scenariosLoadAll"
import transactionsAdd from "@/data/indexDB/controllers/transactionsAdd"
import clearAllData from "@/data/indexDB/controllers/clearAllData"
import clearUserData from "@/data/indexDB/controllers/clearUserData"
import ratesLoadAll from "@/data/indexDB/controllers/ratesLoadAll.1"
import ratesLoadFor from "@/data/indexDB/controllers/ratesLoadFor"
import applicationLoad from "@/data/indexDB/controllers/applicationLoad"
import contractOpen from "@/data/indexDB/managers/contractOpen"
import { useLatest } from "react-use"
import useActiveLatestTradeFor from "@/data/indexDB/hooks/useActiveLatestTradeFor"
import contractClose from "@/data/indexDB/managers/contractClose"
import favoritesClear from "@/data/localStorage/controllers/favoritesClear"
import favoritesAdd from "@/data/localStorage/controllers/favoritesAdd"
import favoritesRemove from "@/data/localStorage/controllers/favoritesRemove"
import favoritesToggle from "@/data/localStorage/controllers/favoritesToggle"

const SelectController = ({ name, disabled, type, onRun }: PropsWithChildren<any>): JSX.Element => {
  let displayClasses = "w-64 btn btn-sm"

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

        <div className="divider">IndexDB Controllers</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="clearUserData" type="warning" onRun={() => clearUserData()} />
          <SelectController name="clearAllData" type="error" onRun={() => clearAllData()} />
          <SelectController name="applicationLoad" type="success" onRun={() => applicationLoad()} />
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="currenciesLoadAll" type="primary" onRun={() => currenciesLoadAll()} />
          <SelectController name="marketsLoadAll" type="primary" onRun={() => marketsLoadAll()} />
          <SelectController name="scenariosLoadAll" type="primary" onRun={() => scenariosLoadAll()} />
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="ohlcLoadAll" type="primary" onRun={() => ohlcLoadAll()} />
          <SelectController name="ohlcLoadFor" type="info" onRun={() => ohlcLoadFor(symbol)} />

          <SelectController name="ratesLoadAll" type="primary" onRun={() => ratesLoadAll()} />
          <SelectController name="ratesLoadFor" type="info" onRun={() => ratesLoadFor(symbol)} />
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="timerNextDay" type="primary" onRun={() => timerNextDay(true)} />
          <SelectController name="timerReset" type="error" onRun={() => timerReset()} />
          <SelectController name="timerStart" type="success" onRun={() => timerStart()} />
          <SelectController name="timerStop" type="warning" onRun={() => timerStop()} />
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="timerStart" type="success" onRun={() => timerStart(ScenarioSpeed.Fast)} />
          <SelectController name="timerStart" type="success" onRun={() => timerStart(ScenarioSpeed.Medium)} />
          <SelectController name="timerStart" type="success" onRun={() => timerStart(ScenarioSpeed.Slow)} />
          <SelectController name="timerReset 2020-01-06" type="error" onRun={() => timerReset("2020-01-06")} />
        </div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="transactionsAdd" type="success" onRun={() => transactionsAdd(+transactionValue, transactionSource as TransactionSource)} />
          <SelectController name="transactionDepositFunds" value={500} />
        </div>

        <div className="divider">IndexDB Managers</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="contractOpen" onRun={() => contractOpen(timer, market, price, TradeDirection.Call, 1)} />

          <SelectController name={`contractClose ${trade?.id ?? ""}`} onRun={() => contractClose(timer, market, price, trade)} />
        </div>

        <div className="divider">Local Controllers</div>
        <div className="p-2 flex flex-row flex-wrap gap-4">
          <SelectController name="favoritesAdd" onRun={() => favoritesAdd("OJ.F")} />
          <SelectController name="favoritesRemove" onRun={() => favoritesRemove("OJ.F")} />
          <SelectController name="favoritesToggle" onRun={() => favoritesToggle("OJ.F")} />
          <SelectController name="favoritesClear" onRun={() => favoritesClear()} />
        </div>

        <div className="divider">Data</div>
      </div>
    </div>
  )
}
