import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Settings } from "../Settings"
import capitalizedWord from "@/utilities/capitalizedWord"

type ComponentProps = {
  size?: string | number

  settings?: Settings

  onPicked?: (value: string) => void

  name?: string
} & HTMLAttributes<HTMLDivElement>

const UNSELECTED_BUTTON = "btn btn-xs btn-primary btn-outline"
const SELECTED_BUTTON = "btn btn-sm btn-primary"

const options = ["QUARTER", "HALF", "ONE", "TWO"]

export default function ContractSizePicker({ onPicked, size = "ONE", settings = {}, name = "ContractSizePicker", ...rest }: PropsWithChildren<ComponentProps>) {
  const readOnly = onPicked == null

  if (size === 0.25) {
    size = "QUARTER"
  } else if (size === 0.5) {
    size = "HALF"
  } else if (size === 1) {
    size = "ONE"
  } else if (size === 2) {
    size = "TWO"
  }

  const [data, setData] = useState<string>(size as string)

  let contractPrefix = ""
  let contractSuffix = ""

  if (data === "QUARTER") {
    contractPrefix = "of a"
  } else if (data === "HALF") {
    contractPrefix = "a"
  } else if (data === "TWO") {
    contractSuffix = "s"
  }

  const handleClick = (value: string) => () => {
    setData(value)

    if (onPicked) {
      onPicked(value)
    }
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">
        {options.map((option) => {
          if (settings.showMultiples === false && option !== "ONE") {
            return
          }
          if (readOnly === true && option !== data) {
            return
          }

          return (
            <div className={option === data ? SELECTED_BUTTON : UNSELECTED_BUTTON} key={option} onClick={handleClick(option)}>
              {capitalizedWord(option)}
            </div>
          )
        })}
        {settings.showDescription && (
          <div className="">
            {contractPrefix} contract{contractSuffix}
          </div>
        )}
      </div>
    </div>
  )
}
