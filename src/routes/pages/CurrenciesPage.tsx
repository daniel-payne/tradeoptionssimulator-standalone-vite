import { useQueryState } from "@keldan-systems/state-mutex"

import useCurrencies from "@/data/indexDB/hooks/useCurrencies"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

import { Currency } from "@/data/indexDB/types/Currency"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CurrenciesPage({ name = "CurrenciesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const currencies = useCurrencies()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Currencies</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {currencies?.map((currency) => (
            <CurrencyDisplay currency={currency} showJson={showJson} />
          ))}
        </div>
      </div>
    </div>
  )
}

export const CurrencyDisplay = ({ currency, showJson = false }: { currency?: Currency; showJson?: boolean | undefined | null }) => {
  if (currency == null) return null

  return (
    <div className="w-96 p-2" data-name="MarketDisplay" key={currency.key}>
      <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
        <div className="text-primary text-xl font-bold">{currency.key}</div>
        {showJson && <pre>{JSON.stringify(currency, null, 2)}</pre>}
        <div className="text-secondary font-bold">{currency?.name}&nbsp;</div>
        <div className="text-secondary">{currency?.description}&nbsp;</div>
        {/* <div className="text-secondary font-bold">
          {market?.contractSize} {market?.contractUnit}&nbsp;
        </div>
        <div className="text-secondary">{market?.contractName}&nbsp;</div> */}
      </div>
    </div>
  )
}
