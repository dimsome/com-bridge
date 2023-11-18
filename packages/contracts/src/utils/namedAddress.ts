import { Chain } from "./network";

export const contractNames = [
  "CrossChainSwapper",
  "CCIP_Router",
  "CCIP_ChainSelector",
] as const;
export type ContractNames = (typeof contractNames)[number];

export const resolveName = (
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
        return "0xA1fC26DF5d8b28ad2bC8E5903F671e545d2D7C91";
      case "CCIP_Router":
        return "0xd0daae2231e9cb96b94c8512223533293c3693bf";
      case "CCIP_ChainSelector":
        return "16015286601757825753";
      default:
    }
  } else if (chain === Chain.fuji) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0xe99688A81C02bf72f02CBac04cDCA7f1108F72cb";
      case "CCIP_Router":
        return "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
      case "CCIP_ChainSelector":
        return "14767482510784806043";
      default:
    }
  }
};
