export default function replaceItemInDictionary(dictionary: Record<string, any> | undefined | null, name: string, item: any) {
  const key = item[name]

  if (dictionary == null) {
    return { [key]: item }
  }

  const newDictionary = structuredClone(dictionary)

  newDictionary[key] = item

  return newDictionary
}
