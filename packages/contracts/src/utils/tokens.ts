import { Chain } from "./network";
import { ethereumAddress } from "./regex";

import type { Token } from "../types/index";

export function isToken(asset: unknown): asset is Token {
  const token = asset as Token;
  return !!(
    "symbol" in token &&
    token.address.match(ethereumAddress) &&
    "chain" in token &&
    "decimals" in token
  );
}

/// Sepolia

export const sMeow: Token = {
  symbol: "Meow",
  address: "0x84d7F52cAF3C4A4EAdC998FD102fD23134159495",
  chain: Chain.sepolia,
  decimals: 18,
} as const;

export const sLink: Token = {
  symbol: "Link",
  address: "0x779877A7B0D9E8603169DdbD7836e478b4624789",
  chain: Chain.sepolia,
  decimals: 18,
} as const;

/// Avalanche Fuji

export const fMeow: Token = {
  symbol: "Meow",
  address: "0xBe9BfA969e13BDfDf04638Fe52256D0be4A7BaDF",
  chain: Chain.sepolia,
  decimals: 18,
} as const;

export const fLink: Token = {
  symbol: "Link",
  address: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
  chain: Chain.fuji,
  decimals: 18,
} as const;

export const tokens = [sMeow, sLink, fMeow, fLink];
