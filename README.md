<p align="center" width="100%">
    <img width="33%" src="https://raw.githubusercontent.com/dimsome/com-bridge/main/ChillCat.png"> 
</p>

# Coincidence of Moew (CoM) Repo

> for ETHGlobal Istanbul 2023 Hackathon

Coincidence of Moew (CoM), a cross-chain token swap protocol in a Peer-to-Peer (P2P) matching flow and with 1:1 price ratio.

Basically like CoW-Swap, but for cross-chain bridging.

## Problem

With the omnipresence of Layer 2s and other chains, their low gas prices are a significant advantage. However, bridging assets between Layer 2s remains a costly affair. Simultaneously, funds are consistently moving in both directions and yet are using a third party pool or liquidity provider.

Why not explore this opportunity for a better matching flow?

## Solution

Our project aims to streamline this process by pairing users intending to bridge in opposite directions, settling transactions efficiently. Instead of bridging tokens, we match and execute orders when an opposing order is found. This innovative approach reduces costs, enhances the efficiency of cross-chain transactions and allows to bridge tokens almost with a 1:1 price ratio.

## How it works

- **Want A:** Alice has 1000 Meow tokens on Chain A, and wants to swap them for 1000 Meow tokens on Chain B.
- **Want B:** Bob has 1000 Meow tokens on Chain B, and wants to swap them for 1000 Meow tokens on Chain A.

Here's how they use the CoM protocol to swap their tokens:

1. Alice deposits her tokens on Chain A and creates the order (Maker).
2. Bob wants to go the other way and can match the order (Taker).
3. Bob deposits his tokens on Chain B, initiating the swap.
4. The settlement is triggered, the tokens are locked, a cross-chain message is sent to the other chain, which unlocks the tokens on the other chain and a message is sent back to the original chain to unlock the tokens there.

Simple, right? No pool or liquidity provider, just a simple P2P swap.

## Supported lanes

TODO: Add all the lanes we support

Support is limited to the chains that support the Chainlink CCIP protocol. Currently, the following lanes are supported:

- Sepolia (Ethereum Testnet) <-> Avalanche Fuji (Avalanche Testnet)
- Base Goerli Testnet <-> Arbitrum Goerli Testnet

## Protocols used

### Chainlink CCIP

The Chainlink Cross-Chain Interoperability Protocol (CCIP) is a standard for cross-chain communication. We use it to send messages between the chains to settle the swap and unlock the tokens.

It is core to our protocol and relies on the security of the Chainlink network.

### Arbitrum

The contracts are deployed on the **Arbitrum Goerli** Testnet with the following addresses:

- Meow Token: [0x75281fFc939bc0D013964954959793f760342B11](https://goerli.arbiscan.io/address/0x75281fFc939bc0D013964954959793f760342B11)
- CrossChainSwapper: [0x710567b664632b643555947c55498c2fceB4110B](https://goerli.arbiscan.io/address/0x710567b664632b643555947c55498c2fceB4110B)

Meow tokens can be bridge from Arbitrum testnet to

### Polygon

The contracts are deployed on the **Polygon Mumbai** Testnet with the following addresses:

- Meow Token: [0x75281fFc939bc0D013964954959793f760342B11](https://mumbai.polygonscan.com/address/0x75281fFc939bc0D013964954959793f760342B11)
- CrossChainSwapper: [0x49Bc3d55c3774aBb1210cA72bFCd6dCcA466f31f](https://mumbai.polygonscan.com/address/0x49Bc3d55c3774aBb1210cA72bFCd6dCcA466f31f)

Meow tokens can be bridge from Arbitrum testnet to

Additionally, contracts are deployed on **Polygon zkEVM Testnet** with the following addresses:

- Meow Token:
- CrossChainSwapper: [0x04a05bE01C94d576B3eA3e824aF52668BAC606c0](https://testnet-zkevm.polygonscan.com/address/0x04a05be01c94d576b3ea3e824af52668bac606c0)

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Linea

The contracts are deployed on the **Linea Testnet** with the following addresses:

- Meow Token:
- CrossChainSwapper: rpc error with payload

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Scroll

The contracts are deployed on the **Scroll Sepolia Testnet** with the following addresses:

- Meow Token: [0x75281fFc939bc0D013964954959793f760342B11](https://sepolia.scrollscan.dev/address/0x75281fFc939bc0D013964954959793f760342B11)
- CrossChainSwapper:[0x8e2587265c68cd9ee3ecbf22dc229980b47cb960](https://sepolia.scrollscan.dev/address/0x8e2587265c68cd9ee3ecbf22dc229980b47cb960#code)

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Mantle

The contracts are deployed on the **Mantle Testnet** with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the mosment, only base contracts deployed because of missing crosschain messaging protocol)

### Celo

The contracts are deployed on the **Celo Alfajores Testnet** with the following addresses:

- Meow Token: [0x75281fFc939bc0D013964954959793f760342B11](https://alfajores.celoscan.io/address/0x75281fFc939bc0D013964954959793f760342B11)
- CrossChainSwapper: []()

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Base

The contracts are deployed on the **Base Testnet** with the following addresses:

- Meow Token:
- CrossChainSwapper: 

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Full list of deployed contracts

[Here is a list of all the contracts that are deployed.](./packages/contracts/README.md)

### CoW-Swap (Honorable mention)

While we don't use CoW-Swap directly, we are inspired by their approach of Coincidence of intents and use a similar approach to match orders. Isn't it a purrrfect extension of their idea?

## How to use it

Run the front end app locally:

```sh
yarn install
```

```sh
yarn run start:app
```

## Project Structure

This repo uses yarn workspaces to manage the different packages.

- `packages/contracts` - The Solidity contracts and hardhat deployment environment
- `packages/app` - The frontend app using next.js
- `packages/graph` - The subgraph for indexing the events from the contracts (WIP, not ready for the hackathon)
