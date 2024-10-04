export type Market = {
  symbol: string
  name: string

  [index: string]: any
}

export type MarketOrNothing = Market | null | undefined
