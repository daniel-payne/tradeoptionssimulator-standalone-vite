import { useState, type HTMLAttributes, type PropsWithChildren } from "react"
import { Link } from "react-router"

import favoritesAdd from "@/data/localStorage/controllers/favoritesAdd"
import favoritesRemove from "@/data/localStorage/controllers/favoritesRemove"
import favoritesToggle from "@/data/localStorage/controllers/favoritesToggle"

import useSymbols from "@/data/indexDB/hooks/useSymbols"

import ActionSelector from "@/display/controllers/ActionSelector"
import BehaviorSelector from "@/display/controllers/BehaviorSelector"
import ChartSelector from "@/display/controllers/ChartSelector"
import ContentChooser from "@/display/controllers/ContentChooser"
import FavoritesSelector from "@/display/controllers/FavoritesSelector"
import RangeChooser from "@/display/controllers/RangeChooser"
import TradeChooser from "@/display/controllers/TradeChooser"
import ViewChooser from "@/display/controllers/ViewChooser"

import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"
import useFavoriteSelection from "@/data/localStorage/hooks/useFavoriteSelection"
import SymbolManager from "@/display/coordinators/SymbolManager"
import SymbolSelector from "@/display/components/SymbolSelector"
import CodeSelector from "@/display/components/CodeSelector"
import useContentSelection from "@/data/localStorage/hooks/useContentSelection"
import useViewSelection from "@/data/localStorage/hooks/useViewSelection"
import useRangeSelection from "@/data/localStorage/hooks/useRangeSelection"
import HeightChooser from "@/display/controllers/HeightChooser"
import WidthChooser from "@/display/controllers/WidthChooser"
import useHeightSelection from "@/data/localStorage/hooks/useHeightSelection"
import useWidthSelection from "@/data/localStorage/hooks/useWidthSelection"
import useTradeSelection from "@/data/localStorage/hooks/useTradeSelection"
import InfoSelector from "@/display/controllers/InfoSelector"
import { Settings } from "@/display/Settings"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TestLayoutPage({ name = "TestLayoutPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [symbol, setSymbol] = useState<string>("^SPX")
  const [code, setCode] = useState<string>("USD")

  const symbols = useSymbols()

  const favoriteList = useFavoriteList()

  const favorite = useFavoriteSelection("on")
  const view = useViewSelection("expanded")
  const content = useContentSelection("form")
  const range = useRangeSelection("1m")
  const trade = useTradeSelection("contract")

  const height = useHeightSelection("full")
  const width = useWidthSelection("full")

  const displayList = favorite === "on" ? favoriteList : symbols

  const displayClassName = `h-${height} w-${width} p-2`

  const settings = {
    favorite,
    view,
    content,
    range,
    trade,
  } as Settings

  return (
    <div {...rest} data-component={name}>
      <div className="p-2 flex flex-col gap-2  h-full w-full">
        <div className=" flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-row gap-2 mt-2 items-center flex-wrap">
            <Link to="/">
              <img src="/pricesimulator-32.png" alt="Home Page" style={{ height: 32, width: 32 }} />
            </Link>
            <Link to="/test">
              <h1 className="text-md text-secondary">Tests</h1>
            </Link>
            <h1 className="text-xl text-secondary">Application Layout</h1>
          </div>
          <div className="flex flex-row gap-2 mt-2 items-center flex-wrap">
            <SymbolSelector symbol={symbol} onSelectionChanged={setSymbol} />
            <CodeSelector code={code} onSelectionChanged={setCode} />
          </div>
        </div>

        <div className="divider">Views</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <HeightChooser />
          <div className="divider divider-horizontal" />
          <WidthChooser />
        </div>

        <div className="divider">Views</div>
        <div className="flex flex-row gap-2 items-center flex-wrap p-2">
          <div className="divider divider-horizontal" />
          <ViewChooser />
          <div className="divider divider-horizontal" />
          <ContentChooser />
          <div className="divider divider-horizontal" />
          <RangeChooser />
          <div className="divider divider-horizontal" />
          <TradeChooser />
          <div className="divider divider-horizontal" />
          <ActionSelector />
          <div className="divider divider-horizontal" />
          <BehaviorSelector />
          <div className="divider divider-horizontal" />
          <InfoSelector />
          <div className="divider divider-horizontal" />
          <ChartSelector />
          <div className="divider divider-horizontal" />
          <FavoritesSelector />
        </div>

        <div className="divider">Components {displayClassName}</div>
        <div className="flex-auto min-h-0 flex flex-row flex-wrap">
          {displayList?.map((symbol) => (
            <div className={displayClassName} key={symbol}>
              <SymbolManager className="h-full w-full" symbol={symbol} settings={settings} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
