import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Settings } from "../Settings"
import ContractSizePicker from "../controllers/ContractSizePicker"
import TradeDirectionPicker from "../controllers/TradeDirectionPicker"
import { MarketOrNothing } from "@/data/indexDB/types/Market"
import { PriceOrNothing } from "@/data/indexDB/types/Price"
import { Trade } from "@/data/indexDB/types/Trade"

type ComponentProps = {
  trade: Trade | null | undefined

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ContractCloseAction({ trade, settings = {}, name = "ContractActions", children, ...rest }: PropsWithChildren<ComponentProps>) {
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
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 items-center">
        <button className="btn btn-sm btn-primary rounded-3xl " onClick={handleTradeClose}>
          Close The Trade
        </button>
      </div>
    </div>
  )
}
