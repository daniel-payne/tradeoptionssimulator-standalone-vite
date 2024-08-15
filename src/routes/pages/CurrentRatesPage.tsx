import { useQueryState } from "@keldan-systems/state-mutex"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

import useCurrentRates from "@/data/indexDB/hooks/useCurrentRates"
import type { Rate } from "@/data/indexDB/types/Rate"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrentRatesPage({ name = "CurrentRatesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const rates = useCurrentRates()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Current Rates</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {rates?.map((rate) => (
            <RatesDisplay rate={rate} showJson={showJson} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const RatesDisplay = ({ rate, showJson = false }: { rate?: Rate; showJson?: boolean | undefined | null }) => {
  if (rate == null) return null

  return (
    <div className="w-96 p-2" data-name="MarketDisplay" key={rate.key}>
      <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
        <div className="text-primary text-xl font-bold">{rate.key}</div>
        {showJson && <pre>{JSON.stringify(rate, null, 2)}</pre>}
        <div className="text-secondary font-bold">{rate?.name}&nbsp;</div>
        <div className="text-secondary">{rate?.description}&nbsp;</div>
        {/* <div className="text-secondary font-bold">
          {market?.contractSize} {market?.contractUnit}&nbsp;
        </div>
        <div className="text-secondary">{market?.contractName}&nbsp;</div> */}
      </div>
    </div>
  )
}
