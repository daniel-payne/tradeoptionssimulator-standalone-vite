export default function formatIndexAsDay(index: number | string | undefined | null) {
  if (index == null || index === "") {
    return null
  }

  const epoch = +index * 1000 * 60 * 60 * 24

  return new Date(epoch).toLocaleDateString(undefined, {
    weekday: "short",
  })
}
