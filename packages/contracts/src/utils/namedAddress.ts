import { Chain } from "./network";

export const contractNames = [
  "CrossChainSwapper",
  "CCIP_Router",
  "CCIP_ChainSelector",
  "SelectorLib",
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
        return "0x5369B69810E7e682dc2ce04C9dF972Aa61887Fdc";
      case "CCIP_Router":
        return "0xd0daae2231e9cb96b94c8512223533293c3693bf";
      case "CCIP_ChainSelector":
        return "16015286601757825753";
      case "SelectorLib":
        return "0x70c9e4B7EeE35182Da63Da625DaAE1F75CA65bF1";
      default:
    }
  } else if (chain === Chain.fuji) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0x08bC993703b6e8a4ACe99E6F9687d87a4a5AEFeF";
      case "CCIP_Router":
        return "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
      case "CCIP_ChainSelector":
        return "14767482510784806043";
      case "SelectorLib":
        return "0x6725B13eD908FB146778b7CD956c385d3d88F587";
      default:
    }
  }
};
