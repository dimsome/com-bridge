import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Bytes, BigInt } from "@graphprotocol/graph-ts"
import { MakeSwap } from "../generated/schema"
import { MakeSwap as MakeSwapEvent } from "../generated/CrossChainSwapper/CrossChainSwapper"
import { handleMakeSwap } from "../src/cross-chain-swapper"
import { createMakeSwapEvent } from "./cross-chain-swapper-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let poolKey = Bytes.fromI32(1234567890)
    let poolBalance = BigInt.fromI32(234)
    let newMakeSwapEvent = createMakeSwapEvent(poolKey, poolBalance)
    handleMakeSwap(newMakeSwapEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("MakeSwap created and stored", () => {
    assert.entityCount("MakeSwap", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "MakeSwap",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolKey",
      "1234567890"
    )
    assert.fieldEquals(
      "MakeSwap",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "poolBalance",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
