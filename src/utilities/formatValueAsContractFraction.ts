import toNumeric from "./toNumeric"

export default function formatValueAsContractFraction(input: number | undefined | null) {
  if (input == null) return ""

  const number = toNumeric(input) ?? 0

  if (number === 0) {
    return ""
  }

  switch (number) {
    case 0.25:
      return "Quarter of a contract"
    case 0.5:
      return "Half of a contract"
    case 0.75:
      return "Three quarters of a contract"
    case 1:
      return "One contract"
    case 2:
      return "tWO contract"
    default:
      return number.toFixed(0) + " contracts"
  }
}
