import type { Currency } from "@/data/indexDB/types/Currency"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  currency: Currency

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrencyNameDescription({ currency, name = "MarketNameDescription", ...rest }: PropsWithChildren<ComponentProps>) {
  const showDescription = currency.description?.length > 0

  return (
    <div {...rest} data-component={name}>
      <div className="truncate">
        <span className="text-xl font-semibold text-primary">{currency.name}</span>
        {showDescription && <span className="ps-2 text-secondary text-sm"> {currency.description}</span>}
      </div>
    </div>
  )
}
