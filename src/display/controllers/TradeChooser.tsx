import { useQueryState } from "@keldan-systems/state-mutex"

import { FaCircleDollarToSlot, FaDollarSign, FaSackDollar, FaScaleBalanced, FaCashRegister, FaCartShopping } from "react-icons/fa6"

import type { HTMLAttributes, PropsWithChildren } from "react"

export type Trade = "contract" | "contracts" | "dollar" | "option" | "hedge"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

const UNSELECTED_BUTTON = "btn btn-sm btn-ghost"
const SELECTED_BUTTON = "btn btn-sm btn-info"

const TOOLTIP_CON = "Trade in Contract"
const TOOLTIP_COS = "Trade multiples of Contracts"
const TOOLTIP_DOL = "Trade Dollars"
const TOOLTIP_OPT = "Create Option"
const TOOLTIP_HED = "Hedge"

export default function TradeChooser({ name = "TradeChooser", ...rest }: PropsWithChildren<ComponentProps>) {
  const [view, setView] = useQueryState<Trade>("trade", "contract")

  const handleClick = (range: Trade) => {
    return () => setView(range)
  }

  const handleClickCON = handleClick("contract")
  const handleClickCOS = handleClick("contracts")
  const handleClickDOL = handleClick("dollar")
  const handleClickOPT = handleClick("option")
  const handleClickHED = handleClick("hedge")

  let classNameCON = UNSELECTED_BUTTON
  let classNameCOS = UNSELECTED_BUTTON
  let classNameDOL = UNSELECTED_BUTTON
  let classNameOPT = UNSELECTED_BUTTON
  let classNameHED = UNSELECTED_BUTTON

  switch (view) {
    case "contract":
      classNameCON = SELECTED_BUTTON
      break
    case "contracts":
      classNameCOS = SELECTED_BUTTON
      break
    case "dollar":
      classNameDOL = SELECTED_BUTTON
      break
    case "option":
      classNameOPT = SELECTED_BUTTON
      break
    case "hedge":
      classNameHED = SELECTED_BUTTON
      break
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row gap-2 justify-center items-center">
        <div className="tooltip tooltip-bottom" data-tip={TOOLTIP_CON} onClick={handleClickCON}>
          <div className={classNameCON}>
            <FaSackDollar />
          </div>
        </div>
        <div className="tooltip tooltip-bottom" data-tip={TOOLTIP_COS} onClick={handleClickCOS}>
          <div className={classNameCOS}>
            <FaSackDollar />
          </div>
        </div>
        <div className="tooltip tooltip-bottom" data-tip={TOOLTIP_DOL} onClick={handleClickDOL}>
          <div className={classNameDOL}>
            <FaDollarSign />
          </div>
        </div>
        <div className="tooltip tooltip-bottom" data-tip={TOOLTIP_OPT} onClick={handleClickOPT}>
          <div className={classNameOPT}>
            <FaCircleDollarToSlot />
          </div>
        </div>
        <div className="tooltip tooltip-bottom" data-tip={TOOLTIP_HED} onClick={handleClickHED}>
          <div className={classNameHED}>
            <FaCashRegister />
          </div>
        </div>
      </div>
    </div>
  )
}
