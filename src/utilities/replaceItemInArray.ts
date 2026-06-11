export default function replaceItemInArray(array: Array<any> | undefined | null, key: string, item: any) {
  if (array == null) {
    return [item]
  }

  const newArray = structuredClone(array)

  const index = newArray.findIndex((element) => element[key] === item[key])

  if (index === -1) {
    newArray.push(item)
  } else {
    newArray[index] = item
  }

  return newArray
}
