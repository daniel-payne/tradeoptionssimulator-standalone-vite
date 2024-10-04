import db from "../db"

import type { PriceSimulatorDexie } from "../db"
import type { Currency } from "../types/Currency"

export async function controller(db: PriceSimulatorDexie, newValues: Partial<Currency> = {}) {
  const currentCurrency = await db.currencies.where({ code: newValues.code }).first()

  let updatedCurrency

  if (currentCurrency == null) {
    updatedCurrency = newValues as Currency
  } else {
    updatedCurrency = { ...currentCurrency, ...newValues }
  }

  await db.currencies.add(updatedCurrency)
}

export default async function currencyUpdate(newValues: Partial<Currency> = {}) {
  return await controller(db, newValues)
}
