export default function isArray(input: any) {
  if (input == null) {
    return false
  }

  return typeof input === "object" && Array.isArray(input)
}
