import {
  MakeSwap as MakeSwapEvent,
  MakerSwaps as MakerSwapsEvent,
  ReceiverCCIPMessage as ReceiverCCIPMessageEvent,
  TakeSwap as TakeSwapEvent,
} from "../generated/CrossChainSwapper/CrossChainSwapper";
import {
  MakeSwap,
  MakerSwaps,
  ReceiverCCIPMessage,
  TakeSwap,
} from "../generated/schema";

import { ByteArray, Bytes } from "@graphprotocol/graph-ts";

export function handleMakeSwap(event: MakeSwapEvent): void {
  let entity = new MakeSwap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.poolKey = event.params.poolKey;
  entity.poolBalance = event.params.poolBalance;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleMakerSwaps(event: MakerSwapsEvent): void {
  let entity = new MakerSwaps(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.messageId = event.params.messageId;
  entity.destinationPoolKey = event.params.destinationPoolKey;
  // Loop through the array of bytes32 and convert to bytes
  let filledMakerSwaps: Array<Bytes> = [];
  for (let i = 0; i < event.params.filledMakerSwaps.length; i++) {
    let filledMakerSwap = event.params.filledMakerSwaps[i];
    let makerBytes = Bytes.fromHexString(
      filledMakerSwap.maker.toHex()
    ) as Bytes;
    let amountBytes = Bytes.fromI32(filledMakerSwap.amount.toI32());
    let combined = makerBytes.concat(amountBytes);
    filledMakerSwaps.push(combined);
  }
  entity.filledMakerSwaps = filledMakerSwaps;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleReceiverCCIPMessage(
  event: ReceiverCCIPMessageEvent
): void {
  let entity = new ReceiverCCIPMessage(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.messageData = event.params.messageData;
  entity.selector = event.params.selector;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}

export function handleTakeSwap(event: TakeSwapEvent): void {
  let entity = new TakeSwap(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  );
  entity.messageId = event.params.messageId;
  entity.destinationPoolKey = event.params.destinationPoolKey;

  entity.blockNumber = event.block.number;
  entity.blockTimestamp = event.block.timestamp;
  entity.transactionHash = event.transaction.hash;

  entity.save();
}
