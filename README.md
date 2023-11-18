![ChillCat](./ChillCat.png)

# CoM Repo for ETHGlobal Istanbul 2023 Hackathon

Coincidence of Moew (CoM), a cross-chain token swap protocol with Peer-to-Peer (P2P) matching with 1:1 price ratio.

Basically like CoW-Swap, but cross-chain.

## Problem

With the omnipresence of Layer 2s and other chains, their low gas prices are a significant advantage. However, bridging assets between Layer 2s remains a costly affair. Simultaneously, funds are consistently moving in both directions.

## Solution

Our project aims to streamline this process by pairing users intending to bridge in opposite directions, settling transactions efficiently. Instead of bridging tokens, we match and execute orders when an opposing order is found. This innovative approach reduces costs, enhances the efficiency of cross-chain transactions and allows to bridge tokens almost with a 1:1 price ratio.

## How it works

Alice has 1000 Meow tokens on Chain A, and wants to swap them for 1000 Meow tokens on Chain B.
Bob has 1000 Meow tokens on Chain B, and wants to swap them for 1000 Meow tokens on Chain A.

They both use the CoM protocol to swap their tokens, Alice deposits the tokens and creates the order (Maker), Bob matches the order (Taker) and initiates the swap. So Bob deposits the tokens and starts the settlement, the tokens are locked and a cross-chain message is sent to the other chain. Which unlocks the token and a message is sent back to the original chain to unlock the tokens there.

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

## Scroll Sepolia

The contracts are deployed on the Scroll testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

## Mantle testnet

The contracts are deployed on the Mantle testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

## Celo testnet

The contracts are deployed on the Celo testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

## Base testnet

The contracts are deployed on the Base testnet with the following addresses:

- Meow Token:
- CrossChainSwapper:

(Bridging not possible at the moment, only base contracts deployed because of missing crosschain messaging protocol)

## How to use it

## Project Structure

This repo uses yarn workspaces to manage the different packages.

- `packages/contracts` - The Solidity contracts and hardhat deployment environment
- `packages/app` - The frontend app using next.js
- `packages/graph` - The subgraph for indexing the events from the contracts (WIP, not ready for the hackathon)
