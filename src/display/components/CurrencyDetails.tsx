import type { HTMLAttributes, PropsWithChildren } from "react"

import type { Currency } from "@/data/indexDB/types/Currency"
import CurrencyNameDescription from "./CurrencyNameDescription"
import CurrencySummaryDescription from "./CurrencySummaryDescription"

type ComponentProps = {
  currency: Currency

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrencyDetails({ currency, name = "CurrencyDetails", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <div className="rounded-xl p-4 bg-base-300 shadow-xl min-w-64">
        <div className="p-2">
          <CurrencyNameDescription currency={currency} />
          <CurrencySummaryDescription className="py-2" currency={currency} />
        </div>
      </div>
    </div>
  )
}
