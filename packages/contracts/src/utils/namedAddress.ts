import { Chain } from "./network";

export const contractNames = [
  "CrossChainSwapper",
  "CCIP_Router",
  "CCIP_ChainSelector",
  "SelectorLib",
  "Dimitri",
  "Adam",
] as const;
export type ContractNames = (typeof contractNames)[number];

export const resolveName = (
  contractName: ContractNames,
  chain: Chain
): string | undefined => {
  // Common addresses across all chains
  switch (contractName) {
    case "Dimitri":
      return "0xD5fC6be6dA120227E5ACB5B6c1006A892b85BB32";
    case "Adam":
      return "0x589F6Cc29e9a08db99ab6896B2Fb3BBE28245233";
    default:
  }

  // Chain specific addresses
  if (chain === Chain.mainnet) {
    switch (contractName) {
      default:
    }
  } else if (chain === Chain.sepolia) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0xbE297B899dB97A161BD24058daB8751510951BB7";
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
        return "0xa47fBe44E10000F27Eb64698720AFA1bc6C50582";
      case "CCIP_Router":
        return "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
      case "CCIP_ChainSelector":
        return "14767482510784806043";
      case "SelectorLib":
        return "0x6725B13eD908FB146778b7CD956c385d3d88F587";
      default:
    }
  } else if (chain === Chain.celo) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0xad3482704e34567b7AAEe584A7d47cCDaff30E5A";
      case "CCIP_Router":
        return "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
      case "CCIP_ChainSelector":
        return "14767482510784806043";
      case "SelectorLib":
        return "0x6725B13eD908FB146778b7CD956c385d3d88F587";
      default:
    }
  } else if (chain === Chain.scroll) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0xad3482704e34567b7AAEe584A7d47cCDaff30E5A";
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
