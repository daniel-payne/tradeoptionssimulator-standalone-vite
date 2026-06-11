import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import { TransactionSource } from "../enums/TransactionSource"
import { controller as addTransaction } from "./transactionsAdd"

export async function controller(db: PriceSimulatorDexie, amount: number) {
  return addTransaction(db, amount, TransactionSource.User)
}

export default function transactionDepositFunds(amount: number) {
  return controller(db, amount)
}
