import { parseEther } from "ethers/lib/utils";
import { subtask, task, types } from "hardhat/config";

import { CrossChainSwapper__factory } from "../types/typechain";
import { verifyEtherscan } from "../utils/etherscan";
import { logger } from "../utils/logger";
import { getSigner } from "../utils/signer";
import { deployContract, logTxDetails } from "../utils/transaction";
import { Chain, getChain } from "../utils/network";

const log = logger("task:ccs");

subtask("ccs-deploy", "Deploys a new Cross Chain Swapper contract")
  .addOptionalParam(
    "speed",
    "Defender Relayer speed param: 'safeLow' | 'average' | 'fast' | 'fastest'",
    "fast",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const { speed, name, symbol, decimals, supply } = taskArgs;
    const signer = await getSigner(hre, speed);
    const chain = await getChain(hre);

    let constructorArguments = [];

    if (chain === Chain.sepolia) {
      const liquidityPools = [
        {
          sourceToken: "0x4a3C098D5D1422574015A55d7ad9Cf904226a2e6",
          destinationToken: "0x2237e5dee801a432965210933c1F26696565303d",
          destinationChainId: Chain.fuji, // Avalanche Fuji
          rate: parseEther("1"),
        },
      ];
      constructorArguments = [chain, liquidityPools];
    }
    log(`About to deploy CrossChainSwapper contract on ${chain}`);
    const crossChainSwapper = await deployContract(
      new CrossChainSwapper__factory(signer),
      `Cross Chain Swapper to  ${chain}`,
      constructorArguments
    );

    await verifyEtherscan(hre, {
      address: crossChainSwapper.address,
      constructorArguments,
    });
    return crossChainSwapper;
  });
task("ccs-deploy").setAction(async (_, __, runSuper) => {
  return runSuper();
});

module.exports = {};
