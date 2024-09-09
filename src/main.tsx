import React from "react"
import ReactDOM from "react-dom/client"

import { createBrowserRouter, RouterProvider } from "react-router-dom"

import HomePage from "@/routes/pages/HomePage"
import ErrorPage from "@/routes/pages/ErrorPage"

import "@/data/indexDB/db"

import "./main.css"
import MarketsPage from "./routes/pages/MarketsPage"
import ScenariosPage from "./routes/pages/ScenariosPage"
import CurrenciesPage from "./routes/pages/CurrenciesPage"
import PriceSummariesPage from "./routes/pages/PriceSummariesPage"
import RateSummariesPage from "./routes/pages/RateSummariesPage"
import capitalizedWord from "./utilities/capitalizedWord"
import CurrentPricesPage from "./routes/pages/CurrentPricesPage"
import CurrentRatesPage from "./routes/pages/CurrentRatesPage"
import ActionsPage from "./routes/pages/ActionsPage"
import TimerPage from "./routes/pages/TimerPage"
import BalancePage from "./routes/pages/BalancePage"
import TransactionsPage from "./routes/pages/TransactionsPage"
import CurrentMarginsPage from "./routes/pages/CurrentMarginsPage"
import TradesPage from "./routes/pages/TradesPage"
import CurrentVolatilitiesPage from "./routes/pages/CurrentVolatilitiesPage"
import AnalysisPage from "./routes/pages/AnalysisPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage className="h-full w-full  overflow-x-hidden" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/actions",
    element: <ActionsPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/analysis",
    element: <AnalysisPage className="h-full w-full overflow-y-hidden" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/timer",
    element: <TimerPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/balance",
    element: <BalancePage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/scenarios",
    element: <ScenariosPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/markets",
    element: <MarketsPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/currencies",
    element: <CurrenciesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/priceSummaries",
    element: <PriceSummariesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/rateSummaries",
    element: <RateSummariesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/currentPrices",
    element: <CurrentPricesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/currentVolatilities",
    element: <CurrentVolatilitiesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/currentRates",
    element: <CurrentRatesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/currentMargins",
    element: <CurrentMarginsPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/trades",
    element: <TradesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/transactions",
    element: <TransactionsPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
])

document.title = capitalizedWord(window.location.pathname.replace("/", ""))

if (document.title === "") {
  document.title = "Price Simulator"
}

router.subscribe((route) => {
  const name = capitalizedWord(route.location.pathname.replace("/", ""))

  if (name === "") {
    document.title = "Price Simulator"
    return
  }

  document.title = name
})

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
