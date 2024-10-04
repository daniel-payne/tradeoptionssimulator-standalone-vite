import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import { useState, type HTMLAttributes, type PropsWithChildren } from "react"

type ComponentSettings = {
  showMultiples?: boolean | null | undefined
}

type ComponentResponse = { direction: "CALL" | "PUT"; size: 0.25 | 0.5 | 1 | 2 }

type ComponentProps = {
  market?: MarketOrNothing
  price?: PriceOrNothing

  settings?: ComponentSettings

  onOrder?: (response: ComponentResponse) => void

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function StartContract({ market, price, settings, onOrder, name = "StartContract", ...rest }: PropsWithChildren<ComponentProps>) {
  const { showMultiples = false } = settings || {}

  const [size, setSize] = useState<0.25 | 0.5 | 1 | 2>(1)
  const [direction, setDirection] = useState<"CALL" | "PUT">("CALL")

  const displayCallLabel = showMultiples ? "Call" : "Buy"
  const displayPutLabel = showMultiples ? "Put" : "Sell"

  const displayClassesSizeQuarter = size === 0.25 ? "btn btn-sm btn-primary" : "btn btn-xs btn-outline btn-primary"
  const displayClassesSizeHalf = size === 0.5 ? "btn btn-sm btn-primary" : "btn btn-xs btn-outline btn-primary"
  const displayClassesSizeOne = size === 1 ? "btn btn-sm btn-primary" : "btn btn-xs btn-outline btn-primary"
  const displayClassesSizeTwo = size === 2 ? "btn btn-sm btn-primary" : "btn btn-xs btn-outline btn-primary"

  const displayOrderEvent = price?.isMarketClosed ? "As soon as the market opens" : "As soon as you can before the market closes today"

  const classNamesBuy = direction === "CALL" ? "btn btn-sm btn-primary btn-buy" : "btn btn-xs btn-outline btn-primary btn-buy"
  const classNamesSell = direction === "PUT" ? "btn btn-sm btn-primary btn-sell" : "btn btn-xs btn-outline btn-primary btn-sell"

  let contractPrefix = ""
  let contractSuffix = ""

  if (size === 0.25) {
    contractPrefix = "of a"
  } else if (size === 0.5) {
    contractPrefix = "a"
  } else if (size === 2) {
    contractSuffix = "s"
  }

  const handlePlaceOrder = () => {
    if (onOrder) {
      onOrder({ direction, size })
    }
  }

  const handleDirectionBuy = () => {
    setDirection("CALL")
  }

  const handleDirectionSell = () => {
    setDirection("PUT")
  }

  const handleSizeQuarter = () => {
    setSize(0.25)
  }

  const handleSizeHalf = () => {
    setSize(0.5)
  }

  const handleSizeOne = () => {
    setSize(1)
  }

  const handleSizeTwo = () => {
    setSize(2)
  }

  return (
    <div {...rest} data-controller={name}>
      <div className="p-2">
        <div className="divider">I would like to open a position</div>
        <div className="flex flex-col justify-start items-center p-2 gap-4">
          <div className="flex flex-row gap-2 justify-center items-center">
            <div>For</div>
            {showMultiples && (
              <button className={displayClassesSizeQuarter} onClick={handleSizeQuarter}>
                Quarter
              </button>
            )}
            {showMultiples && (
              <button className={displayClassesSizeHalf} onClick={handleSizeHalf}>
                Half
              </button>
            )}
            <button className={displayClassesSizeOne} onClick={handleSizeOne}>
              One
            </button>
            {showMultiples && (
              <button className={displayClassesSizeTwo} onClick={handleSizeTwo}>
                Two
              </button>
            )}
            <div>
              <span>{contractPrefix}</span> Contract<span>{contractSuffix}</span>
            </div>
          </div>

          <div className="flex flex-row gap-2 justify-center items-center">
            <div>To</div>
            <button className={classNamesBuy} onClick={handleDirectionBuy}>
              {displayCallLabel}
            </button>
            <button className={classNamesSell} onClick={handleDirectionSell}>
              {displayPutLabel}
            </button>
            <div>{market?.name}</div>
          </div>

          <button className="btn  btn-primary rounded-3xl " onClick={handlePlaceOrder}>
            Place the order
          </button>
          <div className="fg--subheading">{displayOrderEvent}</div>
        </div>
      </div>
    </div>
  )
}
