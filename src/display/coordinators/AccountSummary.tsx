import useBalance from "@/data/indexDB/hooks/useBalance"

import formatValue from "@/utilities/formatValue"
import type { HTMLAttributes, PropsWithChildren } from "react"
import BalanceModal, { BALANCE_MODAL } from "./BalanceModal"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function AccountSummary({ name = "AccountSummary", ...rest }: PropsWithChildren<ComponentProps>) {
  const balance = useBalance()

  const availableBalance = balance?.availableBalance ?? 0

  const displayBalance = formatValue(availableBalance, false)

  const displayColor = availableBalance > 500 ? "text-profit" : availableBalance > 100 ? "text-partial" : "text-loss"

  const displayClassName = `btn btn-sm btn-ghost pe-2 ${displayColor}`

  const handleShowBalanceModal = async () => {
    const element = document?.getElementById(BALANCE_MODAL) as HTMLDialogElement

    if (element) {
      element.showModal()
    }
  }

  return (
    <div {...rest} data-controller={name}>
      <div className={displayClassName} onClick={handleShowBalanceModal}>
        {displayBalance}
      </div>
    </div>
  )
}
