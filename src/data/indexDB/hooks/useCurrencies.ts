import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import type { Currency } from "@/data/indexDB/types/Currency"

import compareObjectsBy from "@/utilities/compareObjectsBy"

export default function useCurrencies(): Array<Currency> | undefined {
  const currencies = useLiveQuery(async () => {
    return await db.currencies?.toArray()
  })

  currencies?.sort(compareObjectsBy("key"))

  return currencies
}
