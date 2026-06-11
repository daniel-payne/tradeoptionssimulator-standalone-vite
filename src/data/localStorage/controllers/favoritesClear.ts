import db from "@/data/indexDB/db"

import { getStore, setState, StoragePersistence } from "@keldan-systems/state-mutex"

import type { PriceSimulatorDexie } from "@/data/indexDB/db"

export async function controller(_: PriceSimulatorDexie) {
  const newFavorites = [] as Array<string>

  setState("MARKET-FAVORITES", newFavorites, StoragePersistence.local)

  console.log(getStore())

  return []
}

export default function favoritesClear() {
  return controller(db)
}
