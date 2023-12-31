import { constants } from "ethers";
import { formatUnits, parseUnits } from "ethers/lib/utils";
import { subtask, task, types } from "hardhat/config";

import { ERC20__factory, MockERC20__factory } from "../types/typechain";
import { getBlock } from "../utils/blocks";
import { verifyEtherscan } from "../utils/etherscan";
import { logger } from "../utils/logger";
import { getChain } from "../utils/network";
import { resolveAddress, resolveAssetToken } from "../utils/resolvers";
import { getSigner } from "../utils/signer";
import { deployContract, logTxDetails } from "../utils/transaction";

const log = logger("task:token");

subtask(
  "token-approve",
  "Approve address or contract to spend (transferFrom) an amount of tokens from the signer's account"
)
  .addParam(
    "token",
    "Token symbol or address. eg mUSD, MTA, BUSD, 3Crv, mvDAI-3PCV or vcx3CRV-FRAX",
    undefined,
    types.string
  )
  .addParam(
    "spender",
    "Address or contract name that will send the transferFrom transaction.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "amount",
    "Amount to approve. Default is max unit128",
    undefined,
    types.float
  )
  .addOptionalParam(
    "speed",
    "Defender Relayer speed param: 'safeLow' | 'average' | 'fast' | 'fastest'",
    "fast",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const { token, spender, amount } = taskArgs;

    const chain = getChain(hre);
    const signer = await getSigner(hre, taskArgs.speed);
    const signerAddress = await signer.getAddress();

    const tokenConfig = await resolveAssetToken(signer, chain, token);
    const tokenContract = ERC20__factory.connect(tokenConfig.address, signer);

    const spenderAddress = resolveAddress(spender, chain);
    const amountBN = Number.isInteger(amount)
      ? parseUnits(amount.toString(), tokenConfig.decimals)
      : constants.MaxUint256;

    const tx = await tokenContract.approve(spenderAddress, amountBN);
    await logTxDetails(
      tx,
      `${signerAddress} approves ${spenderAddress} to transfer ${formatUnits(
        amountBN,
        tokenConfig.decimals
      )} ${tokenConfig.symbol}`
    );
  });
task("token-approve").setAction(async (_, __, runSuper) => {
  await runSuper();
});

subtask(
  "token-transfer",
  "Transfer an amount of tokens from the signer to the recipient"
)
  .addParam(
    "token",
    "Token symbol or address. eg mUSD, MTA, BUSD, 3Crv, mvDAI-3PCV or vcx3CRV-FRAX",
    undefined,
    types.string
  )
  .addParam(
    "recipient",
    "Address or contract name the tokens will be sent to.",
    undefined,
    types.string
  )
  .addParam(
    "amount",
    "Amount to of token to be sent without the token decimals.",
    undefined,
    types.float
  )
  .addOptionalParam(
    "speed",
    "Defender Relayer speed param: 'safeLow' | 'average' | 'fast' | 'fastest'",
    "fast",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const { speed, recipient, amount, token } = taskArgs;
    const chain = getChain(hre);
    const signer = await getSigner(hre, speed);
    const signerAddress = await signer.getAddress();

    const tokenConfig = await resolveAssetToken(signer, chain, token);
    const tokenContract = ERC20__factory.connect(tokenConfig.address, signer);

    const recipientAddress = resolveAddress(recipient, chain);
    const amountBN = parseUnits(amount.toString(), tokenConfig.decimals);

    const desc = `${signerAddress} transfers ${formatUnits(
      amountBN,
      tokenConfig.decimals
    )} ${tokenConfig.symbol} to ${recipientAddress}`;
    log(`About to send tx ${desc}`);

    const tx = await tokenContract.transfer(recipientAddress, amountBN);

    await logTxDetails(tx, desc);
  });
task("token-transfer").setAction(async (_, __, runSuper) => {
  await runSuper();
});

subtask(
  "token-transfer-from",
  "Transfer an amount of tokens from the sender to the recipient"
)
  .addParam(
    "token",
    "Token symbol or address. eg mUSD, MTA, BUSD, 3Crv, mvDAI-3PCV or vcx3CRV-FRAX",
    undefined,
    types.string
  )
  .addParam(
    "sender",
    "Address or contract name the tokens will be sent from.",
    undefined,
    types.string
  )
  .addParam(
    "recipient",
    "Address or contract name the tokens will be sent to.",
    undefined,
    types.string
  )
  .addParam(
    "amount",
    "Amount to of token to be sent without the token decimals.",
    undefined,
    types.float
  )
  .addOptionalParam(
    "speed",
    "Defender Relayer speed param: 'safeLow' | 'average' | 'fast' | 'fastest'",
    "fast",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const { speed, sender, recipient, amount, token } = taskArgs;
    const chain = getChain(hre);
    const signer = await getSigner(hre, speed);
    const signerAddress = await signer.getAddress();

    const tokenConfig = await resolveAssetToken(signer, chain, token);
    const tokenContract = ERC20__factory.connect(tokenConfig.address, signer);

    const senderAddress = resolveAddress(sender, chain);
    const recipientAddress = resolveAddress(recipient, chain);
    const amountBN = parseUnits(amount, tokenConfig.decimals);

    const tx = await tokenContract.transferFrom(
      senderAddress,
      recipientAddress,
      amountBN
    );

    await logTxDetails(
      tx,
      `${signerAddress} transfers ${formatUnits(
        amountBN,
        tokenConfig.decimals
      )} ${tokenConfig.symbol} from ${senderAddress} to ${recipientAddress}`
    );
  });
