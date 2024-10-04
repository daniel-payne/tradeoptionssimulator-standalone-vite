import useActiveSymbols from "@/data/indexDB/hooks/useActiveSymbols"
import useContentSelection from "@/data/localStorage/hooks/useContentSelection"
import SymbolManager from "@/display/coordinators/SymbolManager"
import TradingFooter from "@/display/coordinators/TradingFooter"
import TradingHeader from "@/display/coordinators/TradingHeader"
import type { HTMLAttributes, PropsWithChildren } from "react"
import { useParams } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradingPage({ name = "TradingPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const { symbol } = useParams()

  if (symbol === undefined) {
    return
  }

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full flex flex-col">
        <TradingHeader />

        <div className="flex-auto p-2">
          <SymbolManager className="h-full w-full" symbol={symbol} defaultView="expanded" defaultContent="both" defaultBehaviors="off" defaultActions="off" />
        </div>
        <TradingFooter />
      </div>
    </div>
  )
}
