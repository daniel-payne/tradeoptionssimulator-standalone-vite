// @ts-expect-error no type
import { Option } from "option-pricing"

export default async function calculateOption(
  spotPrice: number,
  strikePrice: number,
  range: number,
  volatility: number,
  interestRate: number,
  type: string = "european" // american
) {
  const putOption = new Option({
    style: type.toLowerCase(),
    type: "put",
    initialSpotPrice: spotPrice,
    strikePrice: strikePrice,
    timeToMaturity: range / 365,
    volatility: volatility,
    riskFreeRate: interestRate / 100,
    dividendYield: 0.0,
  })

  const callOption = new Option({
    style: type.toLowerCase(),
    type: "call",
    initialSpotPrice: spotPrice,
    strikePrice: strikePrice,
    timeToMaturity: range / 365,
    volatility: volatility,
    riskFreeRate: interestRate / 100,
    dividendYield: 0.0,
  })

  let result = {}

  if (type.toUpperCase() === "EUROPEAN") {
    result = {
      call: {
        price: callOption.price("black-scholes"),
      },
      put: {
        price: putOption.price("black-scholes"),
      },
    }
  } else if (type.toUpperCase() === "AMERICAN") {
    result = {
      call: {
        price: callOption.price("binomial-tree", { timeSteps: 100 }),
      },
      put: {
        price: putOption.price("binomial-tree", { timeSteps: 100 }),
      },
    }
  } else {
    result = {
      call: {
        price: callOption.price("monte-carlo-simulation", {
          simulations: 1000,
          timeSteps: 50,
          prngName: "sfc32",
          prngSeed: "123",
          prngAdvancePast: 15,
        }),
      },
      put: {
        price: putOption.price("monte-carlo-simulation", {
          simulations: 1000,
          timeSteps: 50,
          prngName: "sfc32",
          prngSeed: "123",
          prngAdvancePast: 15,
        }),
      },
    }
  }

  return result
}
