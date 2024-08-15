import { Variances } from "../types/Variances"
import type { Volatilities } from "../types/Volatilities"

import average from "@/utilities/average"
import standardDeviation from "@/utilities/standardDeviation"

const PARKINSON_FACTOR = 1 / Math.sqrt(4 * Math.log(2))
// const GARMIN_KLASS_FACTOR = 3 * Math.log(2) - 1

export default async function calculateVolatilities(variances: Variances, duration: number): Promise<Volatilities> {
  const {
    averageOpenCloses,
    // averageHighLows,

    percentageCloseYesterdays,
    // percentageOpenCloses,
    // percentageHighLows,

    logSquaredHighLows,
    // logSquaredCloseOpens,

    logOpenYesterdays,
    // logHighOpens,
    // logLowOpens,
    logCloseOpens,

    garminKlassValues,
    rogersSatchellValues,
  } = variances

  const length = averageOpenCloses.length + 1

  const overnightVolatilities = Array(length).fill(undefined)
  const parkinsonVolatilities = Array(length).fill(undefined)
  const rogersSatchellVolatilities = Array(length).fill(undefined)
  const garminKlassVolatilities = Array(length).fill(undefined)
  const yangZhangVolatilities = Array(length).fill(undefined)

  averageOpenCloses.forEach((_, i) => {
    if (i > duration + 1 && averageOpenCloses[i] != null) {
      const yangZhangFactor = 0.34 / (1.34 + (duration + 1) / (duration - 1))

      const percentageCloseYesterdaysSlice = percentageCloseYesterdays.slice(i - duration, i)
      const logSquaredHighLowsSlice = logSquaredHighLows.slice(i - duration, i)
      const garminKlassValuesSlice = garminKlassValues.slice(i - duration, i)

      const logOpenYesterdaysSlice = logOpenYesterdays.slice(i - duration, i)
      const logCloseOpensSlice = logCloseOpens.slice(i - duration, i)

      const rogersSatchellValuesSlice = rogersSatchellValues.slice(i - duration, i)

      const averageLogSquaredHighLowsSlice = average(logSquaredHighLowsSlice)
      const averageGarminKlassValuesSlice = average(garminKlassValuesSlice)
      const averageRogersSatchellValuesSlice = average(rogersSatchellValuesSlice)

      const standardDeviationPercentageCloseYesterdaysSlice = standardDeviation(percentageCloseYesterdaysSlice)
      const standardDeviationLogOpenYesterdaysSlice = standardDeviation(logOpenYesterdaysSlice)
      const standardDeviationLogCloseOpensSlice = standardDeviation(logCloseOpensSlice)

      if (standardDeviationPercentageCloseYesterdaysSlice) {
        overnightVolatilities[i] = standardDeviationPercentageCloseYesterdaysSlice
      }

      if (averageLogSquaredHighLowsSlice) {
        parkinsonVolatilities[i] = Math.sqrt(averageLogSquaredHighLowsSlice * PARKINSON_FACTOR)
      }

      if (averageGarminKlassValuesSlice) {
        garminKlassVolatilities[i] = Math.sqrt(averageGarminKlassValuesSlice)
      }

      if (averageRogersSatchellValuesSlice) {
        rogersSatchellVolatilities[i] = Math.sqrt(averageRogersSatchellValuesSlice)
      }

      if (standardDeviationLogOpenYesterdaysSlice && standardDeviationLogCloseOpensSlice && rogersSatchellVolatilities[i]) {
        yangZhangVolatilities[i] = Math.sqrt(
          standardDeviationLogOpenYesterdaysSlice ** 2 +
            (yangZhangFactor * standardDeviationLogCloseOpensSlice) ** 2 +
            (1 - yangZhangFactor) * rogersSatchellVolatilities[i] ** 2
        )
      }
    }
  })

  const result = {
    overnightVolatilities,
    parkinsonVolatilities,
    rogersSatchellVolatilities,
    garminKlassVolatilities,
    yangZhangVolatilities,
  } as Volatilities

  return result
}
