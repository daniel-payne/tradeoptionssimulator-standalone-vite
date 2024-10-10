import useInactiveTradesFor from "./useInactiveTradesFor"

export default function useInactiveLatestTradeFor(symbol: string | null | undefined) {
  const data = useInactiveTradesFor(symbol)

  if (data != null && (data?.length ?? 0) > 0) {
    return data[data?.length - 1]
  }
}
