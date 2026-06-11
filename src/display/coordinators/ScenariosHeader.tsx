import type { HTMLAttributes, PropsWithChildren } from "react"

import useTimer from "@/data/indexDB/hooks/useTimer"

// import { FaGear } from "react-icons/fa6"

import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"

import RangeChooser from "../controllers/RangeChooser"
import ApplicationNavigation from "../elements/ApplicationNavigation"

type ComponentProps = {
  focus?: string

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ScenariosHeader({ name = "ScenariosHeader", ...rest }: PropsWithChildren<ComponentProps>) {
  const timer = useTimer()

  const { currentIndex } = timer

  return (
    <div {...rest} data-controller={name}>
      <div className="w-full flex flex-row gap-2 justify-between items-center bg-base-200 p-2">
        <ApplicationNavigation title="Scenarios" />
        <div className="flex flex-row gap2 justify-center items-center"></div>
        <div className="flex flex-row gap-2 justify-right items-center bg-base-200 p-2">
          <div className="w-4 font-bold text-right">{formatIndexAsDay(currentIndex)}</div>
          <div className="w-24 ps-2 text-sm text-right">{formatIndexAsDate(currentIndex)}</div>
          {/* <FaGear /> */}
        </div>
      </div>
    </div>
  )
}
