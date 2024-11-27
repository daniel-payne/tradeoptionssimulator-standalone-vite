import Chart from "chart.js/auto"
import annotationPlugin from "chartjs-plugin-annotation"

import { Chart as Multi } from "react-chartjs-2"

import "chartjs-adapter-date-fns"

Chart.register([annotationPlugin])

import type { HTMLAttributes, PropsWithChildren } from "react"
import cssVar from "@/utilities/cssVar"
import type { PriceOrNothing } from "@/data/indexDB/types/Price"

import type { Range } from "@/display/controllers/RangeChooser"

import { TradeStatus } from "@/data/indexDB/enums/TradeStatus"
import { Trade } from "@/data/indexDB/types/Trade"

type ComponentProps = {
  highs: Array<number | null | undefined> | null | undefined
  lows: Array<number | null | undefined> | null | undefined
  closes: Array<number | null | undefined> | null | undefined

  price: PriceOrNothing

  activeTrades: Array<Trade> | null | undefined
  inactiveTrades: Array<Trade> | null | undefined

  range?: Range | null | undefined

  name?: string
} & HTMLAttributes<HTMLDivElement>

export default function HighLowChart({
  highs,
  lows,
  closes,
  price,
  activeTrades,
  inactiveTrades,
  range = "1m",
  name = "HighLowChart",
  ...rest
}: PropsWithChildren<ComponentProps>) {
  if (highs == null || lows == null || price == null) {
    return null
  }

  if ((highs?.length ?? 0) === 0) {
    return null
  }

  const isMarketClosed = price?.isMarketClosed

  //const currentTimestamp = price?.currentTimestamp ?? price?.priorTimestamp
  const currentIndex = price?.currentIndex
  const currentOpen = price?.currentOpen

  const priorIndex = price?.priorIndex
  const priorOpen = price?.priorOpen
  const priorClose = price?.priorClose

  const endDataIndex = priorIndex ?? 0

  const displayHighs = highs?.slice(0, endDataIndex + 1) ?? []
  const displayLows = lows?.slice(0, endDataIndex + 1) ?? []
  const displayCloses = closes?.slice(0, endDataIndex + 1) ?? []

  const labels = highs.map((_, index) => index)

  const datasets = [] as any

  const nextActiveTrade = activeTrades?.[0]

  let fillTo = 1

  if (range === "1m" || range === "3m") {
    datasets.push({
      type: "line",
      label: "closes",
      data: displayCloses,
      pointRadius: 4,
      borderWidth: 0,
      fill: false,
      //borderColor: cssVar("--graph-point"),
      backgroundColor: cssVar("--graph-point"),
      // backgroundColor: function (context: any) {
      //   if (range === "1m" || range === "3m") {
      //     const index = context.dataIndex

      //     if (index > 0) {
      //       const currentValue = context.dataset.data[index]
      //       let lastValue = context.dataset.data[index - 1]

      //       if (lastValue == null) {
      //         lastValue = context.dataset.data[index - 2]
      //         if (lastValue == null) {
      //           lastValue = context.dataset.data[index - 3]
      //           if (lastValue == null) {
      //             lastValue = context.dataset.data[index - 4]
      //             if (lastValue == null) {
      //               lastValue = context.dataset.data[index - 5]
      //             }
      //           }
      //         }
      //       }

      //       if (currentValue > lastValue) {
      //         return cssVar("--outcome-profit-75")
      //       } else if (currentValue < lastValue) {
      //         return cssVar("--outcome-loss-75")
      //       } else {
      //         return cssVar("--outcome-neutral-75")
      //       }
      //     }
      //   }
      // },
      // tension: 0,
      // spanGaps: true,
    })

    fillTo += 1
  }

  datasets.push({
    type: "line",
    label: "high",
    data: displayHighs,
    pointRadius: 0,
    borderWidth: 1,
    fill: fillTo,
    borderColor: cssVar("--graph-range"),
    backgroundColor: cssVar("--graph-range"),
    tension: 0.2,
    spanGaps: true,
  })

  datasets.push({
    type: "line",
    label: "low",
    data: displayLows,
    pointRadius: 0,
    borderWidth: 1,
    fill: false,
    borderColor: cssVar("--graph-range"),
    tension: 0.2,
    spanGaps: true,
  })

  let startIndex = nextActiveTrade?.entryIndex ?? endDataIndex
  let endIndex = (nextActiveTrade?.expiryIndex ?? price?.currentIndex ?? 0) + 1

  if (range === "1m") {
    startIndex = startIndex - 1 * 30
  } else if (range === "3m") {
    startIndex = startIndex - 3 * 30
  } else if (range === "1y") {
    startIndex = startIndex - 1 * 365
  } else if (range === "5y") {
    startIndex = startIndex - 5 * 365
  } else if (range === "at") {
    startIndex = 0
  }

  if (startIndex < 0) {
    startIndex = 0
  }

  let pricePointValue
  let pricePointIndex
  let pricePointColor

  if (isMarketClosed) {
    pricePointValue = priorClose
    pricePointIndex = priorIndex
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
        max: nextActiveTrade?.expiryIndex ?? endIndex,
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
            radius: 4,
            yValue: pricePointValue,
            xValue: pricePointIndex,
            borderColor: pricePointColor,
            backgroundColor: pricePointColor,
            borderWidth: 1,
            display: true,
          },
          // firstProfit: {
          //   type: "line",
          //   borderWidth: 12,
          //   yMin: firstTrade?.entryPrice,
          //   yMax: (firstTrade?.entryPrice ?? 0) * 10,
          //   xMin: firstTrade?.expiryIndex,
          //   xMax: firstTrade?.expiryIndex,
          //   borderColor: cssVar("--outcome-profit-25"),
          //   backgroundColor: cssVar("--outcome-profit-25"),
          //   adjustScaleRange: false,
          //   display: true,
          // },
          // firstLoss: {
          //   type: "line",
          //   borderWidth: 12,
          //   yMin: 0,
          //   yMax: firstTrade?.entryPrice ?? 0,
          //   xMin: firstTrade?.expiryIndex,
          //   xMax: firstTrade?.expiryIndex,
          //   borderColor: cssVar("--outcome-loss-25"),
          //   backgroundColor: cssVar("--outcome-loss-25"),
          //   adjustScaleRange: false,
          //   display: true,
          // },
        },
      },
    },
  } as any

  for (const activeTrade of activeTrades ?? []) {
    if (activeTrade?.entryPrice != null) {
      let minLossPoint = activeTrade.direction === "CALL" ? 0 : activeTrade.entryPrice * 100
      let maxLossPoint = activeTrade.direction === "CALL" ? activeTrade.entryPrice : 0

      let minProfitPoint = activeTrade.direction === "CALL" ? activeTrade.entryPrice : activeTrade.entryPrice
      let maxProfitPoint = activeTrade.direction === "CALL" ? activeTrade.entryPrice * 1000 : 0

      const firstTradeLoss = {
        type: "line",
        borderWidth: 12,
        yMin: minLossPoint,
        yMax: maxLossPoint,
        xMin: activeTrade?.expiryIndex,
        xMax: activeTrade?.expiryIndex,
        borderColor: cssVar("--outcome-loss-25"),
        backgroundColor: cssVar("--outcome-loss-25"),
        adjustScaleRange: false,
        display: true,
      }

      const firstTradeProfit = {
        type: "line",
        borderWidth: 12,
        yMin: minProfitPoint,
        yMax: maxProfitPoint,
        xMin: activeTrade?.expiryIndex,
        xMax: activeTrade?.expiryIndex,
        borderColor: cssVar("--outcome-profit-25"),
        backgroundColor: cssVar("--outcome-profit-25"),
        adjustScaleRange: false,
        display: true,
      }

      options.plugins.annotation.annotations[`loss-${activeTrade.id}`] = firstTradeLoss
      options.plugins.annotation.annotations[`profit-${activeTrade.id}`] = firstTradeProfit
    }
  }

  for (const trade of inactiveTrades ?? []) {
    if (trade?.entryPrice != null) {
      // let minLossPoint = trade.direction === "CALL" ? 0 : trade.entryPrice * 100
      // let maxLossPoint = trade.direction === "CALL" ? trade.entryPrice : 0

      // let minProfitPoint = trade.direction === "CALL" ? trade.entryPrice : trade.entryPrice
      // let maxProfitPoint = trade.direction === "CALL" ? trade.entryPrice * 1000 : 0
      const isInProfit = (trade.profit ?? 0) > 0

      const lineColor = isInProfit ? "--outcome-profit-25" : "--outcome-loss-25"
      const cssColor = cssVar(lineColor)

      const entryPoint = {
        type: "point",
        borderWidth: 2,

        yValue: trade?.entryPrice,
        xValue: trade?.entryIndex,

        borderColor: cssColor,
        backgroundColor: cssColor,
        adjustScaleRange: false,
        display: true,
      }

      const exitPoint = {
        type: "point",
        borderWidth: 2,

        yValue: trade?.exitPrice,
        xValue: trade?.exitIndex,

        borderColor: cssColor,
        backgroundColor: cssColor,
        adjustScaleRange: false,
        display: true,
      }

      const marginLine = {
        type: "line",
        borderWidth: 6,

        yMin: trade?.entryPrice,
        xMin: trade?.entryIndex,

        yMax: trade?.exitPrice,
        xMax: trade?.exitIndex,

        borderColor: cssColor,
        backgroundColor: cssColor,
        adjustScaleRange: false,
        display: true,
      }

      // const firstTradeProfit = {
      //   type: "line",
      //   borderWidth: 20,

      //   yValue: trade?.entryValue,
      //   xValue: trade?.entryIndex,

      //   borderColor: cssVar("--outcome-profit-25"),
      //   backgroundColor: cssVar("--outcome-profit-25"),
      //   adjustScaleRange: false,
      //   display: true,
      // }

      options.plugins.annotation.annotations[`entryPoint-${trade.id}`] = entryPoint
      options.plugins.annotation.annotations[`exitPoint-${trade.id}`] = exitPoint
      options.plugins.annotation.annotations[`marginLine-${trade.id}`] = marginLine
      // options.plugins.annotation.annotations[`inactive-profit-${trade.id}`] = firstTradeProfit
    }
  }

  return (
    <div {...rest} data-component={name}>
      <div style={{ position: "relative", margin: "auto", width: "99%", height: "99%" }}>
        <Multi datasetIdKey="id" type="line" data={{ labels, datasets }} options={options} />
      </div>
    </div>
  )
}
