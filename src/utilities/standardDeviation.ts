export default function standardDeviation(array: number[]) {
  if (array == null || array.length < 2) {
    return undefined
  }

  const data = array.filter((i) => i != null)

  if (data.length === 0) {
    return undefined
  }

  const n = data.length
  const mean = data.reduce((a, b) => a + b) / n

  return Math.sqrt(data.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / (n - 1))
}
