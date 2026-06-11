import db from "@/data/indexDB/db"

import { ScenarioSpeed } from "../enums/ScenarioSpeed"

import { controller as timerStop } from "./timerStop"
import { controller as contractOpen } from "./contractOpen"
import { controller as tradeClose } from "./tradeClose"
import { controller as timerStart } from "./timerStart"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(db: PriceSimulatorDexie, instructions: any) {
  const { action, options } = instructions

  const { symbol, size, direction, id } = options

  timerStop(db, true)
  // alert(JSON.stringify({ action, options: { symbol, size, direction } }, null, 2))

  switch (action) {
    case "contractOpen":
      await contractOpen(db, symbol, size, direction)
      break
    case "tradeClose":
      await tradeClose(db, id)
      break
    // tradeQuote(symbol, amount, direction, stop, take, expiry)
    // quoteConfirm(id)
    // tradeClose(id)

    // optionQuote(symbol, amount, call, put, american, strike, expiry)
    // optionExercise(id)
    // optionCancelQuote(id)
    // optionCancel(id)
  }

  timerStart(db, ScenarioSpeed.Slow)

  return
}

export default function actionProcess(instructions: any) {
  return controller(db, instructions)
}
