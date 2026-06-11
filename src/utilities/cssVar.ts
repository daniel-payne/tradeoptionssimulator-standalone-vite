const CACHE: Record<string, string> = {}

export default function cssVar(name: string) {
  let result = CACHE[name]

  if (result == null) {
    result = getComputedStyle(document.documentElement).getPropertyValue(name)

    if (result != null) {
      CACHE[name] = result
    }
  }

  return result
}
