import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Settings } from "../Settings"
import ContractSizePicker from "../controllers/ContractSizePicker"
import TradeDirectionPicker from "../controllers/TradeDirectionPicker"
import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"

type ComponentProps = {
  symbol: string | null | undefined

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ContractOpenActions({ symbol, settings = {}, name = "ContractActions", children, ...rest }: PropsWithChildren<ComponentProps>) {
  const [size, setSize] = useState<string>("one")
  const [direction, setDirection] = useState<string>("CALL")

  const handlePlaceOrder = () => {
    if (settings.onAction) {
      settings.onAction({
        action: "contractOpen",
        options: {
          symbol,
          size,
          direction,
        },
      })
    }
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 items-center">
        <ContractSizePicker settings={settings} onPicked={setSize} />
        <div className="divider divider-horizontal"></div>
        <TradeDirectionPicker settings={settings} onPicked={setDirection} />
        <div className="divider divider-horizontal"></div>
        <button className="btn btn-sm btn-primary rounded-3xl " onClick={handlePlaceOrder}>
          Place the Order
        </button>
      </div>
    </div>
  )
}
