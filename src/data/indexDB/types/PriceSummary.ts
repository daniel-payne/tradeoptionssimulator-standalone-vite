export type PriceSummary = {
  symbol?: string

  state?: string

  priceCount?: number

  firstActiveIndex?: number | null | undefined
  firstInterdayIndex?: number | null | undefined

  lastActiveIndex?: number | null | undefined

  message?: string

  [index: string]: any
}
