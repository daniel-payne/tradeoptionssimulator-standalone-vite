import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Settings } from "../Settings"
import ContractSizePicker from "../controllers/ContractSizePicker"
import TradeDirectionPicker from "../controllers/TradeDirectionPicker"
import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import formatValue from "@/utilities/formatValue"

type ComponentProps = {
  symbol: string | null | undefined
  contractValue?: number | null | undefined

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ContractOpenActions({
  symbol,
  contractValue,
  settings = {},
  name = "ContractActions",
  children,
  ...rest
}: PropsWithChildren<ComponentProps>) {
  const [size, setSize] = useState<string>("one")
  const [direction, setDirection] = useState<string>("CALL")

  const sizeValue = size === "ONE" ? 1 : size === "TWO" ? 2 : size === "QUARTER" ? 0.25 : size === "HALF" ? 0.5 : 1

  const displayValue = settings.showDescription === true && contractValue != null ? formatValue(contractValue * sizeValue, false, "USD", 2) : undefined

  const handleContractOpen = () => {
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
        <TradeDirectionPicker settings={settings} onPicked={setDirection} />
        <div className="divider divider-horizontal"></div>
        <ContractSizePicker settings={settings} onPicked={setSize} />
        {displayValue != null && <span className="text-sm opacity-50">for {displayValue}</span>}
        <div className="divider divider-horizontal"></div>
        <button className="btn btn-sm btn-primary rounded-3xl " onClick={handleContractOpen}>
          Place the Order
        </button>
      </div>
    </div>
  )
}
