import { useLocalState } from "@keldan-systems/state-mutex"
import { useEffect, useState, type HTMLAttributes, type PropsWithChildren } from "react"

export const CONFORMATION_MODAL = "ConformationModal"

type ComponentProps = {
  open?: boolean

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ConformationModal({ name = "ConformationModal", children, ...rest }: PropsWithChildren<ComponentProps>) {
  const [confirmedWarnings, setConfirmedWarnings] = useLocalState<boolean | undefined>("CONFIRMED-WARNINGS", undefined)

  const [hasAcceptedApproximation, setHasAcceptedApproximation] = useState(false)
  const [hasAcceptedRealWorld, setHasAcceptedRealWorld] = useState(false)
  const [hasAcceptedFeedData, setHasAcceptedFeedData] = useState(false)
  const [hasAcceptedNotAdvice, setHasAcceptedNotAdvice] = useState(false)
  const [hasAcceptedIPStore, setHasAcceptedIPStore] = useState(false)
  const [hasAcceptedNoTransfer, setHasAcceptedNoTransfer] = useState(false)

  const canConfirm =
    hasAcceptedApproximation && hasAcceptedRealWorld && hasAcceptedFeedData && hasAcceptedNotAdvice && hasAcceptedIPStore && hasAcceptedNoTransfer

  const handleCancel = () => {
    window.location.assign("https://google.com/")
  }

  const handleConfirm = () => {
    const element = document?.getElementById(CONFORMATION_MODAL) as HTMLDialogElement

    if (element) {
      setConfirmedWarnings(true)

      element.close()
    }
  }

  useEffect(() => {
    if (confirmedWarnings != null && confirmedWarnings === false) {
      const element = document?.getElementById(CONFORMATION_MODAL) as HTMLDialogElement

      if (element) {
        element.showModal()
      }
    }
  }, [confirmedWarnings])

  return (
    <div {...rest} data-controller={name}>
      <dialog id={CONFORMATION_MODAL} className="modal">
        <div className="modal-box w-[80vw] max-w-[85vw] h-[60vh] max-h-[85vh] flex flex-col justify-between p-6 md:p-8 bg-base-200/95 backdrop-blur-md border border-base-300/50 shadow-2xl">
          <div className="flex flex-col flex-1 min-h-0">
            <h3 className="text-success font-bold text-2xl mb-4">Welcome to the Game</h3>
            <p className="pb-4 text-lg text-base-content/85">Before Playing the game, you just need to confirm you understand the following.</p>

            <div className="flex flex-col gap-2 overflow-y-auto flex-1 pr-2">
              <label className="cursor-pointer label flex items-center justify-between gap-4 py-3 border-b border-gray-700/50">
                <span className="label-text text-left flex-1 text-base whitespace-normal break-words">This is a game, it represents a simplified approximation how the real world works.</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-md"
                  checked={hasAcceptedApproximation}
                  onChange={(e) => setHasAcceptedApproximation(e.target.checked)}
                />
              </label>
              <label className="cursor-pointer label flex items-center justify-between gap-4 py-3 border-b border-gray-700/50">
                <span className="label-text text-left flex-1 text-base whitespace-normal break-words">Any strategies that work in the game may not work in the real world.</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-md"
                  checked={hasAcceptedRealWorld}
                  onChange={(e) => setHasAcceptedRealWorld(e.target.checked)}
                />
              </label>
              <label className="cursor-pointer label flex items-center justify-between gap-4 py-3 border-b border-gray-700/50">
                <span className="label-text text-left flex-1 text-base whitespace-normal break-words">The Price Data in the game may not be the same as real-world data provided by actual market feeds.</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-md"
                  checked={hasAcceptedFeedData}
                  onChange={(e) => setHasAcceptedFeedData(e.target.checked)}
                />
              </label>
              <label className="cursor-pointer label flex items-center justify-between gap-4 py-3 border-b border-gray-700/50">
                <span className="label-text text-left flex-1 text-base font-bold whitespace-normal break-words">This is not financial advice.</span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-md"
                  checked={hasAcceptedNotAdvice}
                  onChange={(e) => setHasAcceptedNotAdvice(e.target.checked)}
                />
              </label>
              <label className="cursor-pointer label flex items-center justify-between gap-4 py-3 border-b border-gray-700/50">
                <span className="label-text text-left flex-1 text-base whitespace-normal break-words">
                  This webpage does not use cookies, as this is an example of a local first web application. However IP addresses of machines downloading the data
                  are recorded. You are happy we keep this information.
                </span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-md"
                  checked={hasAcceptedIPStore}
                  onChange={(e) => setHasAcceptedIPStore(e.target.checked)}
                />
              </label>
              <label className="cursor-pointer label flex items-center justify-between gap-4 py-3">
                <span className="label-text text-left flex-1 text-base whitespace-normal break-words">
                  Once you have downloaded the data, your game status stays on this machine. You can not transfer game play to another machine. There is no login to
                  protect your game status.
                </span>
                <input
                  type="checkbox"
                  className="checkbox checkbox-success checkbox-md"
                  checked={hasAcceptedNoTransfer}
                  onChange={(e) => setHasAcceptedNoTransfer(e.target.checked)}
                />
              </label>
            </div>
          </div>

          <div className="modal-action mt-4">
            {/* if there is a button in form, it will close the modal */}
            <button className="ms-2 btn btn-error" onClick={handleCancel}>
              Take me back to Google
            </button>
            <button className="ms-2 btn btn-success" disabled={canConfirm === false} onClick={handleConfirm}>
              I understand All the above
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
