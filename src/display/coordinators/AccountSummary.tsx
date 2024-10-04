import useBalance from "@/data/indexDB/hooks/useBalance"
import formatValue from "@/utilities/formatValue"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function AccountSummary({ name = "AccountSummary", ...rest }: PropsWithChildren<ComponentProps>) {
  const balance = useBalance()

  const displayBalance = formatValue(balance, false)

  return (
    <div {...rest} data-controller={name}>
      <div className="pe-2 text-profit">{displayBalance}</div>
    </div>
  )
}
