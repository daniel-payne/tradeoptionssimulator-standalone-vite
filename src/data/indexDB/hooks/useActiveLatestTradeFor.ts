import useActiveTradesFor from "./useActiveTradesFor"

export default function useActiveLatestTradeFor(symbol: string | null | undefined) {
  const data = useActiveTradesFor(symbol)

  if (data != null && (data?.length ?? 0) > 0) {
    return data[data?.length - 1]
  }
}
