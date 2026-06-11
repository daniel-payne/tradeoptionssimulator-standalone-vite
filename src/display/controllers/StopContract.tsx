import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import { TradeOrNothing } from "@/data/indexDB/types/Trade"
import { type HTMLAttributes, type PropsWithChildren } from "react"
import ContractSizePicker from "./ContractSizePicker"
import { Settings } from "../Settings"
import TradeDirectionPicker from "./TradeDirectionPicker"

type ComponentProps = {
  market?: MarketOrNothing
  price?: PriceOrNothing
  trade?: TradeOrNothing

  settings?: Settings

  onOrder?: () => void

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function StopContract({ market, price, trade, settings = {}, onOrder, name = "StopContract", ...rest }: PropsWithChildren<ComponentProps>) {
  if (trade == null || market == null) {
    return "missing"
  }

  // const { showMultiples = false } = settings

  // const displayCallLabel = showMultiples ? "Call" : "Buying"
  // const displayPutLabel = showMultiples ? "Put" : "Selling"

  // const displayClassesSizeQuarter = trade.size === 0.25 ? "btn btn-sm btn-primary" : "hidden"
  // const displayClassesSizeHalf = trade.size === 0.5 ? "btn btn-sm btn-primary" : "hidden"
  // const displayClassesSizeOne = trade.size === 1 ? "btn btn-sm btn-primary" : "hidden"
  // const displayClassesSizeTwo = trade.size === 2 ? "btn btn-sm btn-primary" : "hidden"

  const displayOrderEvent = price?.isMarketClosed ? "As soon as the market opens" : "As soon as you can before the market closes today"

  // const classNamesBuy = trade.direction === "PUT" ? "btn btn-sm btn-primary btn-buy" : "hidden"
  // const classNamesSell = trade.direction === "CALL" ? "btn btn-sm btn-primary btn-sell" : "hidden"

  // let contractPrefix = ""
  // let contractSuffix = ""

  // if (trade.size === 0.25) {
  //   contractPrefix = "of a"
  // } else if (trade.size === 0.5) {
  //   contractPrefix = "a"
  // } else if (trade.size === 2) {
  //   contractSuffix = "s"
  // }

  const tradeDirection = trade.direction === "CALL" ? "PUT" : "CALL"

  const handleTradeClose = () => {
    if (settings.onAction) {
      settings.onAction({
        action: "tradeClose",
        options: {
          id: trade?.id,
        },
      })
    }
  }

  return (
    <div {...rest} data-controller={name}>
      <div className="p-2">
        <div className="divider">I would like to close a position</div>
        <div className="flex flex-col justify-start items-center p-2 gap-4">
          <div className="flex flex-row gap-2 justify-center items-center">
            <div>By opening</div>
          </div>

          <div className="flex flex-row gap-2 justify-center items-center">
            <ContractSizePicker size={trade.size} settings={settings} />
            <div>to</div>
            <TradeDirectionPicker direction={tradeDirection} settings={settings} />
            <div>{market?.name}</div>
          </div>

          <button className="btn  btn-primary rounded-3xl " onClick={handleTradeClose}>
            Place the order
          </button>
          <div className="fg--subheading">{displayOrderEvent}</div>
        </div>
      </div>
    </div>
  )
}
