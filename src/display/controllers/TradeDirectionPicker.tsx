import { useQueryState } from "@keldan-systems/state-mutex"

import { FaFileLines, FaChartLine, FaList, FaTableColumns, FaMoneyCheckDollar, FaChartArea } from "react-icons/fa6"

import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Settings } from "../Settings"

type ComponentProps = {
  direction?: string

  settings?: Settings

  onPicked?: (value: string) => void

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradeDirectionPicker({
  onPicked,
  direction = "CALL",
  settings = {},
  name = "TradeDirectionPicker",
  ...rest
}: PropsWithChildren<ComponentProps>) {
  const readOnly = onPicked == null

  const [data, setData] = useState<string>(direction?.toUpperCase())

  const classNamesBuy = data === "CALL" ? "btn btn-sm btn-primary btn-buy" : "btn btn-xs btn-outline btn-primary btn-buy"
  const classNamesSell = data === "PUT" ? "btn btn-sm btn-primary btn-sell" : "btn btn-xs btn-outline btn-primary btn-sell"

  const { showMultiples = false } = settings

  const handleClick = (value: string) => () => {
    setData(value)

    if (onPicked) {
      onPicked(value)
    }
  }

  let content = (
    <>
      <button className={classNamesBuy} onClick={handleClick("CALL")}>
        {showMultiples === true ? "Call" : "Buy"}
      </button>
      <button className={classNamesSell} onClick={handleClick("PUT")}>
        {showMultiples === true ? "Put" : "Sell"}
      </button>
    </>
  )

  if (readOnly === true) {
    content = (
      <>
        {data === "CALL" && (
          <button className={classNamesBuy} onClick={handleClick("CALL")}>
            {showMultiples === true ? "Call" : "Buy"}
          </button>
        )}
        {data === "PUT" && (
          <button className={classNamesSell} onClick={handleClick("PUT")}>
            {showMultiples === true ? "Put" : "Sell"}
          </button>
        )}
      </>
    )
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">{content}</div>
    </div>
  )
}
