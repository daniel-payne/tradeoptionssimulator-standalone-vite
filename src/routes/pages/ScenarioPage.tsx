import timerStart from "@/data/indexDB/controllers/timerStart"
import timerStop from "@/data/indexDB/controllers/timerStop"
import { ScenarioSpeed } from "@/data/indexDB/enums/ScenarioSpeed"
import useScenarioFor from "@/data/indexDB/hooks/useScenarioFor"

import contractOpen from "@/data/indexDB/controllers/contractOpen"

import useFavoriteList from "@/data/localStorage/hooks/useFavoriteList"
import useRangeSelection from "@/data/localStorage/hooks/useRangeSelection"
import BalanceModal from "@/display/coordinators/BalanceModal"
import SymbolManager from "@/display/coordinators/SymbolManager"
import TradingFooter from "@/display/coordinators/TradingFooter"
import TradingHeader from "@/display/coordinators/TradingHeader"
import { Settings } from "@/display/Settings"
import sizeForCount from "@/utilities/sizeForCount"
import { useState, type HTMLAttributes, type PropsWithChildren } from "react"

import { useParams } from "react-router"
import actionProcess from "@/data/indexDB/controllers/actionProcess"
import ScenarioHeader from "@/display/coordinators/ScenarioHeader"
import ProcessErrorModal, { PROCESSERROR_MODAL } from "@/display/coordinators/ProcessErrorModal"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradingPage({ name = "TradingPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const { ref } = useParams()

  const [processError, setProcessError] = useState<any>(null)

  const scenario = useScenarioFor(ref)

  const favoriteSymbols = useFavoriteList()
  const range = useRangeSelection("1m")

  if (scenario === undefined) {
    return <div>No Scenario</div>
  }

  const scenarioSymbols = scenario?.symbols?.split(",")

  const scenarioSettings = JSON.parse(scenario?.settings ?? "{}")

  const displayWrapperClassName = "h-full w-full min-h-0 min-w-0 flex flex-row flex-wrap overflow-hidden justify-start items-start"

  const displayClassName = sizeForCount(scenarioSymbols.length ?? 1) + " p-2"

  const actionProcessWithErrors = async (instructions: any) => {
    try {
      await actionProcess(instructions)
    } catch (error: any) {
      setProcessError(error.message)

      const element = document?.getElementById(PROCESSERROR_MODAL) as HTMLDialogElement

      if (element) {
        element.showModal()
      }
    }
  }

  const settings = { ...scenarioSettings, range, ...{ onAction: actionProcessWithErrors } } as Settings

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full">
        <BalanceModal />
        <ProcessErrorModal processError={processError} />
        <div className="h-full w-full flex flex-col">
          <ScenarioHeader scenario={scenario} />
          <div className="flex-auto p-2">
            <div className={displayWrapperClassName}>
              {scenarioSymbols.map((symbol) => {
                return (
                  <div className={displayClassName} key={symbol}>
                    <div className="h-full w-full">
                      <SymbolManager className="h-full w-full" symbol={symbol} settings={settings} favoriteSymbols={favoriteSymbols} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <TradingFooter settings={settings} />
        </div>
      </div>
    </div>
  )
}
