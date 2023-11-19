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
  symbol: "meow",
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
  symbol: "meow",
  address: "0xa3C235f09F1491fbc714efDAA7504089E49Df1b2",
  chain: Chain.fuji,
  decimals: 18,
} as const;

export const fLink: Token = {
  symbol: "Link",
  address: "0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846",
  chain: Chain.fuji,
  decimals: 18,
} as const;

// Polygon Mumbai

export const mMeow: Token = {
  symbol: "meow",
  address: "0x75281fFc939bc0D013964954959793f760342B11",
  chain: Chain.mumbai,
  decimals: 18,
} as const;

export const mLink: Token = {
  symbol: "Link",
  address: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
  chain: Chain.mumbai,
  decimals: 18,
} as const;

// Arbitrum Goerli

export const agMeow: Token = {
  symbol: "meow",
  address: "0x75281fFc939bc0D013964954959793f760342B11",
  chain: Chain.arbitrumGoerli,
  decimals: 18,
} as const;

export const agLink: Token = {
  symbol: "Link",
  address: "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28",
  chain: Chain.arbitrumGoerli,
  decimals: 18,
} as const;

// Base Goerli

export const bgMeow: Token = {
  symbol: "meow",
  address: "0x75281fFc939bc0D013964954959793f760342B11",
  chain: Chain.BaseGoerli,
  decimals: 18,
} as const;

export const bgLink: Token = {
  symbol: "Link",
  address: "0xd886e2286fd1073df82462ea1822119600af80b6",
  chain: Chain.BaseGoerli,
  decimals: 18,
} as const;

// Scroll Sepolia

export const scMeow: Token = {
  symbol: "meow",
  address: "0x75281fFc939bc0D013964954959793f760342B11",
  chain: Chain.scroll,
  decimals: 18,
} as const;

export const scLink: Token = {
  symbol: "Link",
  address: "0xd886e2286fd1073df82462ea1822119600af80b6",
  chain: Chain.scroll,
  decimals: 18,
} as const;

export const tokens = [
  sMeow,
  sLink,
  fMeow,
  fLink,
  mMeow,
  mLink,
  agMeow,
  agLink,
  bgMeow,
  bgLink,
  scMeow,
  scLink,
];
