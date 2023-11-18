import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import { MakeSwap } from "../generated/schema"
import { MakeSwap as MakeSwapEvent } from "../generated/CrossChainSwapper/CrossChainSwapper"
import { handleMakeSwap } from "../src/cross-chain-swapper"
import { createMakeSwapEvent } from "./cross-chain-swapper-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let token = Address.fromString("0x0000000000000000000000000000000000000001")
    let destinationChainId = BigInt.fromI32(234)
    let poolBalance = BigInt.fromI32(234)
    let newMakeSwapEvent = createMakeSwapEvent(
      token,
      destinationChainId,
      poolBalance
    )
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
      "token",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "MakeSwap",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "destinationChainId",
      "234"
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
