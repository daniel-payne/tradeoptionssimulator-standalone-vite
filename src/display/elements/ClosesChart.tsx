import Chart from "chart.js/auto"
import annotationPlugin from "chartjs-plugin-annotation"

import { Chart as Multi } from "react-chartjs-2"

import "chartjs-adapter-date-fns"

Chart.register([annotationPlugin])

import type { HTMLAttributes, PropsWithChildren } from "react"
import cssVar from "@/utilities/cssVar"
import { PriceOrNothing } from "@/data/indexDB/types/Price"

import type { Range } from "@/display/controllers/RangeChooser"

type ComponentProps = {
  closes: Array<number | null | undefined> | null | undefined

  price: PriceOrNothing

  range?: Range | null | undefined

  firstActiveIndex?: number | null | undefined
  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function ClosesChart({ closes, price, range = "1m", firstActiveIndex, name = "ClosesChart", ...rest }: PropsWithChildren<ComponentProps>) {
  if (closes == null || price == null) {
    return null
  }

  if ((closes?.length ?? 0) === 0) {
    return null
  }

  const isMarketClosed = price?.isMarketClosed

  //const currentTimestamp = price?.currentTimestamp ?? price?.priorTimestamp
  const currentIndex = price?.currentIndex
  const currentOpen = price?.currentOpen

  const priorIndex = price?.priorIndex
  const priorOpen = price?.priorOpen
  const priorClose = price?.priorClose

  const endDataIndex = currentIndex ?? priorIndex ?? 0

  // Strip leading nulls — slice from the first real value so Chart.js
  // never renders the tapered fill artefact before data begins.
  const firstActiveIndexRaw = closes.findIndex((v) => v != null)
  const clampedFirstActive =
    firstActiveIndex != null && firstActiveIndex >= 0 && firstActiveIndex <= endDataIndex
      ? firstActiveIndex
      : null

  let dataStart = firstActiveIndexRaw >= 0 ? firstActiveIndexRaw : 0

  if (clampedFirstActive != null && dataStart < clampedFirstActive) {
    dataStart = clampedFirstActive
  }

  const displayCloses = closes?.slice(dataStart, endDataIndex + 1) ?? []

  // Labels are global day-indices so price annotations keep their correct positions
  const labels = displayCloses.map((_, i) => dataStart + i)

  const displayPointRadius = range === "1m" || range === "3m" ? 2 : 0

  const datasets = [
    {
      type: "line",
      label: "high",
      data: displayCloses,
      pointRadius: displayPointRadius,
      borderWidth: 1,
      fill: 0,
      borderColor: cssVar("--graph-range"),
      backgroundColor: cssVar("--graph-range"),
      tension: 0,
      spanGaps: true,
    },
  ] as any

  let startIndex = dataStart

  if (range === "1m") {
    startIndex = endDataIndex - 1 * 30
  } else if (range === "3m") {
    startIndex = endDataIndex - 3 * 30
  } else if (range === "1y") {
    startIndex = endDataIndex - 1 * 365
  } else if (range === "5y") {
    startIndex = endDataIndex - 5 * 365
  }

  // Never start before the first real data point
  if (startIndex < dataStart) {
    startIndex = dataStart
  }

  let pricePointValue
  let pricePointIndex
  let pricePointColor

  if (isMarketClosed) {
    pricePointValue = priorClose
    pricePointIndex = currentIndex ?? priorIndex
    if ((priorClose ?? 0) > (priorOpen ?? 0)) {
      pricePointColor = cssVar("--outcome-profit-50")
    } else if ((priorClose ?? 0) < (priorOpen ?? 0)) {
      pricePointColor = cssVar("--outcome-loss-50")
    } else {
      pricePointColor = cssVar("--outcome-neutral-50")
    }
  } else {
    pricePointValue = currentOpen
    pricePointIndex = currentIndex
    if ((currentOpen ?? 0) > (priorClose ?? 0)) {
      pricePointColor = cssVar("--outcome-profit-50")
    } else if ((currentOpen ?? 0) < (priorClose ?? 0)) {
      pricePointColor = cssVar("--outcome-loss-50")
    } else {
      pricePointColor = cssVar("--outcome-neutral-50")
    }
  }

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
        display: true,
        position: "right",
      },

      x: {
        display: false,
        min: startIndex,
        max: (pricePointIndex ?? 0) + 1,
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
        annotations: {
          priceLine: {
            type: "line",
            yMin: pricePointValue,
            yMax: pricePointValue,
            borderColor: pricePointColor,
            borderWidth: 1,
            display: true,
          },
          pricePoint: {
            type: "point",
            radius: 3,
            yValue: pricePointValue,
            xValue: pricePointIndex,
            borderColor: pricePointColor,
            backgroundColor: pricePointColor,
            borderWidth: 1,
            display: true,
          },
        },
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
