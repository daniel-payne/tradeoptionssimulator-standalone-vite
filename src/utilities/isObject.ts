export default function isObject(input: any) {
  if (input == null) {
    return false
  }

  return typeof input === "object" && !Array.isArray(input)
}
