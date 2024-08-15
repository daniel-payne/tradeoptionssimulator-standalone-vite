import type { Rate } from "../types/Rate"
import type { RateSummary } from "../types/RateSummary"

export default function calculatePriceForSymbolAndIndex(
  currentIndex: number,

  rates: Array<number>,

  rateSummary: RateSummary
) {
  const indexEnd = rates.length - 1

  if (currentIndex > indexEnd) {
    return
  }

  if (rateSummary.firstActiveIndex == null) {
    return
  }

  const key = rateSummary.key

  let priorIndex
  let priorRate

  const currentRate = rates[currentIndex]

  for (let searchIndex = currentIndex - 1; searchIndex >= 0; searchIndex--) {
    const rate = rates[searchIndex]

    if (rate != null) {
      priorIndex = searchIndex

      priorRate = rates[priorIndex]

      break
    }
  }

  const rate = {
    key,

    currentIndex,
    currentRate,

    priorIndex,
    priorRate,
  } as Rate

  return rate
}
