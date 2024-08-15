export type RateSummary = {
  key?: string

  state?: string

  rateCount?: number

  firstActiveIndex?: number | null | undefined
  firstInterdayIndex?: number | null | undefined

  lastActiveIndex?: number | null | undefined

  message?: string

  [index: string]: any
}
