import toNumeric from "./toNumeric"

function round(precision: number, number: number) {
  if (precision > 0) {
    return parseFloat(number.toPrecision(precision))
  }

  return Math.round(number)
}

export default function formatNumber(input: number | undefined | null, decimalPlaces: number = 6) {
  if (input == null) return ""

  const number = toNumeric(input) ?? 0

  return number.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
}
