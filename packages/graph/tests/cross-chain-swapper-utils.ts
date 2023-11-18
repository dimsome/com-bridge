import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  MakeSwap,
  MakerSwaps,
  TakeSwap
} from "../generated/CrossChainSwapper/CrossChainSwapper"

export function createMakeSwapEvent(
  token: Address,
  destinationChainId: BigInt,
  poolBalance: BigInt
): MakeSwap {
  let makeSwapEvent = changetype<MakeSwap>(newMockEvent())

  makeSwapEvent.parameters = new Array()

  makeSwapEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )
  makeSwapEvent.parameters.push(
    new ethereum.EventParam(
      "destinationChainId",
      ethereum.Value.fromUnsignedBigInt(destinationChainId)
    )
  )
  makeSwapEvent.parameters.push(
    new ethereum.EventParam(
      "poolBalance",
      ethereum.Value.fromUnsignedBigInt(poolBalance)
    )
  )

  return makeSwapEvent
}

export function createMakerSwapsEvent(
  messageId: Bytes,
  destinationPoolKey: Bytes,
  filledMakerSwaps: Array<ethereum.Tuple>
): MakerSwaps {
  let makerSwapsEvent = changetype<MakerSwaps>(newMockEvent())

  makerSwapsEvent.parameters = new Array()

  makerSwapsEvent.parameters.push(
    new ethereum.EventParam(
      "messageId",
      ethereum.Value.fromFixedBytes(messageId)
    )
  )
  makerSwapsEvent.parameters.push(
    new ethereum.EventParam(
      "destinationPoolKey",
      ethereum.Value.fromFixedBytes(destinationPoolKey)
    )
  )
  makerSwapsEvent.parameters.push(
    new ethereum.EventParam(
      "filledMakerSwaps",
      ethereum.Value.fromTupleArray(filledMakerSwaps)
    )
  )

  return makerSwapsEvent
}

export function createTakeSwapEvent(
  messageId: Bytes,
  destinationPoolKey: Bytes
): TakeSwap {
  let takeSwapEvent = changetype<TakeSwap>(newMockEvent())

  takeSwapEvent.parameters = new Array()

  takeSwapEvent.parameters.push(
    new ethereum.EventParam(
      "messageId",
      ethereum.Value.fromFixedBytes(messageId)
    )
  )
  takeSwapEvent.parameters.push(
    new ethereum.EventParam(
      "destinationPoolKey",
      ethereum.Value.fromFixedBytes(destinationPoolKey)
    )
  )

  return takeSwapEvent
}
