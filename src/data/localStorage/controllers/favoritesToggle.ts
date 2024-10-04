import db from "@/data/indexDB/db"

import { getState, getStore, setState, StoragePersistence } from "@keldan-systems/state-mutex"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(_: PriceSimulatorDexie, symbol: string | undefined) {
  if (symbol == null) {
    return
  }

  let oldFavorites = getState("MARKET-FAVORITES") as Array<string>

  if (oldFavorites == null) {
    oldFavorites = []
  }

  let newFavorites

  if (oldFavorites?.includes(symbol)) {
    newFavorites = oldFavorites.filter((favorite) => favorite !== symbol)
  } else {
    newFavorites = [...oldFavorites, symbol]
  }

  setState("MARKET-FAVORITES", newFavorites, StoragePersistence.local)

  return symbol
}

export default function favoritesToggle(symbol: string | undefined) {
  return controller(db, symbol)
}
