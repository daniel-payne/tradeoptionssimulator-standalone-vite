export default function formatDateAsIndex(input: Date | string | undefined | null) {
  if (input == null || input === "") {
    return null
  }

  const date = new Date(input)

  const index = date.getTime() / 1000 / 60 / 60 / 24

  return index
}