task("token-transfer-from").setAction(async (_, __, runSuper) => {
  await runSuper();
});

subtask(
  "token-allowance",
  "Logs the amount of tokens a spender can transfer from an owner"
)
  .addParam(
    "token",
    "Token symbol or address. eg mUSD, MTA, BUSD, 3Crv, mvDAI-3PCV or vcx3CRV-FRAX",
    undefined,
    types.string
  )
  .addParam(
    "spender",
    "Address or contract name that can transferFrom.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "owner",
    "Address or contract name where the tokens are held.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "block",
    "Block number. (default: current block)",
    0,
    types.int
  )
  .setAction(async (taskArgs, hre) => {
    const { block, owner, spender, token } = taskArgs;
    const chain = getChain(hre);
    const signer = await getSigner(hre);

    const blk = await getBlock(hre.ethers, block);

    const tokenConfig = await resolveAssetToken(signer, chain, token);
    const tokenContract = ERC20__factory.connect(tokenConfig.address, signer);

    const ownerAddress = owner
      ? resolveAddress(owner, chain)
      : await signer.getAddress();
    const spenderAddress = resolveAddress(spender, chain);

    const amount = await tokenContract.allowance(ownerAddress, spenderAddress, {
      blockTag: blk.blockNumber,
    });

    log(
      `Spender ${spenderAddress} can transfer ${formatUnits(
        amount,
        tokenConfig.decimals
      )} ${tokenConfig.symbol} from ${ownerAddress}`
    );
  });
task("token-allowance").setAction(async (_, __, runSuper) => {
  await runSuper();
});

subtask("token-balance", "Logs the token balance of an owner")
  .addParam(
    "token",
    "Token symbol or address. eg mUSD, MTA, BUSD, 3Crv, mvDAI-3PCV or vcx3CRV-FRAX",
    undefined,
    types.string
  )
  .addOptionalParam(
    "owner",
    "Address or contract name where the tokens are held.",
    undefined,
    types.string
  )
  .addOptionalParam(
    "block",
    "Block number. (default: current block)",
    0,
    types.int
  )
  .setAction(async (taskArgs, hre) => {
    const { block, owner, token } = taskArgs;
    const chain = getChain(hre);
    const signer = await getSigner(hre);

    const blk = await getBlock(hre.ethers, block);

    const tokenConfig = await resolveAssetToken(signer, chain, token);
    const tokenContract = ERC20__factory.connect(tokenConfig.address, signer);

    const ownerAddress = owner
      ? resolveAddress(owner, chain)
      : await signer.getAddress();

    const amount = await tokenContract.balanceOf(ownerAddress, {
      blockTag: blk.blockNumber,
    });

    log(
      `Balance of ${ownerAddress} is ${formatUnits(
        amount,
        tokenConfig.decimals
      )} ${tokenConfig.symbol}`
    );
  });
task("token-balance").setAction(async (_, __, runSuper) => {
  await runSuper();
});

subtask("token-snap", "Logs the token balance of an owner")
  .addParam(
    "token",
    "Token symbol or address. eg mUSD, MTA, BUSD, 3Crv, mvDAI-3PCV or vcx3CRV-FRAX",
    undefined,
    types.string
  )
  .addOptionalParam(
    "block",
    "Block number. (default: current block)",
    0,
    types.int
  )
  .setAction(async (taskArgs, hre) => {
    const { block, token } = taskArgs;
    const chain = getChain(hre);
    const signer = await getSigner(hre);

    const blk = await getBlock(hre.ethers, block);

    const tokenConfig = await resolveAssetToken(signer, chain, token);
    const tokenContract = ERC20__factory.connect(tokenConfig.address, signer);

    log(`Symbol      : ${tokenConfig.symbol}`);
    log(`Name        : ${await tokenContract.name()}`);
    log(`Decimals    : ${tokenConfig.decimals}`);
    log(
      `Total Supply: ${formatUnits(
        await tokenContract.totalSupply({
          blockTag: blk.blockNumber,
        }),
        tokenConfig.decimals
      )}`
    );
  });
task("token-snap").setAction(async (_, __, runSuper) => {
  await runSuper();
});

subtask("token-deploy", "Deploys a new mock ERC20 token")
  .addParam("name", "Token name", undefined, types.string)
  .addParam("symbol", "Token symbol", undefined, types.string)
  .addOptionalParam("decimals", "Token decimal places", 18, types.int)
  .addOptionalParam(
    "recipient",
    "Initial mint recipient",
    undefined,
    types.string
  )
  .addOptionalParam("supply", "Initial mint amount", 1000000, types.int)
  .addOptionalParam(
    "speed",
    "Defender Relayer speed param: 'safeLow' | 'average' | 'fast' | 'fastest'",
    "fast",
    types.string
  )
  .setAction(async (taskArgs, hre) => {
    const { speed, name, symbol, decimals, supply } = taskArgs;
    const signer = await getSigner(hre, speed);

    const initialSupply = parseUnits(supply.toString(), decimals);
    const constructorArguments = [name, symbol, decimals, initialSupply];
    const token = await deployContract(
      new MockERC20__factory(signer),
      `Token ${name} (${symbol})`,
      constructorArguments
    );

    await verifyEtherscan(hre, {
      address: token.address,
      constructorArguments,
    });
    return token;
  });
task("token-deploy").setAction(async (_, __, runSuper) => {
  return runSuper();
});

module.exports = {};
