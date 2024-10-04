import type { HTMLAttributes, PropsWithChildren } from "react"

import useTimer from "@/data/indexDB/hooks/useTimer"

// import { FaGear } from "react-icons/fa6"

import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import formatIndexAsDay from "@/utilities/formatIndexAsDay"

import RangeChooser from "../controllers/RangeChooser"
import ApplicationNavigation from "../elements/ApplicationNavigation"
import ViewChooser from "../controllers/ViewChooser"
import useViewSelection from "@/data/localStorage/hooks/useViewSelection"
import FavoritesSelector from "../controllers/FavoritesSelector"
import useFavoriteSelection from "@/data/localStorage/hooks/useFavoriteSelection"

type ComponentProps = {
  focus?: string

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function PricesHeader({ name = "PricesHeader", ...rest }: PropsWithChildren<ComponentProps>) {
  const timer = useTimer()

  const { currentIndex } = timer

  const favorite = useFavoriteSelection()
  const view = useViewSelection()

  const isViewDisabled = favorite === "off"
  const isRangeDisabled = view === "contracted" || isViewDisabled

  return (
    <div {...rest} data-controller={name}>
      <div className="w-full flex flex-row gap-2 justify-between items-center bg-base-200 p-2">
        <ApplicationNavigation title="Closing Prices" />
        <div className="flex-auto flex flex-row gap2 justify-center items-center">
          <FavoritesSelector />
          <div className="divider divider-horizontal" />
          <ViewChooser isDisabled={isViewDisabled} />
          <div className="divider divider-horizontal" />
          <RangeChooser isDisabled={isRangeDisabled} />
        </div>
        <div className="flex flex-row gap-2 justify-right items-center bg-base-200 p-2">
          <div className="w-4 font-bold text-right">{formatIndexAsDay(currentIndex)}</div>
          <div className="w-24 ps-2 text-sm text-right">{formatIndexAsDate(currentIndex)}</div>
          {/* <FaGear /> */}
        </div>
      </div>
    </div>
  )
}
