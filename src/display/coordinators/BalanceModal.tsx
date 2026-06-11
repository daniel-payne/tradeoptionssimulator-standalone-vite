import clearAllData from "@/data/indexDB/controllers/clearAllData"
import clearUserData from "@/data/indexDB/controllers/clearUserData"
import useBalance from "@/data/indexDB/hooks/useBalance"
import formatValue from "@/utilities/formatValue"
import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router"

export const BALANCE_MODAL = "BalanceModal"

type ComponentProps = {
  open?: boolean

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function BalanceModal({ name = "BalanceModal", children, ...rest }: PropsWithChildren<ComponentProps>) {
  let gameState = "ACTIVE"

  const { userBalance, transactionBalance, initialBalance, variationBalance, availableBalance } = useBalance()

  if (availableBalance < 0) {
    gameState = "CLOSED"
  } else if (availableBalance < 500) {
    gameState = "WARNING"
  }

  const handleCancel = () => {
    const element = document?.getElementById(BALANCE_MODAL) as HTMLDialogElement

    if (element) {
      element.close()
    }
  }

  const handleConfirm = async () => {
    //await closeAllTrades()

    handleCancel()
  }

  return (
    <div {...rest} data-controller={name}>
      <dialog id={BALANCE_MODAL} className="modal">
        <div className="modal-box max-w-256 w-full">
          {gameState === "ACTIVE" && (
            <div>
              <h3 className="text-primary font-bold text-lg">Account Balance</h3>
              <p className="py-4">Your balance is made up of the following</p>
            </div>
          )}
          {gameState === "CLOSED" && (
            <div>
              <h3 className="text-loss font-bold text-lg">Account Closed</h3>
              <p className="py-4">Your have run out of money.</p>
              <p className="py-4">You can restart the game with another $5,000</p>
            </div>
          )}{" "}
          {gameState === "WARNING" && (
            <div>
              <h3 className="text-partial font-bold text-lg">Account Warning</h3>
              <p className="py-4">Your balance is below $500. If your balance falls below $0 your game will stop.</p>
              <p className="py-4">Your balance is made up of the following</p>
            </div>
          )}
          <div className="flex flex-row gap-2">
            <div className="w-24 text-profit  text-right">{formatValue(userBalance)}</div>
            <div className="fg--subheading">Your starting balance</div>
          </div>
          <div className="flex flex-row gap-2">
            <div className={`w-24 ${transactionBalance < 0 ? "text-loss" : "text-profit"}  text-right`}>{formatValue(transactionBalance)}</div>
            <div className="fg--subheading">Profits from prior trades</div>
            <Link to="/history">
              <button className="btn btn-primary btn-outline btn-xs">Show Full Trading History</button>
            </Link>
          </div>
          <div className="flex flex-row gap-2">
            <div className="w-24 text-loss text-right">{formatValue(initialBalance)}</div>
            <div className="fg--subheading">Deposit of 10% price of each trade</div>
          </div>
          <div className="flex flex-row gap-2">
            <div className={`w-24 ${variationBalance < 0 ? "text-loss" : "text-profit"}  text-right`}>{formatValue(variationBalance)}</div>
            <div className="fg--subheading">Potential {variationBalance < 0 ? "losses" : "profits"} from your open trades</div>
          </div>
          <div className="divider  w-24"></div>
          <div className="flex flex-row gap-2">
            <div className={`w-24 ${availableBalance < 0 ? "text-loss" : "text-profit"}  text-right`}>{formatValue(availableBalance)}</div>
            <div className="fg--subheading">Your balance available for trading</div>
          </div>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            {gameState === "ACTIVE" && (
              <>
                <button className="btn btn-primary" onClick={handleCancel}>
                  Continue Trading
                </button>
              </>
            )}
            {gameState === "WARNING" && (
              <>
                <button className="btn" onClick={handleCancel}>
                  Continue Trading
                </button>
                <button className="ms-2 btn btn-warning" onClick={handleConfirm}>
                  Close All Trades
                </button>
              </>
            )}
            {gameState === "CLOSED" && (
              <>
                <button className="ms-2 btn btn-error" onClick={handleConfirm}>
                  Restart the game
                </button>
              </>
            )}
          </div>
        </div>
      </dialog>
    </div>
  )
}
