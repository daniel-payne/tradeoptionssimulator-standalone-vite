import useClosesFor from "@/data/indexDB/hooks/useClosesFor"
import type { HTMLAttributes, PropsWithChildren } from "react"
import DataSparklineDisplay from "../elements/ClosesDisplay"
import usePriceFor from "@/data/indexDB/hooks/usePriceFor"
import useRangeSelection from "@/data/localStorage/hooks/useRangeSelection"
import ClosesDisplay from "../elements/ClosesDisplay"
import { Settings } from "../Settings"

type ComponentProps = {
  symbol: string

  settings?: Settings

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ClosesManager({ symbol, settings = {}, name = "ClosesManager", ...rest }: PropsWithChildren<ComponentProps>) {
  const data = useClosesFor(symbol)
  const price = usePriceFor(symbol)

  const { range = "1m" } = settings

  if (data == null) {
    return (
      <div className="h-32 flex flex-col items-center justify-center">
        <span>Loading</span>
      </div>
    )
  }

  return (
    <div {...rest} data-controller={name}>
      <ClosesDisplay className="h-full w-full" display={data} price={price} range={range} />
    </div>
  )
}
