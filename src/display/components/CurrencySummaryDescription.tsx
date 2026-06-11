import type { Currency } from "@/data/indexDB/types/Currency"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  currency: Currency

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrencySummaryDescription({ currency, name = "CurrencySummaryDescription", ...rest }: PropsWithChildren<ComponentProps>) {
  if (currency.firstActiveIndex == null) {
    return <div>Data not loaded</div>
  }

  return (
    <div {...rest} data-component={name}>
      <div className="text-secondary">
        <span className="font-bold">{formatIndexAsDay(currency.firstActiveIndex)} </span>
        <span>{formatIndexAsDate(currency.firstActiveIndex)}</span>
      </div>
    </div>
  )
}
