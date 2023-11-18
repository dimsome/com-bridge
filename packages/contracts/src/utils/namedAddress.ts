import { Chain } from "./network";

export const contractNames = ["CrossChainSwapper", "CCIP_Router"] as const;
export type ContractNames = (typeof contractNames)[number];

export const resolveNamedAddress = (
  contractName: ContractNames,
  chain: Chain
): string | undefined => {
  // Common addresses across all chains

  // Chain specific addresses
  if (chain === Chain.mainnet) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "";
      default:
    }
  } else if (chain === Chain.sepolia) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0x035CC09B3Fc67f97dd5A0024cfb290CD766f9A33";
      case "CCIP_Router":
        return "0xd0daae2231e9cb96b94c8512223533293c3693bf";
      default:
    }
  } else if (chain === Chain.fuji) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0x57509d4aB51940829C496c740538883Fdfae2223";
      case "CCIP_Router":
        return "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
      default:
    }
  }
};
