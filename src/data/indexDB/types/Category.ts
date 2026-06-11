import { Market } from "./Market"

export type Category = {
  name: string

  markets: Market[]

  [index: string]: any
}
