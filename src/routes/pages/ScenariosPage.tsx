import useScenarios from "@/data/indexDB/hooks/useScenarios"
import ScenariosHeader from "@/display/coordinators/ScenariosHeader"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { FaVideo } from "react-icons/fa6"
import { Link } from "react-router"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ScenariosPage({ name = "ScenariosPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const scenarios = useScenarios()

  if ((scenarios?.length ?? 0) < 1) {
    return <div>Loading Scenarios</div>
  }

  return (
    <div {...rest} data-component={name}>
      <div className="h-full w-full flex flex-col last:">
        <ScenariosHeader />

        <div className="flex-auto min-h-0 flex flex-row flex-wrap overflow-auto gap-4 justify-center items-center">
          {scenarios?.map((scenario) => (
            <div className=" rounded-xl p-4 bg-base-300 shadow-xl h-64 w-96 flex flex-col gap-4 " key={scenario.ref}>
              <div className="text-xl text-primary">{scenario.name}</div>
              <div className="flex-auto text-secondary">{scenario.description}</div>

              <div className="flex flex-row justify-between items-center">
                <FaVideo className="text-primary" />
                <Link to={`/scenario/${scenario.ref}`} className="text-right">
                  <div className="btn btn-primary">Run Scenario</div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* <TradingFooter /> */}
      </div>
    </div>
  )
}
