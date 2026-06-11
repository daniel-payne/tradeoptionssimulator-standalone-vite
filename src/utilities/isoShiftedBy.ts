import { addDays, addWeeks, addMonths, addYears, getTime, startOfMonth, endOfMonth } from "date-fns"

export default function isoShiftedBy(
  timestamp: number | string | undefined | null,

  amount: number = 1,
  period: "days" | "weeks" | "months" | "years" = "days",

  useMonthBarrier: boolean = false
) {
  if (timestamp == null) {
    return null
  }

  const date = new Date(timestamp)

  let result

  if (period === "days") {
    result = addDays(date, amount)
  } else if (period === "weeks") {
    result = addWeeks(date, amount)
  } else if (period === "months") {
    result = addMonths(date, amount)
  } else if (period === "years") {
    result = addYears(date, amount)
  }

  if (useMonthBarrier && result != null) {
    if (amount < 0) {
      result = startOfMonth(result)
    } else {
      result = endOfMonth(result)
    }
  }

  if (result != null) {
    return getTime(result)
  }
}
