import usePriceSummaries from "@/data/indexDB/hooks/usePriceSummaries"
import formatIndexAsDate from "@/utilities/formatIndexAsDate"
import { useQueryState } from "@keldan-systems/state-mutex"

import type { HTMLAttributes, PropsWithChildren } from "react"
import { Link } from "react-router-dom"

type ComponentProps = {
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function PriceSummariesPage({ name = "PriceSummariesPage", ...rest }: PropsWithChildren<ComponentProps>) {
  const [showJson, setShowJson] = useQueryState<boolean>("showJson", false)

  const priceSummaries = usePriceSummaries()

  return (
    <div {...rest} data-component={name}>
      <div className="flex flex-col gap-2 p-3">
        <div className="flex flex-row flex-wrap gap-2 items-center">
          <Link to="/" className="btn btn-primary btn-sm mx-2">
            Home
          </Link>
          <div className="text-secondary text-2xl font-bold">Price Summaries</div>
          <button className="btn btn-primary btn-ghost btn-sm" onClick={() => setShowJson(!showJson)}>
            json
          </button>
        </div>
        <div className="flex-auto flex flex-row flex-wrap gap-0">
          {priceSummaries?.map((summary) => {
            return (
              <div className="w-96 p-2" key={summary.symbol}>
                <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
                  <div className="text-primary text-xl font-bold">{summary.symbol}</div>
                  {showJson && <pre>{JSON.stringify(summary, null, 2)}</pre>}
                  <div className="text-secondary font-bold">
                    {summary?.state} {summary?.count}&nbsp;
                  </div>
                  <div className="text-secondary">{summary?.message}&nbsp;</div>
                  <div className="text-secondary font-bold">
                    {formatIndexAsDate(summary?.firstActiveIndex)} : {formatIndexAsDate(summary?.firstInterDayIndex)} :{" "}
                    {formatIndexAsDate(summary?.lastActiveIndex)}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// import useStatuses from "@/data/indexDB/hooks/useStatuses"

// import type { HTMLAttributes, PropsWithChildren } from "react"
// import { Link } from "react-router-dom"

// type ComponentProps = {
//   name?: string
// } & HTMLAttributes<HTMLDivElement>

// export default function StatusesPage({ name = "StatusesPage", ...rest }: PropsWithChildren<ComponentProps>) {
//   const statuses = useStatuses()

//   return (
//     <div {...rest} data-component={name}>
//       <div className="m-4 flex flex-row flex-wrap gap-2 items-center">
//         <Link to="/" className="btn btn-primary btn-sm mx-2">
//           Home
//         </Link>
//         <div className="text-secondary text-2xl font-bold">Statuses</div>
//       </div>
//       <div className="m-4 flex flex-row flex-wrap gap-0">
//         {statuses?.map((status) => {
//           return (
//             <div className="w-96 p-2" key={status?.symbol}>
//               <div className="w-full h-full border border-primary rounded-xl p-2 overflow-hidden">
//                 <div className="text-primary text-xl font-bold">{status.symbol}</div>
//                 <pre>{JSON.stringify(status, null, 2)}</pre>
//               </div>
//             </div>
//           )
//         })}
//       </div>
//     </div>
//   )
// }
