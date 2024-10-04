import ScenariosHeader from "@/display/coordinators/ScenariosHeader"
import SymbolManager from "@/display/coordinators/SymbolManager"
import TradingFooter from "@/display/coordinators/TradingFooter"
import TradingHeader from "@/display/coordinators/TradingHeader"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ScenariosPage({ name = "ScenariosPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const displayList = ["LC.F"]

  const displayClassName = `h-full w-full p-2`

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full flex flex-col last:">
        <ScenariosHeader />

        <div className="flex-auto min-h-0 flex flex-row flex-wrap overflow-auto"></div>

        {/* <TradingFooter /> */}
      </div>
    </div>
  )
}
