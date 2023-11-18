# Cross Chain Swaps

## Installation

Clone and compile this repository:

```
git clone git@github.com:dimsome/com-bridge.git
cd packages/contracts
yarn
yarn compile
```

## Processes

Token Swap

![Cross Chain Swaps](./docs/processes.png)

## Chainlink Testnets

| Chain           | ChainId  | Link                                       | CCIP Router                                |
| --------------- | -------- | ------------------------------------------ | ------------------------------------------ |
| Avalanche Fuji  | 43113    | 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846 | 0x554472a2720e5e7d5d3c817529aba05eed5f82d8 |
| Sepolia         | 11155111 | 0x779877A7B0D9E8603169DdbD7836e478b4624789 | 0xd0daae2231e9cb96b94c8512223533293c3693bf |
| Optimism Goerli | 420      | 0xdc2CC710e42857672E7907CF474a69B63B93089f | 0xeb52e9ae4a9fb37172978642d4c141ef53876f26 |
| Arbitrum Goerli | 421613   | 0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28 | 0x88E492127709447A5ABEFdaB8788a15B4567589E |
| Polygon Mumbai  | 80001    | 0x326C977E6efc84E512bB9C30f76E30c160eD06FB | 0x70499c328e1e2a3c41108bd3730f6670a44595d1 |
| BNB Testnet     | 97       | 0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06 | 0x9527e2d01a3064ef6b50c1da1c0cc523803bcff2 |
| Base Testnet    | 84531    | 0xd886e2286fd1073df82462ea1822119600af80b6 | 0xa8c0c11bf64af62cdca6f93d3769b88bdd7cb93d |

# Contract Deployments

## TODO: Deployments

| Network               | Requirements                              | Status |
| --------------------- | ----------------------------------------- | ------ |
| Arbitrum Goerli       | Deploy and verify contracts               | TODO   |
| Polygon zkEVM Testnet | Deploy and verify contracts               | TODO   |
| Linea testnet         | Deploy and verify contracts               | TODO   |
| Celo testnet          | Deploy and verify contracts               | TODO   |
| Mantle testnet        | Deploy and verify contracts               | TODO   |
| Scroll testnet        | Deploy and verify contracts               | TODO   |
| Gnosischain testnet   | Deploy and verify contracts, nice to have | TODO   |

## Current Deployments

