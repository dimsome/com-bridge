// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";

import {SelectorLib} from "./SelectorLib.sol";

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

    struct DestinationData {
        uint64 ccipChainSelector;
        address swapper;
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
    //   => LiquidityPool(balance, makerSwapQueue, queueData, poolData)
    mapping(bytes32 => LiquidityPool) public liquidityPools;
    // Chain identifier => DestinationData(ccipChainSelector,swapper)
    mapping(uint256 => DestinationData) public destinations;

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
            _addLiquidityPool(_validPools[i]);
        }

        IERC20(_linkToken).approve(_router, type(uint256).max);
    }

    event MakeSwap(bytes32 poolKey, uint256 poolBalance);
    event TakeSwap(
        bytes32 indexed messageId,
        bytes32 indexed destinationPoolKey
    );
    event MakerSwaps(
        bytes32 indexed messageId,
        bytes32 indexed destinationPoolKey,
        MakerSwap[] filledMakerSwaps
    );
    event ReceiverCCIPMessage(bytes4 selector, bytes payload);
    event SendingCCIPMessage(bytes payload);

    /***************************************
                Deposit/Withdraw
    ****************************************/

    function deposit(address token, uint256 amount) external {
        _deposit(token, amount);
    }

    function _deposit(address token, uint256 amount) internal {
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

    /***************************************
                    Swaps
    ****************************************/

    function makeSwap(
        address sourceToken,
        address destinationToken,
        uint64 destinationChainId,
        uint256 rate,
        uint256 amount
    ) external {
        // Adding this step here to make it easier to demo
        _deposit(sourceToken, amount);

        bytes32 poolKey = calcPoolKey(
            sourceToken,
            destinationToken,
            destinationChainId,
            rate
        );
        // Check the poolId is valid
        if (!validPools[poolKey]) revert InvalidPool();
        // Check the maker has enough unlocked tokens
        UserBalances memory userBalance = userBalances[msg.sender][sourceToken];
        if (userBalance.unlocked < amount) revert NotEnoughUnlockedTokens();
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
        emit MakeSwap(poolKey, liquidityPool.balance);
    }

    function cancelSwap(bytes32 poolKey, uint256 amount) external {
        // Check the poolId is valid
        if (!validPools[poolKey]) revert InvalidPool();
        LiquidityPoolData memory liquidityPool = liquidityPools[poolKey]
            .poolData;
        // Check the maker has enough locked tokens
        UserBalances memory userBalance = userBalances[msg.sender][
            liquidityPool.sourceToken
        ];
        if (userBalance.locked < amount) revert NotEnoughLockedTokens();
        // unlock maker's tokens so they can't be withdrawn or transferred
        userBalances[msg.sender][liquidityPool.sourceToken] = UserBalances(
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
        // Adding this step here to make it easier to demo
        _deposit(sourceToken, amount);

        // Check the taker has enough unlocked tokens
        UserBalances memory userBalance = userBalances[msg.sender][sourceToken];
        if (userBalance.unlocked < amount) revert NotEnoughUnlockedTokens();
        bytes32 poolKey = calcPoolKey(
            sourceToken,
            destinationToken,
            destinationChainId,
            rate
        );
        // Check the liquidity pool is valid
        if (!validPools[poolKey]) revert InvalidPool();
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
            (RATE_SCALE * RATE_SCALE) / rate
        );
        uint256 destinationAmount = (amount * RATE_SCALE) / rate;
        // TODO check no in-progress settlement with destination liquidity pool
        LiquidityPool storage sourceLiquidityPool = liquidityPools[poolKey];
        _sendTakeSwapViaCCIP(
            sourceLiquidityPool,
            destinationPoolKey,
            destinationAmount
        );
    }

    /***************************************
                    Settle
    ****************************************/

    function _settleMaker(bytes32 poolKey, uint256 takerAmount) internal {
        // Check the poolId is valid
        if (!validPools[poolKey]) revert InvalidPool();

        LiquidityPool storage liquidityPool = liquidityPools[poolKey];
        // Check there is still enough pool liquidity
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
        _sendMakerSwapsViaCCIP(poolKey, takerAmount, filledMakerSwaps);
    }

    function _settleTaker(
        bytes32 poolKey,
        uint256 amount,
        MakerSwap[] memory swaps
    ) internal {
        LiquidityPool storage liquidityPool = liquidityPools[poolKey];
        // check there is enough pool liquidity
        if (liquidityPool.balance < amount) revert NotEnoughPoolLiquidity();

        // remove liquidity from the pool
        liquidityPool.balance -= amount;

        // TODO for each maker swaps
        //
    }

    function calcPoolKey(
        address sourceToken,
        address destinationToken,
        uint64 destinationChainId,
        uint256 rate
    ) public pure returns (bytes32 poolKey) {
        poolKey = keccak256(
            abi.encode(sourceToken, destinationToken, destinationChainId, rate)
        );
    }

    /***************************************
                View Functions
    ****************************************/

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

    /***************************************
                Admin Functions
    ****************************************/

    // TODO protect by admin role
    function addLiquidityPool(LiquidityPoolData memory _pool) external {
        _addLiquidityPool(_pool);
    }

    function _addLiquidityPool(LiquidityPoolData memory _pool) internal {
        validSourceTokens[_pool.sourceToken] = true;

        bytes32 poolKey = calcPoolKey(
            _pool.sourceToken,
            _pool.destinationToken,
            _pool.destinationChainId,
            _pool.rate
        );
        validPools[poolKey] = true;

        // Initialize the maker queue for each liquidity pool
        liquidityPools[poolKey].queueData.next = 1;
        liquidityPools[poolKey].poolData = _pool;
    }

    // TODO protect by admin role
    function addDestination(
        uint256 chainId,
        DestinationData memory _destination
    ) external {
        destinations[chainId] = _destination;
    }

    /***************************************
                Chainlink CCIP
    ****************************************/

    function _sendTakeSwapViaCCIP(
        LiquidityPool storage sourceLiquidityPool,
        bytes32 destinationPoolKey,
        uint256 destinationAmount
    ) internal {
        // send settle message via CCIP to destination chain
        bytes memory messageData = abi.encodeWithSignature(
            "take(bytes32,uint256)",
            destinationPoolKey,
            destinationAmount
        );

        DestinationData memory destination = destinations[
            sourceLiquidityPool.poolData.destinationChainId
        ];

        Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(destination.swapper),
            data: messageData,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 1_000_000, strict: false})
            ),
            feeToken: address(linkToken)
        });

        // Get the fee required to send the message
        uint256 fees = IRouterClient(i_router).getFee(
            destination.ccipChainSelector,
            ccipMessage
        );

        uint256 linkBalance = IERC20(linkToken).balanceOf(address(this));
        if (fees > linkBalance) revert NotEnoughLink(linkBalance, fees);

        // Send the message through the router and store the returned message ID
        bytes32 messageId = IRouterClient(i_router).ccipSend(
            destination.ccipChainSelector,
            ccipMessage
        );

        emit TakeSwap(messageId, destinationPoolKey);
    }

    function _sendMakerSwapsViaCCIP(
        bytes32 destinationPoolKey,
        uint256 takerAmount,
        MakerSwap[] memory filledMakerSwaps
    ) internal {
        // send filled maker swaps via CCIP to destination chain
        bytes memory messageData = abi.encodeWithSignature(
            "maker(bytes32,uint256,MakerSwap[])",
            destinationPoolKey,
            takerAmount,
            filledMakerSwaps
        );
        emit SendingCCIPMessage(messageData);

        LiquidityPoolData memory destinationPool = liquidityPools[
            destinationPoolKey
        ].poolData;
        DestinationData memory destination = destinations[
            destinationPool.destinationChainId
        ];

        // CCIPData memory ccipData = sourceLiquidityPool.ccip;
        Client.EVM2AnyMessage memory ccipMessage = Client.EVM2AnyMessage({
            receiver: abi.encode(destination.swapper),
            data: messageData,
            tokenAmounts: new Client.EVMTokenAmount[](0),
            extraArgs: Client._argsToBytes(
                Client.EVMExtraArgsV1({gasLimit: 1_000_000, strict: false})
            ),
            feeToken: address(linkToken)
        });

        // Get the fee required to send the message
        uint256 fees = IRouterClient(i_router).getFee(
            destination.ccipChainSelector,
            ccipMessage
        );

        uint256 linkBalance = IERC20(linkToken).balanceOf(address(this));
        if (fees > linkBalance) revert NotEnoughLink(linkBalance, fees);

        // Send the message through the router and store the returned message ID
        bytes32 messageId = IRouterClient(i_router).ccipSend(
            destination.ccipChainSelector,
            ccipMessage
        );

        emit MakerSwaps(messageId, destinationPoolKey, filledMakerSwaps);
    }

    function _ccipReceive(
        Client.Any2EVMMessage memory message
    ) internal override {
        bytes4 selector = bytes4(message.data);
        bytes memory dataNoSelector = SelectorLib.removeSelector(message.data);
        emit ReceiverCCIPMessage(selector, dataNoSelector);

        if (selector == 0xc3a5273a) {
            // If take(bytes32,uint32) encoded message
            (bytes32 poolKey, uint256 takerAmount) = abi.decode(
                dataNoSelector,
                (bytes32, uint256)
            );
            _settleMaker(poolKey, takerAmount);
        }
        // if (selector == 0x0db2314b) {
        else {
            // maker(bytes32,uint256,MakerSwap[]) encoded message
            (
                bytes32 poolKey,
                uint256 takerAmount,
                MakerSwap[] memory _makerSwaps
            ) = abi.decode(dataNoSelector, (bytes32, uint256, MakerSwap[]));
            _settleTaker(poolKey, takerAmount, _makerSwaps);
        }
    }

    /***************************************
                    Errors
    ****************************************/

    error NotSwapperToken();
    error NotEnoughUnlockedTokens();
    error NotEnoughLockedTokens();
    error NotEnoughPoolLiquidity();
    error InvalidToken();
    error InvalidPool();
    error InvalidAmount();
    error NotEnoughLink(uint256 balance, uint256 fees);
}
