<p align="center" width="100%">
    <img width="33%" src="https://raw.githubusercontent.com/dimsome/com-bridge/main/ChillCat.png"> 
</p>

# CoM Repo for ETHGlobal Istanbul 2023 Hackathon

Coincidence of Moew (CoM), a cross-chain token swap protocol with Peer-to-Peer (P2P) matching with 1:1 price ratio.

Basically like CoW-Swap, but cross-chain.

## Problem

With the omnipresence of Layer 2s and other chains, their low gas prices are a significant advantage. However, bridging assets between Layer 2s remains a costly affair. Simultaneously, funds are consistently moving in both directions.

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
- Polygon Mumbai (Polygon Testnet) <-> Avalanche Fuji (Avalanche Testnet)
-

## Protocols used

### Chainlink CCIP

The Chainlink Cross-Chain Interoperability Protocol (CCIP) is a standard for cross-chain communication. We use it to send messages between the chains to settle the swap and unlock the tokens.

It is core to our protocol and relies on the security of the Chainlink network.

### Arbitrum Testnet

The contracts are deployed on the Arbitrum Testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

Meow tokens can be bridge from Arbitrum testnet to

### Linea testnet

The contracts are deployed on the Linea testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Scroll Sepolia

The contracts are deployed on the Scroll testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Mantle testnet

The contracts are deployed on the Mantle testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Celo testnet

The contracts are deployed on the Celo testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

### Base testnet

The contracts are deployed on the Base testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

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