| Chain         | Meow Token                                                                                                                    | Cross Chain Swapper                                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Sepolia       | [0x84d7F52cAF3C4A4EAdC998FD102fD23134159495](https://sepolia.etherscan.io/address/0x84d7F52cAF3C4A4EAdC998FD102fD23134159495) | [0xbE297B899dB97A161BD24058daB8751510951BB7](https://sepolia.etherscan.io/address/0xbE297B899dB97A161BD24058daB8751510951BB7) |
| Avalance Fuji | [0xa3C235f09F1491fbc714efDAA7504089E49Df1b2](https://testnet.snowtrace.io/address/0xa3C235f09F1491fbc714efDAA7504089E49Df1b2) | [0xa47fBe44E10000F27Eb64698720AFA1bc6C50582](https://testnet.snowtrace.io/address/0xa47fBe44E10000F27Eb64698720AFA1bc6C50582) |

```sh
export PRIVATE_KEY=
export NODE_URL_SEPOLIA=
export ETHERSCAN_KEY_SEPOLIA=
export NODE_URL_FUJI=
export ETHERSCAN_KEY_FUJI=

## Sepolia

export ETHERSCAN_KEY=$ETHERSCAN_KEY_SEPOLIA
export NODE_URL=$NODE_URL_SEPOLIA

# Deploy the Meow token
yarn task token-deploy --name meow --symbol meow --decimals 18  --network sepolia
# Transfer to team
yarn task token-transfer --token meow --amount 100000  --recipient Dimitri --network sepolia
yarn task token-transfer --token meow --amount 100000  --recipient Adam --network sepolia

## Avalanche Fuji

export ETHERSCAN_KEY=$ETHERSCAN_KEY_FUJI
export NODE_URL=$NODE_URL_FUJI

# Deploy the Meow token
yarn task token-deploy --name meow --symbol meow --decimals 18  --network fuji
# Transfer to team
yarn task token-transfer --token meow --amount 100000  --recipient 0xD5fC6be6dA120227E5ACB5B6c1006A892b85BB32 --network fuji
yarn task token-transfer --token meow --amount 100000  --recipient 0x589F6Cc29e9a08db99ab6896B2Fb3BBE28245233 --network fuji

# Deploy selector library
yarn task ccs-deploy-lib --network fuji
# Deploy the CrossChainSwapper
yarn task ccs-deploy --network fuji
# Send the Swapper some Link to pay for CCIP
yarn task token-transfer --token Link --amount 3 --recipient CrossChainSwapper --network fuji

## Sepolia

export ETHERSCAN_KEY=$ETHERSCAN_KEY_SEPOLIA
export NODE_URL=$NODE_URL_SEPOLIA

# Deploy selector library
yarn task ccs-deploy-lib --network sepolia
# Deploy the CrossChainSwapper
yarn task ccs-deploy --network sepolia
# update CrossChainSwapper address in namedAddress.ts

# Send the Swapper some Link to pay for CCIP
yarn task token-transfer --token Link --amount 3 --recipient CrossChainSwapper --network sepolia
# Set the Avalanche Fuji destination details
yarn task ccs-dest --chain-id 43113 --network sepolia

# Approve the CrossChainSwapper to transfer Meow tokens
yarn task token-approve --token meow --spender CrossChainSwapper --network sepolia
# Deposit Meow tokens into the CrossChainSwapper
yarn task ccs-deposit --amount 1000 --token meow --network sepolia

## Avalanche Fuji

export ETHERSCAN_KEY=$ETHERSCAN_KEY_FUJI
export NODE_URL=$NODE_URL_FUJI

# Set the Sepolia destination details
yarn task ccs-dest --chain-id 11155111 --network fuji

# Approve the CrossChainSwapper to transfer Meow tokens
yarn task token-approve --token meow --spender CrossChainSwapper --network fuji
# Deposit Meow tokens into the CrossChainSwapper
yarn task ccs-deposit --amount 2000 --token meow --network fuji

## Sepolia

export ETHERSCAN_KEY=$ETHERSCAN_KEY_SEPOLIA
export NODE_URL=$NODE_URL_SEPOLIA

# Maker creates a swap
yarn task ccs-make-swap --amount 990 --token meow --network sepolia

## Avalanche Fuji

export ETHERSCAN_KEY=$ETHERSCAN_KEY_FUJI
export NODE_URL=$NODE_URL_FUJI

# Taker matches the swap
yarn task ccs-take-swap --amount 4 --token meow --network fuji
```

Taker side redeploy

```sh
export ETHERSCAN_KEY=$ETHERSCAN_KEY_FUJI
export NODE_URL=$NODE_URL_FUJI

yarn task ccs-deploy --network fuji
# update CrossChainSwapper address in namedAddress.ts
yarn task token-transfer --token Link --amount 3  --recipient CrossChainSwapper --network fuji
yarn task ccs-dest --chain-id 11155111 --network fuji
yarn task token-approve --token meow --spender CrossChainSwapper --network fuji
yarn task ccs-deposit --amount 2000 --token meow --network fuji
yarn task ccs-take-swap --amount 8 --token meow --network fuji

# copy tx hash and view on the Chainlink explorer https://ccip.chain.link/

# yarn task:fork ccs-take-swap --amount 8 --token meow --network fuji
```

Maker side redeploy

```sh
export ETHERSCAN_KEY=$ETHERSCAN_KEY_SEPOLIA
export NODE_URL=$NODE_URL_SEPOLIA

yarn task ccs-deploy --network sepolia
# update CrossChainSwapper address in namedAddress.ts
yarn task token-transfer --token Link --amount 3  --recipient CrossChainSwapper --network sepolia
yarn task ccs-dest --chain-id 43113 --network sepolia
yarn task token-approve --token meow --spender CrossChainSwapper --network sepolia
yarn task ccs-deposit --amount 1000 --token meow --network sepolia

export ETHERSCAN_KEY=$ETHERSCAN_KEY_FUJI
export NODE_URL=$NODE_URL_FUJI

yarn task ccs-dest --chain-id 11155111 --network fuji
yarn task ccs-take-swap --amount 7 --token meow --network fuji
```
