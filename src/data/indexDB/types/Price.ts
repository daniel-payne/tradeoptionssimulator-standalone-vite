//         Call / Buy  @ Ask Price         $>  lowest price a seller/market will accept
// Price
//         Put  / Sell @ Bid / Offer Price <$  highest price a buyer/market will pay

export type Price = {
  symbol: string

  isMarketActive?: boolean
  isMarketClosed?: boolean

  priorIndex?: number | null | undefined
  priorTimestamp?: number | null | undefined
  priorTimestampISO?: string | null | undefined
  priorTimestampDay?: string | null | undefined
  priorOpen?: number | null | undefined
  priorClose?: number | null | undefined

  currentIndex?: number | null | undefined
  currentTimestamp?: number | null | undefined
  currentTimestampISO?: string | null | undefined
  currentTimestampDay?: string | null | undefined
  currentOpen?: number | null | undefined
  currentHigh?: number | null | undefined
  currentLow?: number | null | undefined
  currentClose?: number | null | undefined
  currentMidRangePrice?: number | null | undefined
  currentMidDayPrice?: number | null | undefined
  currentBid?: number | null | undefined
  currentAsk?: number | null | undefined
  currentClosingBid?: number | null | undefined
  currentClosingAsk?: number | null | undefined

  nextIndex?: number | null | undefined
  nextTimestamp?: number | null | undefined
  nextTimestampISO?: string | null | undefined
  nextTimestampDay?: string | null | undefined
  nextOpen?: number | null | undefined
  nextOpeningBid?: number | null | undefined
  nextOpeningAsk?: number | null | undefined

  hasIntraDayPrices?: boolean | null | undefined

  [index: string]: any
}

export type PriceOrNothing = Price | null | undefined
