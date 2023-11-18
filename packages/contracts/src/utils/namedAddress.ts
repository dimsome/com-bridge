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
        return "0x6340B990D14Fc67bcFb4Ee3E1c8987E27fA15a23";
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
        return "0xA88242Aec1fA30c0d77277D4eaAf4a23107CcA74";
      case "CCIP_Router":
        return "0x554472a2720e5e7d5d3c817529aba05eed5f82d8";
      case "CCIP_ChainSelector":
        return "14767482510784806043";
      case "SelectorLib":
        return "0x6725B13eD908FB146778b7CD956c385d3d88F587";
      default:
    }
  } else if (chain === Chain.arbitrumGoerli) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0x4a3C098D5D1422574015A55d7ad9Cf904226a2e6";
      case "CCIP_Router":
        return "0x88E492127709447A5ABEFdaB8788a15B4567589E";
      case "CCIP_ChainSelector":
        return "6101244977088475029";
      case "SelectorLib":
        return "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28";
      default:
    }
  } else if (chain === Chain.mumbai) {
    switch (contractName) {
      case "CrossChainSwapper":
        return "0xFfC3b028e159C1d3A5a9d158f3bc60ABE76F92cB";
      case "CCIP_Router":
        return "0x70499c328e1e2a3c41108bd3730f6670a44595d1";
      case "CCIP_ChainSelector":
        return "12532609583862916517";
      case "SelectorLib":
        return "0xe99688A81C02bf72f02CBac04cDCA7f1108F72cb";
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
