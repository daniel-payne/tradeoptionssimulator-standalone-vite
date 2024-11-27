import formatValue from "@/utilities/formatValue"
import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  label: string
  value: number

  showCents?: boolean

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ValueDisplay({ label, value, showCents = false, name = "DefaultElement", ...rest }: PropsWithChildren<ComponentProps>) {
  const valueClassName = (value ?? 0) > 0 ? "text-profit text-right" : "text-loss  text-right"

  return (
    <div {...rest} data-controller={name}>
      <div className="rounded-lg bg-base-200 shadow-2xl p-4 w-64">
        <div className="flex flex-row justify-between items-center">
          <div className="text-secondary">{label}</div>
          <div className={valueClassName}>{formatValue(value, showCents)}</div>
        </div>
      </div>
    </div>
  )
}
