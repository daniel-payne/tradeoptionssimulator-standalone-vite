import db from "@/data/indexDB/db"

import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

import getTimer from "./getTimer"
import updateTimer from "./updateTimer"
import recalculateCurrentPrices from "./recalculateCurrentPrices"
import recalculateCurrentRates from "./recalculateCurrentRates"

// import recalculatePrices from "./recalculatePrices"
// import recalculateMargins from "./recalculateMargins"

export async function controller(db: PriceSimulatorDexie, takeControl: boolean) {
  const currentTimer = await getTimer()

  db.transaction(
    "rw",
    [
      "timer",
      "markets",
      "currencies",
      "marketOpens",
      "marketHighs",
      "marketLows",
      "marketCloses",
      "currencyRates",
      "priceSummaries",
      "rateSummaries",
      "currentPrices",
      "currentRates",
    ],
    async () => {
      const currentIndex = (currentTimer?.currentIndex ?? 0) + 1

      const isOwner = takeControl === true ? true : currentTimer?.id === db.id

      let isTimerActive = takeControl === true ? true : currentTimer?.isTimerActive === true

      if (isOwner && isTimerActive) {
        if (takeControl === true) {
          isTimerActive = false

          await updateTimer({ id: db.id, currentIndex, isTimerActive })
        } else {
          await updateTimer({ currentIndex: currentIndex })
        }

        await recalculateCurrentPrices()
        await recalculateCurrentRates()
        // await recalculateMargins()
      }
    }
  )
    .then(async () => {
      const { speed, isTimerActive } = currentTimer ?? {}

      if (isTimerActive === true) {
        db.timeout = window.setTimeout(() => {
          controller(db, takeControl)
        }, speed ?? ScenarioSpeed.Slow)
      }
    })
    .catch((err) => {
      console.error(err.stack)
    })
}

export default function timerNextDay(takeControl = false) {
  return controller(db, takeControl)
}
