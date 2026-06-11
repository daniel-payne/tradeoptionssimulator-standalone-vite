import { useLiveQuery } from "dexie-react-hooks"

import db from "@/data/indexDB/db"

import compareObjectsBy from "@/utilities/compareObjectsBy"

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function useScenarioFor(ref: string | null | undefined = "MISSING") {
  const scenario = useLiveQuery(async () => {
    return await db.scenarios?.where({ ref }).first()
  }, [ref])

  return scenario
}
