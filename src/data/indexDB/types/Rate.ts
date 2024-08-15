export type Rate = {
  key: string

  priorRate?: number | undefined | null

  currentRate?: number

  [index: string]: any
}
