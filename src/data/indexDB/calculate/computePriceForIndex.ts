import { DEFAULT_SPREAD } from "../constants/DEFAULT_SPREAD"
import { MarketOrNothing } from "../types/Market"
import { Price } from "../types/Price"
import { TimerOrNothing } from "../types/Timer"

export default function computePriceForIndex(
  timer: TimerOrNothing,
  market: MarketOrNothing,
  opens: Array<number | null | undefined> | null | undefined,
  highs: Array<number | null | undefined> | null | undefined,
  lows: Array<number | null | undefined> | null | undefined,
  closes: Array<number | null | undefined> | null | undefined
) {
  if (timer == null || market == null || opens == null || highs == null || lows == null || closes == null) {
    return
  }

  const { currentIndex } = timer

  const { symbol, priceSpread } = market

  const spread = priceSpread?.length > 0 ? +priceSpread : DEFAULT_SPREAD

  const indexEnd = opens.length - 1

  if (currentIndex == null || currentIndex > indexEnd) {
    return
  }

  const isMarketActive = market.firstActiveIndex <= currentIndex
  const isMarketClosed = closes[currentIndex] == null

  if (isMarketActive === false) {
    return
  }

  let priorIndex
  let priorOpen
  let priorClose
  let priorHigh
  let priorLow
  let priorClosingBid
  let priorClosingAsk

  let currentOpen
  let currentHigh
  let currentLow
  let currentClose
  let currentBid
  let currentAsk
  let currentMidRangePrice
  let currentMidDayPrice
  let currentClosingBid
  let currentClosingAsk

  let nextIndex
  let nextOpen
  let nextOpeningBid
  let nextOpeningAsk

  let hasIntraDayPrices

  for (let searchIndex = currentIndex - 1; searchIndex >= 0; searchIndex--) {
    const close = closes[searchIndex]

    if (close != null) {
      priorIndex = searchIndex

      priorOpen = opens[priorIndex]
      priorClose = closes[priorIndex]
      priorHigh = highs[priorIndex]
      priorLow = lows[priorIndex]

      if (priorOpen != null && priorClose != null) {
        priorClosingAsk = priorClose * (1 + spread)
        priorClosingBid = priorClose * (1 - spread)
      }

      break
    }
  }

  for (let searchIndex = currentIndex + 1; searchIndex <= indexEnd; searchIndex++) {
    const close = closes[searchIndex]

    if (close != null) {
      nextIndex = searchIndex

      nextOpen = opens[nextIndex]

      if (nextOpen != null) {
        nextOpeningAsk = nextOpen * (1 + spread)
        nextOpeningBid = nextOpen * (1 - spread)
      }

      break
    }
  }

  if (isMarketClosed === false) {
    currentOpen = opens[currentIndex]
    currentClose = closes[currentIndex]
    currentHigh = highs[currentIndex]
    currentLow = lows[currentIndex]

    if (currentOpen != null && currentClose != null && currentHigh != null && currentLow != null) {
      currentMidRangePrice = Math.random() * (currentHigh - currentLow) + currentLow
      currentMidDayPrice = Math.random() * Math.abs(currentOpen - currentClose) + Math.min(currentOpen, currentClose)

      currentAsk = ((3 * currentMidRangePrice + 1 * currentMidDayPrice) / 4) * (1 + spread)
      currentBid = ((3 * currentMidRangePrice + 1 * currentMidDayPrice) / 4) * (1 - spread)

      currentClosingAsk = currentClose * (1 + spread)
      currentClosingBid = currentClose * (1 - spread)

      hasIntraDayPrices = !(currentOpen === currentClose && currentHigh === currentLow)
    }
  }

  const price = {
    symbol,
    currentIndex,

    isMarketActive,
    isMarketClosed,

    currentOpen,
    currentHigh,
    currentLow,
    currentClose,
    currentMidRangePrice,
    currentMidDayPrice,
    currentBid,
    currentAsk,
    currentClosingAsk,
    currentClosingBid,

    priorIndex,
    priorOpen,
    priorHigh,
    priorLow,
    priorClose,
    priorClosingBid,
    priorClosingAsk,

    nextIndex,
    nextOpen,
    nextOpeningBid,
    nextOpeningAsk,

    hasIntraDayPrices,
  } as Price

  return price
}
