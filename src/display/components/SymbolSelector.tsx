import useMarkets from "@/data/indexDB/hooks/useMarkets"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  symbol?: string

  onSelectionChanged?: (symbol: string) => void

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function SymbolSelector({ symbol, onSelectionChanged, name = "MarketSelector", ...rest }: PropsWithChildren<ComponentProps>) {
  const markets = useMarkets()

  const market = markets?.find((market) => market.symbol === symbol)

  const hasLoaded = market?.priceCount > 0
  const hasNotLoaded = !hasLoaded

  const handleSelectionChanged = (symbol: string) => {
    onSelectionChanged?.(symbol)

    const element = document?.getElementById("SelectMarketModal") as HTMLDialogElement

    if (element) {
      element.close()
    }
  }

  const handleShowModal = () => {
    const element = document?.getElementById("SelectMarketModal") as HTMLDialogElement

    if (element) {
      element.showModal()
    }
  }

  return (
    <div {...rest} data-component={name}>
      <dialog id="SelectMarketModal" open={false} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="text-primary font-bold text-lg">Select a market</h3>
          <div className="flex flex-row flex-wrap gap-4 p-2">
            {markets?.map((market: Market) => (
              <button
                className={`btn btn-sm btn-primary ${market.symbol === symbol ? "" : "btn-outline"}`}
                onClick={() => handleSelectionChanged(market.symbol)}
                key={market.symbol}
              >
                {market.name}
              </button>
            ))}
          </div>
          <div className="modal-action">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn">Close</button>
              {/* <button className="ms-2 btn btn-error" onClick={() => null}>
                Reset
              </button> */}
            </form>
          </div>
        </div>
      </dialog>
      <div className="join">
        <input className="input input-bordered border-primary join-item w-16 input-sm" placeholder="Market Symbol" readOnly value={symbol ?? ""} />
        <input className="input input-bordered border-primary join-item w-64 input-sm" placeholder="Market Name" readOnly value={market?.name ?? ""} />
        <button className="btn join-item rounded-lg input-bordered border-primary  btn-outline text-secondary btn-sm" onClick={handleShowModal}>
          Select
        </button>
        {/* {hasNotLoaded && <button className="btn join-item rounded-lg input-bordered border-primary  btn-outline text-secondary btn-sm">Load</button>} */}
      </div>
    </div>
  )
}
