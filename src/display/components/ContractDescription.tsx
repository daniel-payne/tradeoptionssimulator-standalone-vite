import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import { TimerOrNothing } from "@/data/indexDB/types/Timer"

import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"

import formatValue from "@/utilities/formatValue"

import formatDateAsIndex from "@/utilities/formatDateAsIndex"

import type { HTMLAttributes, PropsWithChildren } from "react"
import lastIndexOfMonth from "@/utilities/lastIndexOfMonth"
import formatNumber from "@/utilities/formatNumber"

type ComponentSettings = {
  showMultiples?: boolean | null | undefined
}

type ComponentProps = {
  market?: MarketOrNothing
  price?: PriceOrNothing
  timer?: TimerOrNothing

  settings?: ComponentSettings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ContractDescription({ market, price, timer, settings, name = "ContractDescription", ...rest }: PropsWithChildren<ComponentProps>) {
  if (market == null || price == null || timer == null) {
    return null
  }

  const { showMultiples = false } = settings || {}

  const midPrice = price?.isMarketClosed ? price?.priorClose : price?.currentOpen
  const bidPrice = price?.isMarketClosed ? price?.priorClosingBid : price?.currentBid
  const askPrice = price?.isMarketClosed ? price?.priorClosingAsk : price?.currentAsk

  const midValue = (midPrice ?? 0) * (market?.priceModifier ?? 1)
  const bidValue = (bidPrice ?? 0) * (market?.priceModifier ?? 1)
  const askValue = (askPrice ?? 0) * (market?.priceModifier ?? 1)

  const contractPoints = ((market?.contractSize ?? 1) / (market?.priceSize ?? 1)) * (market?.priceModifier ?? 1)

  const midContract = midValue * (market?.contractSize ?? 1)
  const bidContract = bidValue * (market?.contractSize ?? 1)
  const askContract = askValue * (market?.contractSize ?? 1)

  const midPoints = (midPrice ?? 0) * (contractPoints ?? 1)
  const bidPoints = (bidPrice ?? 0) * (contractPoints ?? 1)
  const askPoints = (askPrice ?? 0) * (contractPoints ?? 1)

  const decimalPlaces = market?.priceDecimals ?? 6

  const displayMidValue = formatValue(midValue, true, "USD", decimalPlaces)
  const displayBidValue = formatValue(bidValue, true, "USD", decimalPlaces)
  const displayAskValue = formatValue(askValue, true, "USD", decimalPlaces)

  const displayMidPoints = formatValue(midPoints, false, "USD", 2)
  const displayBidPoints = formatValue(bidPoints, false, "USD", 2)
  const displayAskPoints = formatValue(askPoints, false, "USD", 2)

  const displayMidContract = formatValue(midContract, false)
  const displayBidContract = formatValue(bidContract, false)
  const displayAskContract = formatValue(askContract, false)

  const displayContractPoints = formatValue(contractPoints, true)

  const displayPricePoint = price?.isMarketClosed ? "fridays close" : "todays opening"

  const endOfContractIndex = lastIndexOfMonth(timer?.currentIndex, "WED", 3)

  // const endOfContractIndex = formatDateAsIndex(endOfContract)

  const displayEndDate = formatIndexAsDate(endOfContractIndex)
  const displayEndDay = formatIndexAsDay(endOfContractIndex)

  const brokerCharge = formatValue(7, false)

  return (
    <div {...rest} data-controller={name}>
      <div className="h-full w-full p-2">
        <div className="text-sm fg--heading">For a contract of {market?.name}, i.e.</div>

        <div className="text-sm fg--subheading">
          <span>{market?.contractName} to be delivered on</span>
          <br />
          <span className="ps-4">
            <strong>{displayEndDate}</strong>
          </span>
        </div>
        {showMultiples && (
          <>
            <div className="text-sm fg--subheading">
              <span>
                Currently
                <strong>
                  &nbsp;{formatNumber(market?.contractSize, 0)} {market?.contractUnit}&nbsp;
                </strong>
                is trading for you
              </span>
              <br />
              <span className="ps-4">
                and buy at
                <strong>&nbsp;{displayAskValue}&nbsp;</strong> per {market.contractUnit}
              </span>
              <br />
              <span className="ps-4">
                to sell at <strong>{displayBidValue}</strong> per {market.contractUnit}
              </span>
            </div>
            <div className="text-sm fg--subheading">
              <span>A contract was trading for you</span>
              <br />

              <span className="ps-4">
                and to buy at <strong>{displayAskContract}</strong>
              </span>
              <br />
              <span className="ps-4">
                to sell at <strong>{displayBidContract}</strong>
              </span>
            </div>
            <div className="text-sm fg--subheading">
              The broker will charge using a <strong>spread</strong> for this transaction
            </div>
          </>
        )}
        {!showMultiples && (
          <>
            {displayContractPoints != null && (
              <div className="text-sm fg--subheading">
                <span>The Profit &amp; Loss is about </span>
                <br />
                <strong className="ps-4">{displayContractPoints}</strong> per index point
              </div>
            )}
            <div className="text-sm fg--subheading">
              <span>At {displayPricePoint} contract was trading for you at</span>
              <br />
              <strong className="ps-4">{displayMidPoints}</strong>
            </div>
            <div className="text-sm fg--subheading">
              The broker will charge <strong>{brokerCharge}</strong> for this transaction
            </div>
          </>
        )}
      </div>
    </div>
  )
}
