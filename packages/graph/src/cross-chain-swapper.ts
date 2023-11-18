import {
  MakeSwap as MakeSwapEvent,
  MakerSwaps as MakerSwapsEvent,
  ReceiverCCIPMessage as ReceiverCCIPMessageEvent,
  TakeSwap as TakeSwapEvent
} from "../generated/CrossChainSwapper/CrossChainSwapper"
import {
  MakeSwap,
  MakerSwaps,
  ReceiverCCIPMessage,
  TakeSwap
} from "../generated/schema"

export function handleMakeSwap(event: MakeSwapEvent): void {
  let entity = new MakeSwap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.poolKey = event.params.poolKey
  entity.poolBalance = event.params.poolBalance

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMakerSwaps(event: MakerSwapsEvent): void {
  let entity = new MakerSwaps(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.messageId = event.params.messageId
  entity.destinationPoolKey = event.params.destinationPoolKey
  entity.filledMakerSwaps = event.params.filledMakerSwaps

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleReceiverCCIPMessage(
  event: ReceiverCCIPMessageEvent
): void {
  let entity = new ReceiverCCIPMessage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.messageData = event.params.messageData
  entity.selector = event.params.selector

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTakeSwap(event: TakeSwapEvent): void {
  let entity = new TakeSwap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.messageId = event.params.messageId
  entity.destinationPoolKey = event.params.destinationPoolKey

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
