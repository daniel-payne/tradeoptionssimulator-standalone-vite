import clearAllData from "@/data/indexDB/controllers/clearAllData"
import clearUserData from "@/data/indexDB/controllers/clearUserData"
import type { HTMLAttributes, PropsWithChildren } from "react"

export const PROCESSERROR_MODAL = "ProcessErrorModal"

type ComponentProps = {
  processError?: any
  open?: boolean

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ProcessErrorModal({ processError, name = "ProcessErrorModal", children, ...rest }: PropsWithChildren<ComponentProps>) {
  const handleCancel = () => {
    const element = document?.getElementById(PROCESSERROR_MODAL) as HTMLDialogElement

    if (element) {
      element.close()
    }
  }

  const handleConfirm = async () => {
    await clearAllData()

    handleCancel()
  }

  return (
    <div {...rest} data-controller={name}>
      <dialog id={PROCESSERROR_MODAL} className="modal">
        <div className="modal-box">
          <h3 className="text-error font-bold text-lg">Trading Error</h3>
          <p className="py-4">Your trade has been rejected because of {processError}.</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={handleCancel}>
              Continue Trading
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
