import { parseUnits, parseEther } from "ethers/lib/utils";
import { subtask, task, types } from "hardhat/config";

import {
  CrossChainSwapper__factory,
  SelectorLib__factory,
} from "../types/typechain";
import { verifyEtherscan } from "../utils/etherscan";
import { logger } from "../utils/logger";
import { getSigner } from "../utils/signer";
import { deployContract, logTxDetails } from "../utils/transaction";
import { Chain, getChain } from "../utils/network";
import { agMeow, bgMeow, fMeow, sMeow } from "../utils/tokens";
import { resolveName } from "../utils/namedAddress";
import { resolveAssetToken } from "../utils/resolvers";
import { parse } from "path";

const log = logger("task:ccs");

subtask("ccs-deposit", "Deposits Meow in the Cross Chain Swapper contract")
  .addParam("amount", "Amount to deposit.", undefined, types.float)
  .addOptionalParam(
    "token",
    "Token symbol or address. eg meow",
    "meow",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const signer = await getSigner(hre);
    const chain = await getChain(hre);

    const swapperAddress = await resolveName("CrossChainSwapper", chain);
    const swapper = CrossChainSwapper__factory.connect(swapperAddress, signer);

    const token = await resolveAssetToken(signer, chain, taskArgs.token);
    const amountBN = parseUnits(taskArgs.amount.toString(), token.decimals);

    log(
      `About to deposit ${taskArgs.amount} ${token.symbol} into CrossChainSwapper with address ${swapperAddress}`
    );
    const tx = await swapper.deposit(token.address, amountBN);
    await logTxDetails(
      tx,
      `deposit ${taskArgs.amount} ${token.symbol} into CrossChainSwapper with address ${swapperAddress}`
    );
  });
task("ccs-deposit").setAction(async (_, __, runSuper) => {
  return runSuper();
});

subtask("ccs-make-swap", "Maker creates a swap")
  .addParam("amount", "Amount to swap.", undefined, types.float)
  .addOptionalParam(
    "token",
    "Token symbol or address. eg meow",
    "meow",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const signer = await getSigner(hre);
    const chain = await getChain(hre);

    const swapperAddress = await resolveName("CrossChainSwapper", chain);
    const swapper = CrossChainSwapper__factory.connect(swapperAddress, signer);

    const amountBN = parseUnits(taskArgs.amount.toString(), sMeow.decimals);
    const rate = parseUnits("1", sMeow.decimals);

    log(`About to create swap for ${taskArgs.amount} Meow`);
    const tx = await swapper.makeSwap(
      chain === Chain.sepolia ? sMeow.address : bgMeow.address,
      chain === Chain.sepolia ? fMeow.address : agMeow.address,
      chain === Chain.sepolia ? Chain.fuji : Chain.arbitrumGoerli,
      rate,
      amountBN
    );
    await logTxDetails(
      tx,
      `create swap for ${taskArgs.amount} ${sMeow.symbol}`
    );
  });
task("ccs-make-swap").setAction(async (_, __, runSuper) => {
  return runSuper();
});

subtask("ccs-take-swap", "Taker matches a swap")
  .addParam("amount", "Amount to swap.", undefined, types.float)
  .addOptionalParam(
    "token",
    "Token symbol or address. eg Meow",
    "meow",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const signer = await getSigner(hre);
    const chain = await getChain(hre);

    const swapperAddress = await resolveName("CrossChainSwapper", chain);
    const swapper = CrossChainSwapper__factory.connect(swapperAddress, signer);

    const amountBN = parseUnits(taskArgs.amount.toString(), sMeow.decimals);
    const rate = parseUnits("1", sMeow.decimals);

    log(
      `About to take swap for ${taskArgs.amount} Meow against Swapper ${swapperAddress}`
    );
    const tx = await swapper.takeSwap(
      chain === Chain.fuji ? fMeow.address : agMeow.address,
      chain === Chain.fuji ? sMeow.address : bgMeow.address,
      chain === Chain.fuji ? Chain.sepolia : Chain.BaseGoerli,
      rate,
      amountBN
    );
    await logTxDetails(
      tx,
      `matched swap for ${taskArgs.amount} ${sMeow.symbol}`
    );
  });
task("ccs-take-swap").setAction(async (_, __, runSuper) => {
  return runSuper();
});

subtask("ccs-dest", "Add destination data to the source Swapper")
  .addParam("chainId", "Chain id", undefined, types.int)
  .setAction(async (taskArgs, hre) => {
    const { chainId } = taskArgs;
    const signer = await getSigner(hre);
    const chain = await getChain(hre);

    const swapperAddress = await resolveName("CrossChainSwapper", chain);
    log(`swapper address: ${swapperAddress}`);
    const swapper = CrossChainSwapper__factory.connect(swapperAddress, signer);

    const destinationData = {
      ccipChainSelector: resolveName("CCIP_ChainSelector", chainId),
      swapper: resolveName("CrossChainSwapper", chainId),
    };

    log(
      `About to add destination data for chain ${chainId} to Swapper on ${chain}:`
    );
    log(`  CCIP Selector ${destinationData.ccipChainSelector}`);
    log(`  Swapper       ${destinationData.swapper}`);

    const tx = await swapper.addDestination(chainId, destinationData);
    await logTxDetails(tx, `add destination for chain ${chainId}`);
  });
task("ccs-dest").setAction(async (_, __, runSuper) => {
  return runSuper();
});

subtask("ccs-deploy-lib", "Deploys a SelectorLib library").setAction(
  async (taskArgs, hre) => {
    const signer = await getSigner(hre);
    const chain = await getChain(hre);

    const constructorArguments = [];
    log(`About to deploy SelectorLib library on ${chain}`);
    const selectorLib = await deployContract(
      new SelectorLib__factory(signer),
      `deploy SelectorLib`,
      constructorArguments
    );

    await verifyEtherscan(hre, {
      address: selectorLib.address,
      constructorArguments,
    });
    return selectorLib;
  }
);
task("ccs-deploy-lib").setAction(async (_, __, runSuper) => {
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
    } else if (chain === Chain.BaseGoerli) {
      liquidityPools = [
        {
          sourceToken: bgMeow.address,
          destinationToken: agMeow.address,
          destinationChainId: Chain.arbitrumGoerli,
          rate: parseEther("1"),
        },
      ];
    } else if (chain === Chain.arbitrumGoerli) {
      liquidityPools = [
        {
          sourceToken: agMeow.address,
          destinationToken: bgMeow.address,
          destinationChainId: Chain.BaseGoerli,
          rate: parseEther("1"),
        },
      ];
    }

    const selectorLibAddress = await resolveName("SelectorLib", chain);
    const linkedLibraryAddresses = {
      "contracts/SelectorLib.sol:SelectorLib": selectorLibAddress,
    };

    const linkToken = await resolveAssetToken(signer, chain, "Link");
    const constructorArguments = [
      chain,
      liquidityPools,
      resolveName("CCIP_Router", chain),
      linkToken.address,
    ];
    log(`About to deploy CrossChainSwapper contract on ${chain}`);
    const crossChainSwapper = await deployContract(
      new CrossChainSwapper__factory(linkedLibraryAddresses, signer),
      `Cross Chain Swapper to ${chain}`,
      constructorArguments
    );
    // const crossChainSwapper = CrossChainSwapper__factory.connect(
    //   "0x6340B990D14Fc67bcFb4Ee3E1c8987E27fA15a23",
    //   signer
    // );

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
