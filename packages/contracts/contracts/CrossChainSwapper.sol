// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";

contract CrossChainSwapper is CCIPReceiver {
    using SafeERC20 for IERC20;

    // 100% = 1e18
    uint256 constant RATE_SCALE = 1e18;
    uint64 public immutable sourceChainId;
    address public immutable linkToken;

    struct UserBalances {
        uint128 locked;
        uint128 unlocked;
    }

    struct MakerSwap {
        address maker;
        uint256 amount;
    }

    struct CCIPData {
        uint64 destinationChainSelector;
        address destinationSwapper;
    }

    struct QueueMetaData {
        uint128 next;
        uint128 last;
    }

    struct LiquidityPool {
        uint256 balance;
        mapping(uint256 => MakerSwap) makerSwapQueue;
        QueueMetaData queueData;
        LiquidityPoolData poolData;
        CCIPData ccip;
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

    constructor(
        uint64 _sourceChainId,
        LiquidityPoolData[] memory _validPools,
        address _router,
        address _linkToken
    ) CCIPReceiver(_router) {
        sourceChainId = _sourceChainId;
        linkToken = _linkToken;

        for (uint256 i; i < _validPools.length; ++i) {
            validSourceTokens[_validPools[i].sourceToken] = true;
            bytes32 poolKey = calcPoolKey(
                _validPools[i].sourceToken,
                _validPools[i].destinationToken,
                _validPools[i].destinationChainId,
                _validPools[i].rate
            );
            validPools[poolKey] = true;
            // Initialize the maker queue for each liquidity pool
            liquidityPools[poolKey].queueData.next = 1;
            liquidityPools[poolKey].poolData = _validPools[i];
        }
    }

    event MakeSwap(
        address indexed token,
        uint64 indexed destinationChainId,
        uint256 poolBalance
    );
    event TakeSwap(
        bytes32 indexed messageId,
        bytes32 indexed destinationPoolKey
    );
    event MakerSwaps(
        bytes32 indexed messageId,
        bytes32 indexed destinationPoolKey,
        MakerSwap[] filledMakerSwaps
    );

    function deposit(address token, uint256 amount) external {
        // Check the token is valid
        if (!validSourceTokens[token]) revert InvalidToken();
        if (amount == 0 || amount > type(uint128).max) revert InvalidAmount();

        // Transfer the token from the user to this Swapper contract
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        userBalances[msg.sender][token].unlocked += uint128(amount);
    }

    function withdraw(address token, uint256 amount) external {
        // Check the token is valid
        if (!validSourceTokens[token]) revert InvalidToken();
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
        uint128 lastQueueItem = uint128(liquidityPool.queueData.last + 1);
        liquidityPool.makerSwapQueue[lastQueueItem] = MakerSwap(
            msg.sender,
            amount
        );
        liquidityPool.queueData.last = lastQueueItem;

        // emit event to be picked up by a market taker
        emit MakeSwap(sourceToken, destinationChainId, liquidityPool.balance);
    }

    function cancelSwap(
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

        // Check the maker has enough locked tokens
        UserBalances memory userBalance = userBalances[msg.sender][sourceToken];
        if (userBalance.locked >= amount) revert NotEnoughLockedTokens();

        // unlock maker's tokens so they can't be withdrawn or transferred
        userBalances[msg.sender][sourceToken] = UserBalances(
            uint128(userBalance.locked - amount),
            uint128(userBalance.unlocked + amount)
        );

        // TODO loop through the maker queue and remove/update the maker swaps
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

        bytes32 destinationPoolKey = calcPoolKey(
            destinationToken,
            sourceToken,
            sourceChainId,
            // Need to invert the rate
            RATE_SCALE / rate
        );
        uint256 destinationAmount = (amount * RATE_SCALE) / rate;
        // TODO check no in-progress settlement with destination liquidity pool

        LiquidityPool storage sourceLiquidityPool = liquidityPools[poolKey];
        _sendTakeSwapMessage(
            sourceLiquidityPool,
            destinationPoolKey,
            destinationAmount
        );
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

        // Calc how many maker swap are in the queue for the liquidity pool
        QueueMetaData memory queueData = liquidityPool.queueData;
        uint256 makerQueueLength = queueData.last + 1 - queueData.next;
        // calculate list of maker swaps that are partially or fully filled
        MakerSwap[] memory allMakerSwaps = new MakerSwap[](makerQueueLength);
        uint256 filledMakerSwapsLength = 0;
        uint256 remainingAmount = takerAmount;
        for (uint256 i; i < makerQueueLength; ++i) {
            // Get the next maker swap from the queue
            MakerSwap memory makerSwap = liquidityPool.makerSwapQueue[
                queueData.next
            ];
            if (remainingAmount >= makerSwap.amount) {
                // Fully filled

                // Pop the makers swap from the queue
                liquidityPool.queueData.next++;
                // Reduce the remaining amount to be settled
                remainingAmount -= makerSwap.amount;

                allMakerSwaps[i] = makerSwap;
            } else {
                // Partially filled

                // update maker's amount in the queue
                liquidityPool.makerSwapQueue[queueData.next].amount =
                    makerSwap.amount -
                    remainingAmount;

                allMakerSwaps[i] = MakerSwap(makerSwap.maker, remainingAmount);

                // TODO truncate the filled maker queue
                break;
            }
            filledMakerSwapsLength++;
        }

        MakerSwap[] memory filledMakerSwaps = new MakerSwap[](makerQueueLength);
        for (uint256 i; i < filledMakerSwapsLength; ++i) {
            filledMakerSwaps[i] = allMakerSwaps[i];
        }
        bytes memory message = abi.encode(filledMakerSwaps);
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

        QueueMetaData memory queueData = liquidityPool.queueData;
        uint256 makerQueueLength = queueData.last + 1 - queueData.next;
        makerSwaps_ = new MakerSwap[](makerQueueLength);
        for (uint256 i; i < makerQueueLength; ++i) {
            makerSwaps_[i] = liquidityPool.makerSwapQueue[queueData.next + i];
        }
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

    function _sendTakeSwapMessage(
        LiquidityPool storage sourceLiquidityPool,
        bytes32 destinationPoolKey,
        uint256 destinationAmount
    ) internal {
        // send settle message via CCIP to destination chain
        bytes memory messageData = abi.encodePacked(
            true,
            destinationPoolKey,
            destinationAmount
        );

        CCIPData memory ccipData = sourceLiquidityPool.ccip;
        Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(ccipData.destinationSwapper),
            data: messageData,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 500_000, strict: false})
            ),
            feeToken: address(linkToken)
        });

        // Get the fee required to send the message
        uint256 fees = IRouterClient(i_router).getFee(
            ccipData.destinationChainSelector,
            ccipMessage
        );

        uint256 linkBalance = IERC20(linkToken).balanceOf(address(this));
        if (fees > linkBalance) revert NotEnoughLink(linkBalance, fees);

        // Send the message through the router and store the returned message ID
        bytes32 messageId = IRouterClient(i_router).ccipSend(
            ccipData.destinationChainSelector,
            ccipMessage
        );

        emit TakeSwap(messageId, destinationPoolKey);
    }

    function _sendMakerSwapsMessage(
        LiquidityPool storage sourceLiquidityPool,
        bytes32 destinationPoolKey,
        MakerSwap[] memory filledMakerSwaps
    ) internal {
        // send filled maker swaps via CCIP to destination chain
        bytes memory messageData = abi.encode(
            false,
            destinationPoolKey,
            filledMakerSwaps
        );

        CCIPData memory ccipData = sourceLiquidityPool.ccip;
        Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(ccipData.destinationSwapper),
            data: messageData,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 500_000, strict: false})
            ),
            feeToken: address(linkToken)
        });

        // Get the fee required to send the message
        uint256 fees = IRouterClient(i_router).getFee(
            ccipData.destinationChainSelector,
            ccipMessage
        );

        uint256 linkBalance = IERC20(linkToken).balanceOf(address(this));
        if (fees > linkBalance) revert NotEnoughLink(linkBalance, fees);

        // Send the message through the router and store the returned message ID
        bytes32 messageId = IRouterClient(i_router).ccipSend(
            ccipData.destinationChainSelector,
            ccipMessage
        );

        emit MakerSwaps(messageId, destinationPoolKey, filledMakerSwaps);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        message.data;
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
