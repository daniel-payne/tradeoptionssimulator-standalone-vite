import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import capitalizedWord from "@/utilities/capitalizedWord"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatNumber from "@/utilities/formatNumber"
import formatValue from "@/utilities/formatValue"
import type { HTMLAttributes, PropsWithChildren } from "react"
import { FaArrowRight, FaArrowTrendDown, FaArrowTrendUp, FaArrowTurnDown, FaArrowTurnUp, FaBuildingLock } from "react-icons/fa6"

type ComponentProps = {
  market: MarketOrNothing
  price: PriceOrNothing

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketPriceDescription({ market, price, name = "MarketPriceDescription", ...rest }: PropsWithChildren<ComponentProps>) {
  if (price == null || market == null) {
    return null
  }

  const priceDecimals = market.priceDecimals ?? 2

  const isMarketClosed = price?.isMarketClosed
  const isMarketOpen = !isMarketClosed

  const priceIndex = isMarketClosed ? price?.priorIndex : price?.currentIndex

  const priorMovement = (price?.priorClose ?? 0) - (price?.priorOpen ?? 0)
  const priorPercent = (priorMovement / (price?.priorOpen ?? 1)) * 100

  const priorHighPercent = (((price?.priorHigh ?? 0) - (price?.priorOpen ?? 0)) / (price?.priorOpen ?? 1)) * 100
  const priorLowPercent = (((price?.priorLow ?? 0) - (price?.priorOpen ?? 0)) / (price?.priorOpen ?? 1)) * 100

  const overnightMovement = (price?.currentOpen ?? 0) - (price?.priorClose ?? 0)
  const overnightPercent = (overnightMovement / (price?.priorClose ?? 1)) * 100

  let priorMovementIcon
  let priorMovementClass

  if (priorMovement > 0) {
    priorMovementIcon = <FaArrowTrendUp />
    priorMovementClass = "fg-price-info--profit"
  } else if (priorMovement < 0) {
    priorMovementIcon = <FaArrowTrendDown />
    priorMovementClass = "fg-price-info--loss"
  } else {
    priorMovementIcon = <FaArrowRight />
    priorMovementClass = "fg-price-info--no-movement"
  }

  let currentMovementIcon
  let currentMovementClass

  if (overnightMovement > 0) {
    currentMovementIcon = <FaArrowTurnUp />
    currentMovementClass = "fg-price-info--profit"
  } else if (overnightMovement < 0) {
    currentMovementIcon = <FaArrowTurnDown />
    currentMovementClass = "fg-price-info--loss"
  } else {
    currentMovementIcon = <FaArrowRight />
    currentMovementClass = "fg-price-info--no-movement"
  }

  return (
    <div {...rest} data-component={name}>
      <div className="text-xs text-secondary opacity-50 pb-2 flex flex-row items-center">
        Recent Prices for {isMarketClosed ? "last" : ""} trading day {formatIndexAsDate(priceIndex)}
      </div>
      <div className="flex flex-row justify-between items-center">
        <div className="w-1/6 flex justify-center">
          <span>{formatNumber(price.priorOpen, priceDecimals)}</span>
        </div>
        <div className="w-2/6 flex flex-col items-center">
          <div>
            <span className="pe-2">{formatNumber(price.priorHigh, priceDecimals)}</span>
            <span className="text-sm opacity-50">{formatNumber(priorHighPercent, 1)}%</span>
          </div>
          <div className={priorMovementClass}>{priorMovementIcon}</div>
          <div>
            <span className="pe-2">{formatNumber(price.priorLow, priceDecimals)}</span>{" "}
            <span className="text-sm opacity-50">{formatNumber(priorLowPercent, 1)}%</span>
          </div>
        </div>
        <div className="w-1/6  flex justify-center">
          <span className="pe-2">{formatNumber(price.priorClose, priceDecimals)}</span>
          <span className="text-sm opacity-50">{formatNumber(priorPercent, 1)}%</span>
        </div>
        <div className="w-2/6 flex justify-center items-center ">
          {isMarketOpen && (
            <>
              <span className={currentMovementClass}>{currentMovementIcon}</span>
              <span className="ps-4 pe-2">{formatNumber(price.currentOpen, priceDecimals)}</span>
              <span className="text-sm opacity-50">{formatNumber(overnightPercent, 1)}%</span>
            </>
          )}
          {isMarketClosed && (
            <>
              <FaBuildingLock className="me-2 text-secondary" />
              <span className="text-secondary text-sm">Market Closed</span>
            </>
          )}
        </div>
      </div>
      {/* 
      <pre>{JSON.stringify(price, null, 2)}</pre> */}
    </div>
  )
}
