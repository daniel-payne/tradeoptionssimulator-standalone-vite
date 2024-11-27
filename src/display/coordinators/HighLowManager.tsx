import useClosesFor from "@/data/indexDB/hooks/useClosesFor"
import type { HTMLAttributes, PropsWithChildren } from "react"

import usePriceFor from "@/data/indexDB/hooks/usePriceFor"

import useHighsFor from "@/data/indexDB/hooks/useHighsFor"
import useLowsFor from "@/data/indexDB/hooks/useLowsFor"
import HighLowChart from "../elements/HighLowChart"
import useActiveTradesFor from "@/data/indexDB/hooks/useActiveTradesFor"
import useInactiveTradesFor from "@/data/indexDB/hooks/useInactiveTradesFor"
import { Settings } from "../Settings"

type ComponentProps = {
  symbol: string

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function HighLowManager({ symbol, settings = {}, name = "HighLowManager", ...rest }: PropsWithChildren<ComponentProps>) {
  const highs = useHighsFor(symbol)
  const lows = useLowsFor(symbol)
  const closes = useClosesFor(symbol)

  const price = usePriceFor(symbol)

  const activeTrades = useActiveTradesFor(symbol)
  const inactiveTrades = useInactiveTradesFor(symbol)

  const { range = "1m" } = settings

  if (price == null) {
    return (
      <div className="h-32 flex flex-col items-center justify-center">
        <span>Loading</span>
      </div>
    )
  }

  return (
    <div {...rest} data-controller={name}>
      <HighLowChart
        className="h-full w-full"
        highs={highs}
        lows={lows}
        closes={closes}
        price={price}
        activeTrades={activeTrades}
        inactiveTrades={inactiveTrades}
        range={range}
      />
    </div>
  )
}
