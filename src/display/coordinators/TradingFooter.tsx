import type { HTMLAttributes, PropsWithChildren } from "react"
import ActiveTradesSummary from "./ActiveTradesSummary"
import InactiveTradesSummary from "./InactiveTradesSummary"
import AccountSummary from "./AccountSummary"
import BalanceModal from "./BalanceModal"
import { Settings } from "../Settings"

type ComponentProps = {
  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradingFooter({ settings = {}, name = "TradingFooter", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-controller={name}>
      <div className="flex flex-row gap-2 justify-between items-center bg-base-200 p-2">
        <ActiveTradesSummary settings={settings} />
        {/*<InactiveTradesSummary />*/}
        <AccountSummary />
      </div>
    </div>
  )
}
