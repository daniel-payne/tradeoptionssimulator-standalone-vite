import { Link } from "react-router"
import { FaArrowUpRightFromSquare, FaHeart } from "react-icons/fa6"

import type { HTMLAttributes, PropsWithChildren } from "react"

import type { Market } from "@/data/indexDB/types/Market"
import favoritesToggle from "@/data/localStorage/controllers/favoritesToggle"

type ComponentProps = {
  market?: Market | undefined | null

  isFavorite?: boolean

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function MarketBehaviors({ market, isFavorite = false, name = "MarketBehaviors", ...rest }: PropsWithChildren<ComponentProps>) {
  const displayFavoriteClassName = isFavorite ? "text-primary my-1 cursor-pointer" : "text-secondary opacity-25  my-1 cursor-pointer"

  const handleToggleFavorites = () => {
    favoritesToggle(market?.symbol)
  }

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-row justify-between gap-2">
        <FaHeart className={displayFavoriteClassName} onClick={handleToggleFavorites} />
        <Link to={`/trading/${market?.symbol}`} target="_blank">
          <FaArrowUpRightFromSquare className="fg--subheading my-1" />
        </Link>
      </div>
    </div>
  )
}
