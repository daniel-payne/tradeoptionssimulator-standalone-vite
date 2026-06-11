import type { Transaction } from "@/data/indexDB/types/Transaction"
import capitalizedWord from "@/utilities/capitalizedWord"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"
import formatValue from "@/utilities/formatValue"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  transaction: Transaction

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TransactionDetails({ transaction, name = "TransactionDetails", ...rest }: PropsWithChildren<ComponentProps>) {
  const displaySource = capitalizedWord(transaction.source.toString().toLowerCase())

  return (
    <div {...rest} data-component={name}>
      <div className="rounded-xl p-4 bg-base-300 shadow-xl min-w-64">
        <div className="p-2">
          <div className="truncate">
            <span className="text-xl font-semibold text-primary">
              {formatIndexAsDay(transaction.index)} {formatIndexAsDate(transaction.index)}
            </span>
            <span className="ps-2 text-secondary text-sm"> {displaySource}</span>
          </div>
          <div className="text-right text-xl p-4">{formatValue(transaction.value, true)}</div>
          <div className="text-xs text-secondary">{transaction.id}</div>
        </div>
      </div>
    </div>
  )
}
