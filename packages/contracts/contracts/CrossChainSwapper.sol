// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract CrossChainSwapper {
    using SafeERC20 for IERC20;

    uint64 public immutable sourceChainId;

    struct UserBalances {
        uint128 locked;
        uint128 unlocked;
    }

    struct MakerSwap {
        address maker;
        uint256 amount;
    }

    struct LiquidityPool {
        uint256 balance;
    }

    struct LiquidityPoolData {
        address sourceToken;
        address destinationToken;
        uint64 destinationChainId;
        // The source to destination token exchange rate scaled to 1e18
        uint128 rate;
    }

    // User's locked and unlocked token balances
    // User => Token => Balances(locked, unlocked)
    mapping(address => mapping(address => UserBalances)) public userBalances;

    // Liquidity pools
    // Pool key (Source Token, Destination Token, Destination Chain Id, rate)
    //   => LiquidityPool(balance, makerQueue, next, last)
    mapping(bytes32 => LiquidityPool) public liquidityPools;

    // Valid source tokens. ie tokens supported on the chain this contract is deployed to.
    mapping(address => bool) public validSourceTokens;
    // Valid liquidity pools
    mapping(bytes32 => bool) public validPools;

    constructor(uint64 _sourceChainId, LiquidityPoolData[] memory _validPools) {
        sourceChainId = _sourceChainId;

        for (uint256 i; i < _validPools.length; ++i) {
            validSourceTokens[_validPools[i].sourceToken] = true;
            bytes32 poolKey = calcPoolKey(
                _validPools[i].sourceToken,
                _validPools[i].destinationToken,
                _validPools[i].destinationChainId,
                _validPools[i].rate
            );
            validPools[poolKey] = true;
        }
    }

    function deposit(address token, uint256 amount) external {
        // Check the token is valid
        if (validSourceTokens[token]) revert InvalidToken();
        if (amount == 0 || amount > type(uint128).max) revert InvalidAmount();

        // Transfer the token from the user to this Swapper contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        userBalances[msg.sender][token].unlocked += uint128(amount);
    }

    function withdraw(address token, uint256 amount) external {
        // Check the token is valid
        if (validSourceTokens[token]) revert InvalidToken();
        if (amount == 0 || amount >= type(uint128).max) revert InvalidAmount();
        if (amount > userBalances[msg.sender][token].unlocked)
            revert NotEnoughUnlockedTokens();

        userBalances[msg.sender][token].unlocked -= uint128(amount);

        // Transfer the token from the user to this Swapper contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
    }

    function makeSwap(
        address sourceToken,
        address destinationToken,
        uint64 destinationChainId,
        uint256 rate,
        uint256 amount
    ) external {
        bytes32 poolKey = calcPoolKey(
            sourceToken,
            destinationToken,
            destinationChainId,
            rate
        );
        // Check the poolId is valid
        if (validPools[poolKey]) revert InvalidPool();

        // Check the maker has enough unlocked tokens
        UserBalances memory userBalance = userBalances[msg.sender][sourceToken];
        if (userBalance.unlocked >= amount) revert NotEnoughUnlockedTokens();

        // lock maker's tokens so they can't be withdrawn or transferred
        userBalances[msg.sender][sourceToken] = UserBalances(
            uint128(userBalance.locked + amount),
            uint128(userBalance.unlocked - amount)
        );

        // add swap to the liquidity pool
        LiquidityPool storage liquidityPool = liquidityPools[poolKey];
        liquidityPool.balance += amount;
    }

    function takeSwap(
        address sourceToken,
        address destinationToken,
        uint64 destinationChainId,
        uint256 rate,
        uint256 amount
    ) external {
        // Check the taker has enough unlocked tokens
        UserBalances memory userBalance = userBalances[msg.sender][sourceToken];
        if (userBalance.unlocked >= amount) revert NotEnoughUnlockedTokens();

        // Check the liquidity pool is valid
        bytes32 poolKey = calcPoolKey(
            sourceToken,
            destinationToken,
            destinationChainId,
            rate
        );
        if (validPools[poolKey]) revert InvalidPool();

        // lock taker's tokens so they can't be withdrawn
        userBalances[msg.sender][sourceToken] = UserBalances(
            uint128(userBalance.locked + amount),
            uint128(userBalance.unlocked - amount)
        );

        LiquidityPool storage sourceLiquidityPool = liquidityPools[poolKey];
    }

    function _settleMaker(bytes32 poolKey, uint256 takerAmount) internal {
        // Check the poolId is valid
        if (validPools[poolKey]) revert InvalidPool();

        // check there is still enough pool liquidity
        LiquidityPool storage liquidityPool = liquidityPools[poolKey];
        if (liquidityPool.balance < takerAmount)
            revert NotEnoughPoolLiquidity();

        // remove liquidity from the pool
        liquidityPool.balance -= takerAmount;
    }

    function _settleTaker(
        address sourceToken,
        address destinationToken,
        uint64 destinationChainId,
        uint256 rate,
        uint256 amount
    ) internal {
        // check there is enough pool liquidity
        bytes32 poolKey = calcPoolKey(
            sourceToken,
            destinationToken,
            destinationChainId,
            rate
        );
        LiquidityPool storage liquidityPool = liquidityPools[poolKey];
        if (liquidityPool.balance >= amount) revert NotEnoughPoolLiquidity();

        // remove liquidity from the pool
        liquidityPool.balance -= amount;
    }

    function makerSwaps(
        bytes32 poolKey
    ) external view returns (MakerSwap[] memory makerSwaps_) {
        // add swap to the liquidity pool
        LiquidityPool storage liquidityPool = liquidityPools[poolKey];
    }

    function calcPoolKey(
        address sourceToken,
        address destinationToken,
        uint64 destinationChainId,
        uint256 rate
    ) internal pure returns (bytes32 poolKey) {
        poolKey = keccak256(
            abi.encode(sourceToken, destinationToken, destinationChainId, rate)
        );
    }

    error NotSwapperToken();
    error NotEnoughUnlockedTokens();
    error NotEnoughLockedTokens();
    error NotEnoughPoolLiquidity();
    error InvalidToken();
    error InvalidPool();
    error InvalidAmount();
    error NotEnoughLink(uint256 balance, uint256 fees);
}
