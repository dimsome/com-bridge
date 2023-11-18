import { parseEther } from "ethers/lib/utils";
import { subtask, task, types } from "hardhat/config";

import { CrossChainSwapper__factory } from "../types/typechain";
import { verifyEtherscan } from "../utils/etherscan";
import { logger } from "../utils/logger";
import { getSigner } from "../utils/signer";
import { deployContract, logTxDetails } from "../utils/transaction";
import { Chain, getChain } from "../utils/network";
import { fMeow, sMeow } from "../utils/tokens";
import { resolveNamedAddress } from "../utils/namedAddress";
import { resolveAssetToken } from "../utils/resolvers";

const log = logger("task:ccs");

subtask(
  "ccs-deposit",
  "Deposits Meow in the Cross Chain Swapper contract"
).setAction(async (taskArgs, hre) => {
  const signer = await getSigner(hre);
  const chain = await getChain(hre);

  const swapperAddress = await resolveNamedAddress("CrossChainSwapper", chain);
});
task("ccs-deposit").setAction(async (_, __, runSuper) => {
  return runSuper();
});

subtask("ccs-deploy", "Deploys a new Cross Chain Swapper contract").setAction(
  async (taskArgs, hre) => {
    const signer = await getSigner(hre);
    const chain = await getChain(hre);

    let liquidityPools = [];
    if (chain === Chain.sepolia) {
      liquidityPools = [
        {
          sourceToken: sMeow.address,
          destinationToken: fMeow.address,
          destinationChainId: Chain.fuji, // Avalanche Fuji
          rate: parseEther("1"),
        },
      ];
    } else if (chain === Chain.fuji) {
      liquidityPools = [
        {
          sourceToken: fMeow.address,
          destinationToken: sMeow.address,
          destinationChainId: Chain.sepolia,
          rate: parseEther("1"),
        },
      ];
    }

    const linkToken = await resolveAssetToken(signer, chain, "Link");
    const constructorArguments = [
      chain,
      liquidityPools,
      resolveNamedAddress("CCIP_Router", chain),
      linkToken.address,
    ];
    log(`About to deploy CrossChainSwapper contract on ${chain}`);
    const crossChainSwapper = await deployContract(
      new CrossChainSwapper__factory(signer),
      `Cross Chain Swapper to ${chain}`,
      constructorArguments
    );

    await verifyEtherscan(hre, {
      address: crossChainSwapper.address,
      constructorArguments,
    });
    return crossChainSwapper;
  }
);
task("ccs-deploy").setAction(async (_, __, runSuper) => {
  return runSuper();
});

module.exports = {};
