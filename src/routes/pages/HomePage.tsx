import { Link } from "react-router-dom"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function HomePage({ name = "HomePage", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full m-4 flex flex-col ">
        <div className="divider">Actions</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/actions" className="w-48  btn btn-primary">
            Actions
          </Link>
          <Link to="/analysis" className="w-48  btn btn-primary">
            Analysis
          </Link>
        </div>
        <div className="divider">Singletons </div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/timer" className="w-48  btn btn-secondary">
            Timer
          </Link>
          <Link to="/balance" className="w-48  btn btn-secondary">
            Balance
          </Link>
        </div>
        <div className="divider">Server</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/scenarios" className="w-48  btn btn-secondary">
            Scenarios
          </Link>
          <Link to="/markets" className="w-48  btn btn-secondary">
            Markets
          </Link>
          <Link to="/currencies" className="w-48  btn btn-secondary">
            Currencies
          </Link>
        </div>
        <div className="divider">Summaries</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/priceSummaries">
            <button className="w-48  btn btn-secondary">Price Summaries</button>
          </Link>
          <Link to="/rateSummaries">
            <button className="w-48  btn btn-secondary">Rate Summaries</button>
          </Link>
        </div>
        <div className="divider">Current</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/currentPrices" className="w-48  btn btn-secondary">
            Current Prices
          </Link>
          <Link to="/currentVolatilities" className="w-48  btn btn-secondary">
            Current Volatilities
          </Link>
          <Link to="/currentRates" className="w-48  btn btn-secondary">
            Current Rates
          </Link>
          <Link to="/currentMargins" className="w-48  btn btn-secondary">
            Current Margins
          </Link>
        </div>
        <div className="divider">Local</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/trades" className="w-48  btn btn-secondary ">
            Trades
          </Link>
          <Link to="/transactions" className="w-48  btn btn-secondary">
            Transactions
          </Link>
        </div>
        <div className="divider">Markets Views</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/marketsByCategory" className="w-48  btn btn-secondary btn-outline">
            Markets By Category
          </Link>
        </div>
        <div className="divider">Trades Views</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/activeTrades" className="w-48  btn btn-secondary btn-outline">
            Active Trades
          </Link>
          <Link to="/inactiveTrades" className="w-48  btn btn-secondary btn-outline">
            Inactive Trades
          </Link>
        </div>
        <div className="divider">For ID</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/tradeForID" className="w-48  btn btn-secondary btn-outline">
            Trade For ID
          </Link>
          <Link to="/marginForID" className="w-48  btn btn-secondary btn-outline">
            Margin For ID
          </Link>
        </div>
        <div className="divider">For Symbol</div>
        <div className="m-4 flex flex-row flex-wrap gap-4">
          <Link to="/marketForSymbol" className="w-48  btn btn-secondary btn-outline">
            Market For Symbol
          </Link>
          <Link to="/priceForSymbol" className="w-48  btn btn-secondary btn-outline">
            Price For Symbol
          </Link>
          <Link to="/dataForSymbol" className="w-48  btn btn-secondary  btn-outline">
            Data For Symbol
          </Link>
          <Link to="/dataForSymbol" className="w-48  btn btn-secondary  btn-outline">
            Rate For Key
          </Link>
        </div>
      </div>
    </div>
  )
}
