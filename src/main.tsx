import React from "react"
import ReactDOM from "react-dom/client"

import { createBrowserRouter, RouterProvider } from "react-router"

import ErrorPage from "@/routes/pages/ErrorPage"

import "@/data/indexDB/db"

import "./main.css"

import capitalizedWord from "@/utilities/capitalizedWord"

import TestHooksPage from "./routes/pages/data/TestHooksPage"
import TestLayoutPage from "./routes/pages/data/TestLayoutPage"
import TestControllersPage from "@/routes/pages/data/TestControllersPage"
import TestIndexPage from "./routes/pages/data/TestIndexPage"
import HomePage from "./routes/pages/HomePage"
import TradingPage from "./routes/pages/TradingPage"
import ScenariosPage from "./routes/pages/ScenariosPage"
import PricesPage from "./routes/pages/PricesPage"
import ScenarioPage from "./routes/pages/ScenarioPage"
import HistoryPage from "./routes/pages/HistoryPage"

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/scenarios",
    element: <ScenariosPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/scenario/:ref",
    element: <ScenarioPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/prices",
    element: <PricesPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/trading/:symbols",
    element: <TradingPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/history",
    element: <HistoryPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },

  {
    path: "/test",
    element: <TestIndexPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/test/controllers",
    element: <TestControllersPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/test/hooks",
    element: <TestHooksPage className="h-full w-full" />,
    errorElement: <ErrorPage className="h-full w-full" />,
  },
  {
    path: "/test/layout",
    element: <TestLayoutPage className="h-full w-full" />,
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
