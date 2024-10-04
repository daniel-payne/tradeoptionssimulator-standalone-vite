import { useQueryState } from "@keldan-systems/state-mutex"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  isDisabled?: boolean

  name?: string
} & HTMLAttributes<HTMLDivElement>

export type Range = "at" | "5y" | "1y" | "3m" | "1m"

const UNSELECTED_BUTTON = "btn btn-sm btn-ghost"
const SELECTED_BUTTON = "btn btn-sm btn-info"

export default function RangeChooser({ isDisabled = false, name = "RangeChooser", ...rest }: PropsWithChildren<ComponentProps>) {
  const [range, setRange] = useQueryState<Range>("range", "1m")

  const handleClick = (range: Range) => {
    return () => setRange(range)
  }

  const handleClickAT = handleClick("at")
  const handleClick5Y = handleClick("5y")
  const handleClick1Y = handleClick("1y")
  const handleClick3M = handleClick("3m")
  const handleClick1M = handleClick("1m")

  let classNameAT = UNSELECTED_BUTTON
  let className5Y = UNSELECTED_BUTTON
  let className1Y = UNSELECTED_BUTTON
  let className3M = UNSELECTED_BUTTON
  let className1M = UNSELECTED_BUTTON

  switch (range) {
    case "at":
      classNameAT = SELECTED_BUTTON
      break
    case "5y":
      className5Y = SELECTED_BUTTON
      break
    case "1y":
      className1Y = SELECTED_BUTTON
      break
    case "3m":
      className3M = SELECTED_BUTTON
      break
    case "1m":
      className1M = SELECTED_BUTTON
      break
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">
        <button className={classNameAT} onClick={handleClickAT} disabled={isDisabled}>
          1970
        </button>
        <button className={className5Y} onClick={handleClick5Y} disabled={isDisabled}>
          5Y
        </button>
        <button className={className1Y} onClick={handleClick1Y} disabled={isDisabled}>
          1Y
        </button>
        <button className={className3M} onClick={handleClick3M} disabled={isDisabled}>
          3M
        </button>
        <button className={className1M} onClick={handleClick1M} disabled={isDisabled}>
          1M
        </button>
      </div>
    </div>
  )
}
