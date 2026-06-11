import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import ContractSizePicker from "./ContractSizePicker"
import TradeDirectionPicker from "./TradeDirectionPicker"
import { Settings } from "../Settings"

type ComponentResponse = { direction: "CALL" | "PUT"; size: 0.25 | 0.5 | 1 | 2 }

type ComponentProps = {
  market?: MarketOrNothing
  price?: PriceOrNothing

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function StartContract({ market, price, settings = {}, name = "StartContract", ...rest }: PropsWithChildren<ComponentProps>) {
  const [size, setSize] = useState<string>("one")
  const [direction, setDirection] = useState<string>("CALL")

  const displayOrderEvent = price?.isMarketClosed ? "As soon as the market opens" : "As soon as you can before the market closes today"

  const handleContractOpen = () => {
    if (settings.onAction) {
      settings.onAction({
        action: "contractOpen",
        options: {
          symbol: market?.symbol,
          size,
          direction,
        },
      })
    }
  }

  return (
    <div {...rest} data-controller={name}>
      <div className="p-2">
        <div className="divider">I would like to open a position</div>
        <div className="flex flex-col justify-start items-center p-2 gap-4">
          <div className="flex flex-row gap-2 justify-center items-center">
            <div>For</div>
            <ContractSizePicker settings={settings} onPicked={setSize} />
          </div>

          <div className="flex flex-row gap-2 justify-center items-center">
            <div>To</div>
            <TradeDirectionPicker settings={settings} onPicked={setDirection} />
            <div>{market?.name}</div>
          </div>

          <button className="btn  btn-primary rounded-3xl " onClick={handleContractOpen}>
            Place the order
          </button>
          <div className="fg--subheading">{displayOrderEvent}</div>
        </div>
      </div>
    </div>
  )
}
