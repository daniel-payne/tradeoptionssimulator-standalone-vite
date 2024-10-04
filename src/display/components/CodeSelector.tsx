import useCurrencies from "@/data/indexDB/hooks/useCurrencies"

import { Currency } from "@/data/indexDB/types/Currency"

import type { HTMLAttributes, PropsWithChildren } from "react"

type ComponentProps = {
  code?: string

  onSelectionChanged?: (symbol: string) => void

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function CodeSelector({ code, onSelectionChanged, name = "CodeSelector", ...rest }: PropsWithChildren<ComponentProps>) {
  const currencies = useCurrencies()

  const currency = currencies?.find((currency) => currency.code === code)

  const hasLoaded = currency?.priceCount > 0
  const hasNotLoaded = !hasLoaded

  const handleSelectionChanged = (code: string) => {
    onSelectionChanged?.(code)

    const element = document?.getElementById("SelectCurrencyModal") as HTMLDialogElement

    if (element) {
      element.close()
    }
  }

  const handleShowModal = () => {
    const element = document?.getElementById("SelectCurrencyModal") as HTMLDialogElement

    if (element) {
      element.showModal()
    }
  }

  return (
    <div {...rest} data-component={name}>
      <dialog id="SelectCurrencyModal" open={false} className="modal">
        <div className="modal-box w-11/12 max-w-5xl">
          <h3 className="text-primary font-bold text-lg">Select a currency</h3>
          <div className="flex flex-row flex-wrap gap-4 p-2">
            {currencies?.map((currency: Currency) => (
              <button
                className={`btn btn-sm btn-primary ${currency.code === code ? "" : "btn-outline"}`}
                onClick={() => handleSelectionChanged(currency.code)}
                key={currency.code}
              >
                {currency.name}
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
        <input className="input input-bordered border-primary join-item w-16 input-sm" placeholder="Market Symbol" readOnly value={code ?? ""} />
        <input className="input input-bordered border-primary join-item w-40 input-sm" placeholder="Market Name" readOnly value={currency?.name ?? ""} />
        <button className="btn join-item rounded-lg input-bordered border-primary  btn-outline text-secondary btn-sm" onClick={handleShowModal}>
          Select
        </button>
        {/* {hasNotLoaded && <button className="btn join-item rounded-lg input-bordered border-primary  btn-outline text-secondary btn-sm">Load</button>} */}
      </div>
    </div>
  )
}
