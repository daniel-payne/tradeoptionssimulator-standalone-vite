import { MarketOrNothing } from "@/data/indexDB/types/Market"
import capitalizedWord from "@/utilities/capitalizedWord"
import formatNumber from "@/utilities/formatNumber"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  market: MarketOrNothing
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketContractDescription({ market, name = "MarketContractDescription", ...rest }: PropsWithChildren<ComponentProps>) {
  if (market == null) {
    return
  }

  let displayContractName = capitalizedWord(market.contractName)
  let displayContractSize

  if (displayContractName?.length < 1) {
    displayContractName = formatNumber(market.contractSize, 0) + " " + market.contractUnit
  } else {
    displayContractSize = "(" + formatNumber(market.contractSize, 0) + " " + market.contractUnit + ")"
  }

  if (displayContractName?.length < 3) {
    displayContractName = "Contract based on dollar amounts"
  }

  return (
    <div {...rest} data-component={name}>
      <div className="text-xs text-secondary opacity-50">One Contract is</div>
      <div className="text-secondary">
        <span>{displayContractName} </span>
        <span>{displayContractSize} </span>
      </div>
    </div>
  )
}
