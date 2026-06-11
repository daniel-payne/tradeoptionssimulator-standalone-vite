import { useQueryState } from "@keldan-systems/state-mutex"

import type { HTMLAttributes, PropsWithChildren } from "react"

export type Width = "full" | "auto" | "1/2" | "1/3" | "1/4" | "1/5" | "1/6" | "24" | "32" | "40" | "48" | "64" | "80" | "96"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

const UNSELECTED_BUTTON = "btn btn-sm btn-ghost"
const SELECTED_BUTTON = "btn btn-sm btn-info"

export default function WidthChooser({ name = "WidthChooser", ...rest }: PropsWithChildren<ComponentProps>) {
  const [view, setView] = useQueryState<Width>("width", "auto")

  const handleClick = (range: Width) => {
    return () => setView(range)
  }

  // w-full w-auto w-1/2 w-1/3 w-1/4 w-1/5 w-1/6 w-24 w-32 w-40 w-48 w-64 w-80 w-96
  const handleClickFUL = handleClick("full")
  const handleClickAUT = handleClick("auto")

  const handleClick12 = handleClick("1/2")
  const handleClick13 = handleClick("1/3")
  const handleClick14 = handleClick("1/4")
  const handleClick15 = handleClick("1/5")
  const handleClick16 = handleClick("1/6")

  const handleClick40 = handleClick("40")
  const handleClick48 = handleClick("48")
  const handleClick80 = handleClick("80")
  const handleClick96 = handleClick("96")

  let classNameFUL = UNSELECTED_BUTTON
  let classNameAUT = UNSELECTED_BUTTON

  let className12 = UNSELECTED_BUTTON
  let className13 = UNSELECTED_BUTTON
  let className14 = UNSELECTED_BUTTON
  let className15 = UNSELECTED_BUTTON
  let className16 = UNSELECTED_BUTTON

  let className40 = UNSELECTED_BUTTON
  let className48 = UNSELECTED_BUTTON
  let className80 = UNSELECTED_BUTTON
  let className96 = UNSELECTED_BUTTON

  switch (view) {
    case "full":
      classNameFUL = SELECTED_BUTTON
      break
    case "auto":
      classNameAUT = SELECTED_BUTTON
      break
    case "1/2":
      className12 = SELECTED_BUTTON
      break
    case "1/3":
      className13 = SELECTED_BUTTON
      break
    case "1/4":
      className14 = SELECTED_BUTTON
      break
    case "1/5":
      className15 = SELECTED_BUTTON
      break
    case "1/6":
      className16 = SELECTED_BUTTON
      break
    case "40":
      className40 = SELECTED_BUTTON
      break
    case "48":
      className48 = SELECTED_BUTTON
      break
    case "80":
      className80 = SELECTED_BUTTON
      break
    case "96":
      className96 = SELECTED_BUTTON
      break
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className={classNameAUT} onClick={handleClickAUT}>
          Auto
        </div>
        <div className={classNameFUL} onClick={handleClickFUL}>
          Full
        </div>
        <div className={className12} onClick={handleClick12}>
          1/2
        </div>
        <div className={className13} onClick={handleClick13}>
          1/3
        </div>
        <div className={className14} onClick={handleClick14}>
          1/4
        </div>
        <div className={className15} onClick={handleClick15}>
          1/5
        </div>
        <div className={className16} onClick={handleClick16}>
          1/6
        </div>
        <div className={className40} onClick={handleClick40}>
          40
        </div>
        <div className={className48} onClick={handleClick48}>
          48
        </div>
        <div className={className80} onClick={handleClick80}>
          80
        </div>
        <div className={className96} onClick={handleClick96}>
          96
        </div>
      </div>
    </div>
  )
}
