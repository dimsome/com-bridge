import type { HardhatRuntimeEnvironment } from "hardhat/types";

export enum Chain {
  mainnet = 1,
  goerli = 5,
  sepolia = 11155111,
  polygon = 137,
  mumbai = 80001,
  arbitrum = 42161,
  arbitrumGoerli = 421613,
  optimism = 10,
  optimismGoerli = 420,
  Base = 8453,
  BaseGoerli = 84531,
  bsc = 56,
  bscTestnet = 97,
  avalanche = 43114,
  fuji = 43113,
  fantom = 250,
  gnosis = 100,
  hardhat = 31337,
  celo = 42220,
  scroll = 534351, // Scroll Sepolia Testnet
}

export const getChain = (hre: HardhatRuntimeEnvironment): Chain => {
  if (
    hre?.network.name === "mainnet" ||
    hre?.hardhatArguments?.config === "tasks-fork.config.ts"
  ) {
    return Chain.mainnet;
  }
  if (
    hre?.network.name === "polygon_mainnet" ||
    hre?.hardhatArguments?.config === "tasks-fork-polygon.config.ts"
  ) {
    return Chain.polygon;
  }
  if (hre?.network.name === "polygon_testnet") {
    return Chain.mumbai;
  }
  if (hre?.network.name === "goerli") {
    return Chain.goerli;
  }
  if (hre?.network.name === "sepolia") {
    return Chain.sepolia;
  }
  if (
    hre?.network.name === "fuji" ||
    hre?.hardhatArguments?.config === "tasks-fork-fuji.config.ts"
  ) {
    return Chain.fuji;
  }
  if (hre?.network.name === "mumbai") {
    return Chain.mumbai;
  }
  if (hre?.network.name === "arbitrum") {
    return Chain.arbitrum;
  }
  if (hre?.network.name === "arbitrumGoerli") {
    return Chain.arbitrumGoerli;
  }
  if (hre?.network.name === "celo") {
    return Chain.celo;
  }
  if (hre?.network.name === "scroll") {
    return Chain.scroll;
  }
  if (hre?.network.name === "base") {
    return Chain.Base;
  }
  if (hre?.network.name === "baseGoerli") {
    return Chain.BaseGoerli;
  }
  return Chain.mainnet;
};
