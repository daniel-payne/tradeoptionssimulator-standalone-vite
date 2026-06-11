import db from "@/data/indexDB/db"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"
import generateID from "@/utilities/generateID"

import { Transaction } from "../types/Transaction"
import { TransactionSource } from "../enums/TransactionSource"

export async function controller(db: PriceSimulatorDexie, value: number, source: TransactionSource, index?: number, description?: string, reference?: string) {
  const id = generateID()

  const timer = await db.timer.limit(1).first()

  const { currentIndex } = timer ?? {}

  if (index == null && currentIndex == null) {
    return
  }

  const newTransaction = {
    id,
    index: index ?? currentIndex,
    source,
    value,
    description,
    reference,
  } as Transaction

  db.transactions.add(newTransaction)

  return newTransaction
}

export default function transactionsAdd(value: number, source: TransactionSource, index?: number, description?: string, reference?: string) {
  return controller(db, value, source, index, description, reference)
}
