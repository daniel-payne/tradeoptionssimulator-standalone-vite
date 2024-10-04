import { PriceOrNothing } from "@/data/indexDB/types/Price"
import type { HTMLAttributes, PropsWithChildren } from "react"

import { FaArrowTrendUp, FaArrowTrendDown, FaArrowRight, FaMinus } from "react-icons/fa6"

type ComponentProps = {
  price?: PriceOrNothing

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function YesterdayMovementDisplay({ price, name = "YesterdayMovementDisplay", ...rest }: PropsWithChildren<ComponentProps>) {
  const displayValue = (price?.priorClose ?? 0) - (price?.priorOpen ?? 0)

  let displayIcon = null
  let className = ""

  if (displayValue > 0) {
    displayIcon = <FaArrowTrendUp />
    className = "fg-price-info--profit"
  } else if (displayValue < 0) {
    displayIcon = <FaArrowTrendDown />
    className = "fg-price-info--loss"
  } else if (price?.hasIntraDayPrices) {
    displayIcon = <FaArrowRight />
    className = "fg-price-info--no-movement"
  } else {
    displayIcon = <FaArrowRight />
    className = "fg-price-info--no-movement"
  }

  if (price?.isMarketClosed) {
    className = "fg-price-info--closed"
  }

  return (
    <div {...rest} data-component={name}>
      <div className={className}>{displayIcon}</div>
    </div>
  )
}
