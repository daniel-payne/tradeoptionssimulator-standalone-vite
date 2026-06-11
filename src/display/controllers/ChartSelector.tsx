import { useQueryState } from "@keldan-systems/state-mutex"

import { FaChartLine } from "react-icons/fa6"

import type { HTMLAttributes, PropsWithChildren } from "react"

export type Chart = "on" | "off"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

const UNSELECTED_BUTTON = "btn btn-sm btn-ghost"
const SELECTED_BUTTON = "btn btn-sm btn-info"

const TOOLTIP = "Chart"

export default function ChartSelector({ name = "ChartSelector", ...rest }: PropsWithChildren<ComponentProps>) {
  const [view, setView] = useQueryState<Chart>("chart", "off")

  const handleClick = () => {
    const newValue = view === "on" ? "off" : "on"

    setView(newValue)
  }

  let classNameSwitch = UNSELECTED_BUTTON

  switch (view) {
    case "on":
      classNameSwitch = SELECTED_BUTTON
      break
    case "off":
      classNameSwitch = UNSELECTED_BUTTON
      break
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className="tooltip tooltip-bottom" data-tip={TOOLTIP} onClick={handleClick}>
          <div className={classNameSwitch}>
            <FaChartLine />
          </div>
        </div>
      </div>
    </div>
  )
}
