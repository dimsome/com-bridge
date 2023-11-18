import { newMockEvent } from "matchstick-as"
import { ethereum, Bytes, BigInt } from "@graphprotocol/graph-ts"
import {
  MakeSwap,
  MakerSwaps,
  ReceiverCCIPMessage,
  TakeSwap
} from "../generated/CrossChainSwapper/CrossChainSwapper"

export function createMakeSwapEvent(
  poolKey: Bytes,
  poolBalance: BigInt
): MakeSwap {
  let makeSwapEvent = changetype<MakeSwap>(newMockEvent())

  makeSwapEvent.parameters = new Array()

  makeSwapEvent.parameters.push(
    new ethereum.EventParam("poolKey", ethereum.Value.fromFixedBytes(poolKey))
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

export function createReceiverCCIPMessageEvent(
  messageData: Bytes,
  selector: Bytes
): ReceiverCCIPMessage {
  let receiverCcipMessageEvent = changetype<ReceiverCCIPMessage>(newMockEvent())

  receiverCcipMessageEvent.parameters = new Array()

  receiverCcipMessageEvent.parameters.push(
    new ethereum.EventParam(
      "messageData",
      ethereum.Value.fromBytes(messageData)
    )
  )
  receiverCcipMessageEvent.parameters.push(
    new ethereum.EventParam("selector", ethereum.Value.fromFixedBytes(selector))
  )

  return receiverCcipMessageEvent
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
