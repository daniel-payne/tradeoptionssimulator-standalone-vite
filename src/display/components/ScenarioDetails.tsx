import { Link } from "react-router"

import { Scenario } from "@/data/indexDB/types/Scenario"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  scenario: Scenario

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ScenarioDetails({ scenario, name = "ScenarioOverview", ...rest }: PropsWithChildren<ComponentProps>) {
  return (
    <div {...rest} data-component={name}>
      <div className="card w-96 h-64 bg-base-300 shadow-xl">
        <div className="card-body">
          <h2 className="text-primary card-title">{scenario.name}</h2>
          <p className="pt-2 text-secondary">{scenario.description}</p>
          <div className="card-actions justify-end">
            <Link to={`/status/scenario/${scenario.code}`}>
              <button className="btn btn-sm btn-primary" disabled={scenario.isActive != true}>
                Run Scenario
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
