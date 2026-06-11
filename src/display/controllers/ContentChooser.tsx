import { useQueryState } from "@keldan-systems/state-mutex"

import { FaFileLines, FaChartLine, FaList, FaTableColumns, FaMoneyCheckDollar, FaChartArea } from "react-icons/fa6"

import type { HTMLAttributes, PropsWithChildren } from "react"

export type Content = "none" | "info" | "price" | "sparkline" | "chart" | "form" | "both"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

const UNSELECTED_BUTTON = "btn btn-sm btn-ghost"
const SELECTED_BUTTON = "btn btn-sm btn-info"

export default function ContentChooser({ name = "ContentChooser", ...rest }: PropsWithChildren<ComponentProps>) {
  const [view, setView] = useQueryState<Content>("content", "chart")

  const handleClick = (range: Content) => {
    return () => setView(range)
  }

  const handleClickINF = handleClick("info")
  const handleClickPRI = handleClick("price")
  const handleClickSPL = handleClick("sparkline")
  const handleClickCHA = handleClick("chart")
  const handleClickFOR = handleClick("form")
  const handleClickBOT = handleClick("both")

  let classNameCHA = UNSELECTED_BUTTON
  let classNameSPL = UNSELECTED_BUTTON
  let classNameFOR = UNSELECTED_BUTTON
  let classNameBOT = UNSELECTED_BUTTON
  let classNameINF = UNSELECTED_BUTTON
  let classNamePRI = UNSELECTED_BUTTON

  switch (view) {
    case "chart":
      classNameCHA = SELECTED_BUTTON
      break
    case "sparkline":
      classNameSPL = SELECTED_BUTTON
      break
    case "form":
      classNameFOR = SELECTED_BUTTON
      break
    case "both":
      classNameBOT = SELECTED_BUTTON
      break
    case "info":
      classNameINF = SELECTED_BUTTON
      break
    case "price":
      classNamePRI = SELECTED_BUTTON
      break
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className={classNameINF} onClick={handleClickINF}>
          <FaFileLines />
        </div>
        <div className={classNamePRI} onClick={handleClickPRI}>
          <FaMoneyCheckDollar />
        </div>
        <div className="tooltip tooltip-open tooltip-bottom" data-tooltip="Sparkline">
          <div className={classNameSPL} onClick={handleClickSPL}>
            <FaChartLine />
          </div>
        </div>
        <div className="tooltip tooltip-open tooltip-bottom" data-tooltip="Graph">
          <div className={classNameCHA} onClick={handleClickCHA}>
            <FaChartArea />
          </div>
        </div>
        <div className={classNameFOR} onClick={handleClickFOR}>
          <FaList />
        </div>
        <div className={classNameBOT} onClick={handleClickBOT}>
          <FaTableColumns />
        </div>
      </div>
    </div>
  )
}
