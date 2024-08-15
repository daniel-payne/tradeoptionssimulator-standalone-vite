import clearAllData from "@/data/indexDB/controllers/clearAllData"
import clearUserData from "@/data/indexDB/controllers/clearUserData"
import loadCurrencies from "@/data/indexDB/controllers/loadCurrencies"
import loadDataForAllSymbols from "@/data/indexDB/controllers/loadDataForAllSymbols"
import loadDataForSymbol from "@/data/indexDB/controllers/loadDataForSymbol"
import loadMarkets from "@/data/indexDB/controllers/loadMarkets"
import loadRateForKey from "@/data/indexDB/controllers/loadRateForKey"
import loadScenarios from "@/data/indexDB/controllers/loadScenarios"
import timerNextDay from "@/data/indexDB/controllers/timerNextDay"
import timerReset from "@/data/indexDB/controllers/timerReset"
import timerStart from "@/data/indexDB/controllers/timerStart"
import timerStop from "@/data/indexDB/controllers/timerStop"
import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"
import useTimer from "@/data/indexDB/hooks/useTimer"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function HomePage({ name = "HomePage", ...rest }: PropsWithChildren<ComponentProps>) {
  const timer = useTimer()

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full m-4 flex flex-col gap-2">
        <div className="divider">Timer</div>
        <div>
          <strong>{formatIndexAsDay(timer?.currentIndex)}</strong>
          <span> {formatIndexAsDate(timer?.currentIndex)}</span>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <button className="btn btn-primary" onClick={() => timerNextDay(true)}>
            Next Day
          </button>
          <button className="btn btn-success" onClick={() => timerStart(ScenarioSpeed.Slow)}>
            Slow
          </button>
          <button className="btn btn-success" onClick={() => timerStart(ScenarioSpeed.Medium)}>
            Medium
          </button>
          <button className="btn btn-success" onClick={() => timerStart(ScenarioSpeed.Fast)}>
            Fast
          </button>
          <button className="btn btn-warning" onClick={() => timerStop()}>
            Stop
          </button>
          <button className="btn btn-sm btn-error" onClick={() => timerReset("1970-01-06")}>
            1970
          </button>
          <button className="btn btn-sm btn-error" onClick={() => timerReset("2005")}>
            2005
          </button>
          <button className="btn btn-sm btn-error" onClick={() => timerReset("2020")}>
            2020
          </button>
        </div>
        <div className="divider">Loading</div>
        <div className="flex flex-row gap-2">
          <button className="btn btn-primary" onClick={loadScenarios}>
            Load Scenarios
          </button>
          <button className="btn btn-primary" onClick={loadMarkets}>
            Load Markets
          </button>
          <button className="btn btn-primary" onClick={loadCurrencies}>
            Load Currencies
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <button className="btn btn-primary" onClick={() => loadDataForSymbol("AUDUSD")}>
            Load Data For AUDUSD
          </button>
          <button className="btn btn-primary" onClick={() => loadDataForSymbol("LH.F")}>
            Load Data For LH.F
          </button>
          <button className="btn btn-primary" onClick={() => loadDataForSymbol("LC.F")}>
            Load Data For LC.F
          </button>
          <button className="btn btn-primary" onClick={() => loadDataForAllSymbols()}>
            Load All Data
          </button>
        </div>
        <div className="flex flex-row gap-2">
          <button className="btn btn-primary" onClick={() => loadRateForKey("USD")}>
            Load Rates USD
          </button>
          <button className="btn btn-primary" onClick={() => loadRateForKey("USD")}>
            Load All Rates
          </button>
        </div>
        <div className="divider">Clear</div>
        <div className="flex flex-row gap-2">
          <button className="btn btn-primary" onClick={clearAllData}>
            All Data
          </button>
          <button className="btn btn-primary" onClick={clearUserData}>
            User Data
          </button>
        </div>

        <div className="divider">Server Data</div>
        <div className="flex flex-row gap-2">
          <Link to="/scenarios">
            <button className="btn btn-secondary">Scenarios</button>
          </Link>
          <Link to="/markets">
            <button className="btn btn-secondary">Markets</button>
          </Link>
          <Link to="/currencies">
            <button className="btn btn-secondary">Currencies</button>
          </Link>
        </div>

        <div className="flex flex-row gap-2">
          <Link to="/priceSummaries">
            <button className="btn btn-secondary">price Summaries</button>
          </Link>
          <Link to="/rateSummaries">
            <button className="btn btn-secondary">Rate Summaries</button>
          </Link>
        </div>

        <div className="flex flex-row gap-2">
          <Link to="/currentPrices">
            <button className="btn btn-secondary">Current Prices</button>
          </Link>
          <Link to="/currentRates">
            <button className="btn btn-secondary">Current Rates</button>
          </Link>
        </div>

        <div className="flex flex-row gap-2">
          <input type="text" className="input input-bordered w-24" placeholder="Currency" defaultValue="USD" />
          <Link to="/rates/">
            <button className="btn btn-secondary">Rates</button>
          </Link>
          <input type="text" className="input input-bordered w-24" placeholder="Market" defaultValue="KC.F" />
          <Link to="/prices/">
            <button className="btn btn-secondary">Prices</button>
          </Link>
        </div>

        <div className="divider">User Data</div>
        <div className="flex flex-row gap-2">
          <Link to="/trades/">
            <button className="btn btn-primary">Trades</button>
          </Link>
          <Link to="/transactions/">
            <button className="btn btn-primary">Transactions</button>
          </Link>
        </div>
        <div className="flex flex-row gap-2">
          <Link to="/balance/">
            <button className="btn btn-secondary">Balance</button>
          </Link>
          <Link to="/activeTrades/">
            <button className="btn btn-secondary">Active Trades</button>
          </Link>
        </div>

        <div className="divider">Market Price</div>
        <div className="flex flex-row gap-2">
          <input type="text" className="input input-bordered w-40" placeholder="Symbol" />
          <input type="text" className="input input-bordered w-40" placeholder="Date" />
          <input type="text" className="input input-bordered w-40" placeholder="Call" />
        </div>
        <div className="flex flex-row gap-2">
          <button className="btn btn-success">Discover</button>
        </div>
        <div className="divider">Option Cost</div>
        <div className="flex flex-row gap-2">
          <input type="text" className="input input-bordered w-40" placeholder="Symbol" />
          <input type="text" className="input input-bordered w-40" placeholder="Date" />
          <input type="text" className="input input-bordered w-40" placeholder="Buy" />
          <input type="text" className="input input-bordered w-40" placeholder="Call" />
        </div>
        <div className="flex flex-row gap-2">
          <input type="text" className="input input-bordered w-40" placeholder="Notional" />
          <input type="text" className="input input-bordered w-40" placeholder="Duration" />
          <input type="text" className="input input-bordered w-40" placeholder="Style" />
        </div>
        <div className="flex flex-row gap-2">
          <button className="btn btn-success">Discover</button>
        </div>
      </div>
    </div>
  )
}
