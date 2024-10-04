import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import timerReset from "./timerReset"

import transactionsAdd from "./transactionsAdd"
import { TransactionSource } from "../enums/TransactionSource"

import favoritesClear from "@/data/localStorage/controllers/favoritesClear"

export async function controller(db: PriceSimulatorDexie) {
  await db.trades.clear()
  await db.transactions.clear()

  await timerReset()

  await transactionsAdd(5000, TransactionSource.User, undefined, "Initial Deposit")

  await favoritesClear()

  return
}

export default function clearUserData() {
  return controller(db)
}
