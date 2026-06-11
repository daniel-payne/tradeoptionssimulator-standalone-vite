import clearAllData from "@/data/indexDB/controllers/clearAllData"
import clearUserData from "@/data/indexDB/controllers/clearUserData"
import type { HTMLAttributes, PropsWithChildren } from "react"

export const DELETEALL_MODAL = "DeleteAllModal"

type ComponentProps = {
  open?: boolean

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function DeleteAllModal({ name = "DeleteAllModal", children, ...rest }: PropsWithChildren<ComponentProps>) {
  const handleCancel = () => {
    const element = document?.getElementById(DELETEALL_MODAL) as HTMLDialogElement

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
      <dialog id={DELETEALL_MODAL} className="modal">
        <div className="modal-box">
          <h3 className="text-error font-bold text-lg">Warning</h3>
          <p className="py-4">You will lose all your game information and downloaded prices.</p>
          <p className="py-4">Use this facility when you have finished playing the game.</p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn" onClick={handleCancel}>
              Cancel
            </button>
            <button className="ms-2 btn btn-error" onClick={handleConfirm}>
              Reset
            </button>
          </div>
        </div>
      </dialog>
    </div>
  )
}
