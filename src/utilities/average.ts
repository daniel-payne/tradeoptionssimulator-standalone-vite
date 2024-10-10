export default function average(array: number[]) {
  if (array == null || array.length === 0) {
    return undefined
  }

  const data = array.filter((i) => i != null)

  if (data.length === 0) {
    return undefined
  }

  return data.reduce((p, c) => p + c, 0) / array.length
}
