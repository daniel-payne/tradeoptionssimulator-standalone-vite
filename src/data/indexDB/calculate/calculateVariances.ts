import { Variances } from "../types/Variances"

// const PARKINSON_FACTOR = 1 / Math.sqrt(4 * Math.log(2))
const GARMIN_KLASS_FACTOR = 3 * Math.log(2) - 1

export default async function calculateVariances(data: any): Promise<Variances> {
  const opens = data.opens.data
  const highs = data.highs.data
  const lows = data.lows.data
  const closes = data.closes.data

  const length = opens.length + 1

  const averageOpenCloses = Array(length).fill(undefined)
  const averageHighLows = Array(length).fill(undefined)

  const percentageCloseYesterdays = Array(length).fill(undefined)
  const percentageOpenCloses = Array(length).fill(undefined)
  const percentageHighLows = Array(length).fill(undefined)

  const logSquaredHighLows = Array(length).fill(undefined)
  const logSquaredCloseOpens = Array(length).fill(undefined)

  const logOpenYesterdays = Array(length).fill(undefined)
  const logHighOpens = Array(length).fill(undefined)
  const logLowOpens = Array(length).fill(undefined)
  const logCloseOpens = Array(length).fill(undefined)

  const garminKlassValues = Array(length).fill(undefined)
  const rogersSatchellValues = Array(length).fill(undefined)

  opens.forEach((_: never, i: number) => {
    const open = opens[i]
    const high = highs[i]
    const low = lows[i]
    const close = closes[i]

    if (open != null) {
      averageOpenCloses[i] = (open + close) / 2
      averageHighLows[i] = (high + low) / 2

      percentageOpenCloses[i] = open / close - 1
      percentageHighLows[i] = high / low - 1

      logSquaredHighLows[i] = Math.log(high / low) ** 2
      logSquaredCloseOpens[i] = Math.log(close / open) ** 2

      logHighOpens[i] = Math.log(high / open)
      logLowOpens[i] = Math.log(low / open)
      logCloseOpens[i] = Math.log(close / open)

      garminKlassValues[i] = logSquaredHighLows[i] * 0.5 + logSquaredCloseOpens[i] * GARMIN_KLASS_FACTOR
      rogersSatchellValues[i] = logHighOpens[i] * (logHighOpens[i] - logCloseOpens[i]) + logLowOpens[i] * (logLowOpens[i] - logCloseOpens[i])

      if (i > 0) {
        const thisClose = closes[i]
        const thisOpen = opens[i]

        let lastClose = undefined

        for (let j = i - 1; j >= 0; j--) {
          if (closes[j] != null) {
            lastClose = closes[j]

            break
          }
        }

        if (thisClose != null && lastClose != null) {
          percentageCloseYesterdays[i] = thisClose / lastClose - 1
        }

        if (thisOpen != null && lastClose != null) {
          logOpenYesterdays[i] = Math.log(thisOpen / lastClose)
        }
      }
    }
  })

  const result = {
    averageOpenCloses,
    averageHighLows,

    percentageCloseYesterdays,
    percentageOpenCloses,
    percentageHighLows,

    logSquaredHighLows,
    logSquaredCloseOpens,

    logOpenYesterdays,
    logHighOpens,
    logLowOpens,
    logCloseOpens,

    garminKlassValues,
    rogersSatchellValues,
  }

  return result
}
