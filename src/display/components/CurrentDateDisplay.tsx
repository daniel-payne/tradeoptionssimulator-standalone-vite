import type { HTMLAttributes, PropsWithChildren } from "react"

import formatIndexAsDay from "@/utilities/formatIndexAsDay"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"

import type { Timer } from "@/data/indexDB/types/Timer"

type ComponentProps = {
  timer?: Timer

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrentDateDisplay({ timer, name = "CurrentDateDisplay", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <strong>{formatIndexAsDay(timer?.currentIndex)}</strong> {formatIndexAsDate(timer?.currentIndex)}
    </div>
  )
}
