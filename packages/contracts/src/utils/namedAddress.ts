import { Chain } from './network';

export const contractNames = [
  'EntryPoint',
  'StackupPaymaster',
  'StackupBundler',
  'DexWallet',
  'DexWalletFactory',
  'SimpleAccountFactory',
  'SimpleAccount',
  'AbstractAccount',
] as const;
export type ContractNames = (typeof contractNames)[number];

export const resolveNamedAddress = (contractName: ContractNames, chain: Chain): string | undefined => {
  // Common addresses across all chains
  switch (contractName) {
    case 'EntryPoint':
      return '0x0576a174D229E3cFA37253523E645A78A0C91B57';
    default:
  }

  // Chain specific addresses
  if (chain === Chain.mainnet) {
    switch (contractName) {
      case 'StackupPaymaster':
        return '0x6087C019C9495139AD9ED230173e8681DEe3FFF2';
      default:
    }
  }
};
