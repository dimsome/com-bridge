import { formatUnits } from '@ethersproject/units';

import { logger } from './logger';

import type { Contract, ContractFactory, ContractReceipt, ContractTransaction, Overrides } from 'ethers';

const log = logger('transactions');

export const deployContract = async <T extends Contract>(
  contractFactory: ContractFactory,
  contractName = 'Contract',
  constructorArgs: unknown[] = [],
  overrides: Overrides = {},
): Promise<T> => {
  const contract = (await contractFactory.deploy(...constructorArgs, overrides)) as T;
  log(
    `Deploying ${contractName} contract with hash ${contract.deployTransaction.hash} from ${
      contract.deployTransaction.from
    } with gas price ${contract.deployTransaction?.gasPrice?.toNumber() ?? 1 / 1e9} Gwei`,
  );
  const receipt = await contract.deployTransaction.wait();
  const txCost = receipt.gasUsed.mul(contract.deployTransaction.gasPrice ?? 0);
  const abiEncodedConstructorArgs = contract.interface.encodeDeploy(constructorArgs);
  log(
    `Deployed ${contractName} to ${contract.address} in block ${
      receipt.blockNumber
    }, using ${receipt.gasUsed.toString()} gas costing ${formatUnits(txCost)} ETH`,
  );
  log(`ABI encoded args: ${abiEncodedConstructorArgs.slice(2)}`);
  return contract;
};

export const logTxDetails = async (tx: ContractTransaction, method: string): Promise<ContractReceipt> => {
  log(`Sent ${method} transaction with hash ${tx.hash} from ${tx.from} with gas price ${tx.gasPrice?.toNumber() ?? 0 / 1e9} Gwei`);
  const receipt = await tx.wait();

  // Calculate tx cost in Wei
  const txCost = receipt.gasUsed.mul(tx.gasPrice ?? 0);
  log(
    `Processed ${method} tx in block ${receipt.blockNumber}, using ${receipt.gasUsed.toString()} gas costing ${formatUnits(txCost)} ETH`,
  );

  return receipt;
};
