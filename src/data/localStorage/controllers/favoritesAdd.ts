import db from "@/data/indexDB/db"

import { getState, setState, StoragePersistence } from "@keldan-systems/state-mutex"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(_: PriceSimulatorDexie, symbol: string) {
  let oldFavorites = getState("MARKET-FAVORITES") as Array<string>

  if (oldFavorites == null) {
    oldFavorites = []
  }

  if (oldFavorites?.includes(symbol)) return symbol

  const newFavorites = [...oldFavorites, symbol]

  setState("MARKET-FAVORITES", newFavorites, StoragePersistence.local)

  return symbol
}

export default function favoritesAdd(symbol: string) {
  return controller(db, symbol)
}
