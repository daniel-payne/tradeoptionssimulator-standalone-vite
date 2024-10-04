import db from "@/data/indexDB/db"

import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

// import timerLoad from "./timerLoad.old"

import updateTimer from "./timerUpdate"

// import recalculatePrices from "./recalculatePrices"
// import recalculateMargins from "./recalculateMargins"

export async function controller(db: PriceSimulatorDexie, takeControl: boolean) {
  // const currentTimer = await timerLoad()

  const currentTimer = await db.timer.limit(1).first()

  if (currentTimer == null) {
    return
  }

  let isTimerActive = currentTimer.isTimerActive

  // await db.transaction(
  //   "rw",
  //   [
  //     "currencies",
  //     "currencyRates",
  //     "currentBalance",
  //     "currentPrices",
  //     "currentRates",
  //     "currentMargins",
  //     "currentVolatilities",
  //     "overnightVolatilities",
  //     "parkinsonVolatilities",
  //     "rogersSatchellVolatilities",
  //     "garminKlassVolatilities",
  //     "yangZhangVolatilities",
  //     "marketCloses",
  //     "marketHighs",
  //     "marketLows",
  //     "marketOpens",
  //     "markets",
  //     "priceSummaries",
  //     "rateSummaries",
  //     "timer",
  //     "trades",
  //     "transactions",
  //   ],
  //   async () => {
  const currentIndex = (currentTimer?.currentIndex ?? 0) + 1

  const isOwner = takeControl === true ? true : currentTimer?.guid === db.guid

  isTimerActive = takeControl === true ? true : currentTimer?.isTimerActive === true

  if (isOwner && isTimerActive) {
    if (takeControl === true) {
      isTimerActive = false

      await updateTimer({ guid: db.guid, currentIndex, isTimerActive })
    } else {
      await updateTimer({ currentIndex: currentIndex })
    }
  }
  // }
  // )

  const { speed } = currentTimer ?? {}

  if (isTimerActive === true) {
    db.timeout = window.setTimeout(() => {
      controller(db, takeControl)
    }, speed ?? ScenarioSpeed.Slow)
  }
}

export default function timerNextDay(takeControl = false) {
  return controller(db, takeControl)
}
