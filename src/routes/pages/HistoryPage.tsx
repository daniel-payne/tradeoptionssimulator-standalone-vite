import useActiveTrades from "@/data/indexDB/hooks/useActiveTrades"
import useBalance from "@/data/indexDB/hooks/useBalance"
import useInactiveTrades from "@/data/indexDB/hooks/useInactiveTrades"
import HistoryHeader from "@/display/coordinators/HistoryHeader"
import TradeSummary from "@/display/coordinators/TradeSummary"
import ValueDisplay from "@/display/elements/ValueDisplay"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function HistoryPage({ name = "HistoryPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const balance = useBalance()

  const activeTrades = useActiveTrades()
  const inactiveTrades = useInactiveTrades()

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full">
        <div className="h-full w-full flex flex-col">
          <HistoryHeader />
          <div className="flex-auto p-2 flex flex-col">
            <div className="flex flex-row flex-wrap gap-2 p-2">
              <ValueDisplay label="Player Deposits" value={balance?.userBalance} />
              <ValueDisplay label="Profit From Trading" value={balance?.transactionBalance} />
              <ValueDisplay label="Initial Margins" value={balance?.initialBalance} />
              <ValueDisplay label="Variation Margins" value={balance?.variationBalance} />
              <ValueDisplay className="text-xl" label="Balance" value={balance?.availableBalance} />
            </div>
            <div className="flex-auto p-2 flex flex-col items-start gap-2">
              <div className="divider">Active Trades</div>
              <div className="w-full p-2 flex flex-row flex-wrap">
                {activeTrades?.map((trade) => (
                  <div className="h-auto w-full md:w-1/2 lg:w-1/4 xl:w-1/5 p-2" key={trade.id}>
                    <TradeSummary id={trade.id} />
                  </div>
                ))}
              </div>
              <div className="divider">Closed Trades</div>
              <div className="w-full p-2 flex flex-row flex-wrap">
                {inactiveTrades?.map((trade) => (
                  <div className="h-auto w-full md:w-1/2 lg:w-1/4 xl:w-1/5 p-2" key={trade.id}>
                    <TradeSummary id={trade.id} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
