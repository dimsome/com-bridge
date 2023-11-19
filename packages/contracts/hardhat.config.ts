import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-chai-matchers";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "hardhat-tracer";
import "solidity-coverage";
import "hardhat-abi-exporter";
import "@nomiclabs/hardhat-etherscan";
import "ts-node/register";

import type { HardhatUserConfig } from "hardhat/types";

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.23",
        settings: {
          optimizer: { enabled: false, runs: 200 },
          viaIR: false,
        },
      },
    ],
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: false,
      initialBaseFeePerGas: 0,
    },
    local: { url: "http://localhost:8545" },
    anvil: { url: "http://localhost:8545" },
    goerli: {
      url: process.env.NODE_URL ?? "",
    },
    sepolia: {
      url: process.env.NODE_URL ?? "",
    },
    polygon: {
      url: process.env.NODE_URL ?? "",
    },
    mainnet: {
      url: process.env.NODE_URL ?? "",
    },
    fuji: {
      url: process.env.NODE_URL ?? "",
    },
    mumbai: {
      url: process.env.NODE_URL ?? "",
    },
    celo: {
      url: process.env.NODE_URL ?? "",
    },
    scroll: {
      url: process.env.NODE_URL ?? "",
    },
    arbitrum: {
      url: process.env.NODE_URL ?? "",
    },
    arbitrumGoerli: {
      url: process.env.NODE_URL ?? "",
    },
    base: {
      url: process.env.NODE_URL ?? "",
    },
    baseGoerli: {
      url: process.env.NODE_URL ?? "",
    },
    testnet: {
      url: process.env.NODE_URL ?? "",
    },
  },
  abiExporter: {
    path: "./dist/abis",
    clear: true,
    flat: true,
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_KEY,
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 30,
  },
  mocha: {
    timeout: 10000,
  },
  typechain: {
    outDir: "src/types/typechain",
    target: "ethers-v5",
  },
  tracer: {
    tasks: ["ccs-deposit", "ccs-make-swap", "ccs-take-swap", "ccs-dest"],
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: false,
  },
};

export default config;
