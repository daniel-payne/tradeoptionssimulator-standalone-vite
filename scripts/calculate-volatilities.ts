import fs from "fs"
import path from "path"
import Papa from "papaparse"
import calculateVariances from "../src/data/indexDB/calculate/buildVariances"
import calculateVolatilities from "../src/data/indexDB/calculate/buildVolatilities"

const TIMEGAP_CUTOFF = 10
const VOLATILITY_DURATIONS = [10, 30, 90, 180, 360]

const csvToObjectForPrices = (item: any) => {
  if (!item["<DATE>"]) {
    return
  }

  const date = item["<DATE>"].substring(0, 4) + "-" + item["<DATE>"].substring(4, 6) + "-" + item["<DATE>"].substring(6, 8)
  const index = Math.floor(new Date(date).getTime() / 1000 / 60 / 60 / 24)

  const data = {
    date,
    index,
    open: Number.parseFloat(item["<OPEN>"]),
    high: Number.parseFloat(item["<HIGH>"]),
    low: Number.parseFloat(item["<LOW>"]),
    close: Number.parseFloat(item["<CLOSE>"]),
    volume: Number.parseFloat(item["<VOL>"]),
    interest: Number.parseFloat(item["<OPENINT>"]),
  } as any

  return data
}

async function processFile(filePath: string, outputDir: string) {
  const fileName = path.basename(filePath)
  const symbol = fileName.replace(/\.txt$/, "").toUpperCase()
  console.log(`Processing ${symbol}...`)

  const csv = fs.readFileSync(filePath, "utf8")
  const json = Papa.parse(csv, { header: true })

  const prices = json.data
    .map(csvToObjectForPrices)
    .filter((item: any) => item?.open)
    .filter((item) => item.index >= 0)

  if (prices.length === 0) {
    console.warn(`No price data found for ${symbol}`)
    return
  }

  const opens = { symbol, data: Array(20000).fill(undefined) }
  const highs = { symbol, data: Array(20000).fill(undefined) }
  const lows = { symbol, data: Array(20000).fill(undefined) }
  const closes = { symbol, data: Array(20000).fill(undefined) }

  for (const price of prices) {
    const index = price.index
    opens.data[index] = price.open
    highs.data[index] = price.high
    lows.data[index] = price.low
    closes.data[index] = price.close
  }

  let firstActiveIndex: number | null = null
  let lastActiveIndex: number | null = null
  let daysSincePrice = 0
  let timeGapFound = false
  let dataStarted = false

  for (let i = closes.data.length - 1; i >= 0; i--) {
    if (timeGapFound === false) {
      const close = closes.data[i]

      if (close == null) {
        daysSincePrice++
      } else {
        dataStarted = true
        if (lastActiveIndex == null) {
          lastActiveIndex = i
        }
        firstActiveIndex = i
        daysSincePrice = 0
      }

      if (dataStarted == true && daysSincePrice >= TIMEGAP_CUTOFF) {
        timeGapFound = true
      }
    }
  }

  if (firstActiveIndex == null || lastActiveIndex == null) {
    console.warn(`No active range found for ${symbol}`)
    return
  }

  // Calculate variances
  const variances = await calculateVariances({ opens, highs, lows, closes })

  const durationsData: Record<string, any> = {}

  for (const duration of VOLATILITY_DURATIONS) {
    const result = await calculateVolatilities(variances, duration)

    const sliceArray = (arr: number[]) => {
      if (firstActiveIndex == null || lastActiveIndex == null) return []
      return arr.slice(firstActiveIndex, lastActiveIndex + 1).map((val) => (val == null ? null : Number(val.toFixed(4))))
    }

    const overnightSlice = sliceArray(result.overnightVolatilities)
    const parkinsonSlice = sliceArray(result.parkinsonVolatilities)
    const rogersSatchellSlice = sliceArray(result.rogersSatchellVolatilities)
    const garminKlassSlice = sliceArray(result.garminKlassVolatilities)
    const yangZhangSlice = sliceArray(result.yangZhangVolatilities)

    // Compute the unified volatility at each index (fallback chain matching extractVolatilityForIndex)
    const volatilitySlice = overnightSlice.map((_, idx) => {
      const yz = yangZhangSlice[idx]
      const gk = garminKlassSlice[idx]
      const rs = rogersSatchellSlice[idx]
      const pk = parkinsonSlice[idx]
      const on = overnightSlice[idx]
      return yz ?? gk ?? rs ?? pk ?? on ?? null
    })

    durationsData[duration.toString()] = {
      overnight: overnightSlice,
      parkinson: parkinsonSlice,
      rogersSatchell: rogersSatchellSlice,
      garminKlass: garminKlassSlice,
      yangZhang: yangZhangSlice,
      volatility: volatilitySlice,
    }
  }

  const outputObject = {
    symbol,
    firstActiveIndex,
    lastActiveIndex,
    durations: durationsData,
  }

  const outputFilePath = path.join(outputDir, `${symbol.toLowerCase()}.json`)
  fs.writeFileSync(outputFilePath, JSON.stringify(outputObject))
}

async function main() {
  const pricesDir = path.resolve(process.cwd(), "public/prices")
  const outputDir = path.resolve(process.cwd(), "public/volatilities")

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  const files = fs.readdirSync(pricesDir).filter((file) => file.endsWith(".txt"))
  console.log(`Found ${files.length} market price files.`)

  for (const file of files) {
    const filePath = path.join(pricesDir, file)
    await processFile(filePath, outputDir)
  }

  console.log("Pre-calculated volatilities generation completed successfully!")
}

main().catch((err) => {
  console.error("Error generating volatilities:", err)
  process.exit(1)
})
