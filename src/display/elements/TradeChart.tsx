import Chart from "chart.js/auto"
import annotationPlugin from "chartjs-plugin-annotation"

import { Chart as Multi } from "react-chartjs-2"

import "chartjs-adapter-date-fns"

Chart.register([annotationPlugin])

import type { HTMLAttributes, PropsWithChildren } from "react"
import cssVar from "@/utilities/cssVar"
import { PriceOrNothing } from "@/data/indexDB/types/Price"

import type { Range } from "@/display/controllers/RangeChooser"
import { TradeOrNothing } from "@/data/indexDB/types/Trade"
import { MarginOrNothing } from "@/data/indexDB/types/Margin"
import { TradeDirection } from "@/data/indexDB/enums/TradeDirection"

type ComponentProps = {
  closes: Array<number | null | undefined> | null | undefined

  trade: TradeOrNothing
  margin: MarginOrNothing

  range?: Range | null | undefined

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function TradeChart({ closes, trade, margin, range = "1m", name = "TradeChart", ...rest }: PropsWithChildren<ComponentProps>) {
  if (closes == null || trade == null) {
    return null
  }

  if ((closes?.length ?? 0) === 0) {
    return null
  }

  // const isMarketClosed = price?.isMarketClosed

  //const currentTimestamp = price?.currentTimestamp ?? price?.priorTimestamp
  // const currentIndex = price?.currentIndex
  // const currentOpen = price?.currentOpen

  // const priorIndex = price?.priorIndex
  // const priorOpen = price?.priorOpen
  // const priorClose = price?.priorClose

  const startDataIndex = trade?.entryIndex ?? 0
  const endDataIndex = margin?.currentIndex ?? trade?.exitIndex ?? 0

  const displayCloses = closes?.slice(startDataIndex, endDataIndex + 1) ?? []

  const entryPrice = trade?.entryPrice ?? 0
  const exitPrice = margin?.currentPrice ?? trade?.exitPrice ?? 0
  const exitProfit = entryPrice - exitPrice

  const displayProfits = displayCloses.map((close: number | null | undefined) => (close != null ? close - entryPrice : undefined))

  displayProfits[0] = 0
  displayProfits[displayProfits.length - 1] = (displayProfits[displayProfits.length - 1] ?? 0) - exitProfit

  const labels = displayCloses.map((_, index) => index)

  const calculateColor = (context: any) => {
    const index = context.dataIndex
    const value = context.dataset.data[index]

    if (trade?.direction === TradeDirection.Call) {
      return value > 0 ? cssVar("--outcome-profit-50") : value < 0 ? cssVar("--outcome-loss-50") : cssVar("--outcome-neutral-50")
    }

    return value > 0 ? cssVar("--outcome-loss-50") : value < 0 ? cssVar("--outcome-profit-50") : cssVar("--outcome-neutral-50")
  }

  const datasets = [
    {
      type: "line",
      label: "profits",
      data: displayProfits,
      pointRadius: 4,
      borderWidth: 1,
      fill: 0,
      borderColor: cssVar("--graph-range"),
      backgroundColor: cssVar("--graph-range"),
      tension: 0,
      spanGaps: true,
      pointBackgroundColor: calculateColor,
      pointBorderColor: calculateColor,
    },
  ] as any

  const options = {
    animations: false,
    maintainAspectRatio: false,
    spanGaps: true,

    elements: {
      line: {
        borderColor: cssVar("--graph-range"),
        borderWidth: 1,
      },
      point: {
        radius: 0,
      },
    },
    tooltips: {
      enabled: false,
    },
    scales: {
      y: {
        display: false,
      },

      x: {
        display: false,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      decimation: {
        enabled: true,
      },
      tooltip: {
        enabled: false,
      },
      annotation: {
        annotations: [
          {
            type: "line",
            yMin: 0,
            yMax: 0,
            borderColor: cssVar("--outcome-neutral-50"),
            borderWidth: 1,
            display: true,
          },
        ],
      },
    },
  } as any

  return (
    <div {...rest} data-component={name}>
      <div style={{ position: "relative", margin: "auto", width: "99%", height: "99%" }}>
        <Multi datasetIdKey="id" type="line" data={{ labels, datasets }} options={options} />
      </div>
    </div>
  )
}
