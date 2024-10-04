import { useLiveQuery } from "dexie-react-hooks"
import db from "../db"

export default function useTradeFor(id: string | null | undefined = "MISSING") {
  const data = useLiveQuery(async () => {
    return await db.trades?.where({ id }).first()
  }, [id])

  return data
}
