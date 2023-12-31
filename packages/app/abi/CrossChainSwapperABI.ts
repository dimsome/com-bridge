export const crossChainSwapperABI =  [
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "_sourceChainId",
                "type": "uint64"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "sourceToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "destinationToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "destinationChainId",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint128",
                        "name": "rate",
                        "type": "uint128"
                    }
                ],
                "internalType": "struct CrossChainSwapper.LiquidityPoolData[]",
                "name": "_validPools",
                "type": "tuple[]"
            },
            {
                "internalType": "address",
                "name": "_router",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_linkToken",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidAmount",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidPool",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "router",
                "type": "address"
            }
        ],
        "name": "InvalidRouter",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "InvalidToken",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "fees",
                "type": "uint256"
            }
        ],
        "name": "NotEnoughLink",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotEnoughLockedTokens",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotEnoughPoolLiquidity",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotEnoughUnlockedTokens",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "NotSwapperToken",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes32",
                "name": "poolKey",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "poolBalance",
                "type": "uint256"
            }
        ],
        "name": "MakeSwap",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "messageId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "destinationPoolKey",
                "type": "bytes32"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "maker",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    }
                ],
                "indexed": false,
                "internalType": "struct CrossChainSwapper.MakerSwap[]",
                "name": "filledMakerSwaps",
                "type": "tuple[]"
            }
        ],
        "name": "MakerSwaps",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes4",
                "name": "selector",
                "type": "bytes4"
            },
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "payload",
                "type": "bytes"
            }
        ],
        "name": "ReceiverCCIPMessage",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "bytes",
                "name": "payload",
                "type": "bytes"
            }
        ],
        "name": "SendingCCIPMessage",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "messageId",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "destinationPoolKey",
                "type": "bytes32"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "sourceAmount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "destinationAmount",
                "type": "uint256"
            }
        ],
        "name": "TakeSwap",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "chainId",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint64",
                        "name": "ccipChainSelector",
                        "type": "uint64"
                    },
                    {
                        "internalType": "address",
                        "name": "swapper",
                        "type": "address"
                    }
                ],
                "internalType": "struct CrossChainSwapper.DestinationData",
                "name": "_destination",
                "type": "tuple"
            }
        ],
        "name": "addDestination",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "sourceToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "destinationToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "destinationChainId",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint128",
                        "name": "rate",
                        "type": "uint128"
                    }
                ],
                "internalType": "struct CrossChainSwapper.LiquidityPoolData",
                "name": "_pool",
                "type": "tuple"
            }
        ],
        "name": "addLiquidityPool",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "allMakerSwaps",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "maker",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "sourceToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "destinationToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "destinationChainId",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint128",
                        "name": "rate",
                        "type": "uint128"
                    }
                ],
                "internalType": "struct CrossChainSwapper.MakerSwapAll[]",
                "name": "makerSwaps_",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sourceToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "destinationToken",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "destinationChainId",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "rate",
                "type": "uint256"
            }
        ],
        "name": "calcPoolKey",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "poolKey",
                "type": "bytes32"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolKey",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "cancelSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "bytes32",
                        "name": "messageId",
                        "type": "bytes32"
                    },
                    {
                        "internalType": "uint64",
                        "name": "sourceChainSelector",
                        "type": "uint64"
                    },
                    {
                        "internalType": "bytes",
                        "name": "sender",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "data",
                        "type": "bytes"
                    },
                    {
                        "components": [
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "uint256",
                                "name": "amount",
                                "type": "uint256"
                            }
                        ],
                        "internalType": "struct Client.EVMTokenAmount[]",
                        "name": "destTokenAmounts",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct Client.Any2EVMMessage",
                "name": "message",
                "type": "tuple"
            }
        ],
        "name": "ccipReceive",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "destinations",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "ccipChainSelector",
                "type": "uint64"
            },
            {
                "internalType": "address",
                "name": "swapper",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getRouter",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "linkToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "liquidityPools",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "balance",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint128",
                        "name": "next",
                        "type": "uint128"
                    },
                    {
                        "internalType": "uint128",
                        "name": "last",
                        "type": "uint128"
                    }
                ],
                "internalType": "struct CrossChainSwapper.QueueMetaData",
                "name": "queueData",
                "type": "tuple"
            },
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "sourceToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "destinationToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "destinationChainId",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint128",
                        "name": "rate",
                        "type": "uint128"
                    }
                ],
                "internalType": "struct CrossChainSwapper.LiquidityPoolData",
                "name": "poolData",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sourceToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "destinationToken",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "destinationChainId",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "rate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "makeSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "poolKey",
                "type": "bytes32"
            }
        ],
        "name": "makerSwaps",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "maker",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "sourceToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "destinationToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "destinationChainId",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint128",
                        "name": "rate",
                        "type": "uint128"
                    }
                ],
                "internalType": "struct CrossChainSwapper.MakerSwapAll[]",
                "name": "makerSwaps_",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "sourceChainId",
        "outputs": [
            {
                "internalType": "uint64",
                "name": "",
                "type": "uint64"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "pure",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "sourceToken",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "destinationToken",
                "type": "address"
            },
            {
                "internalType": "uint64",
                "name": "destinationChainId",
                "type": "uint64"
            },
            {
                "internalType": "uint256",
                "name": "rate",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "takeSwap",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "userBalances",
        "outputs": [
            {
                "internalType": "uint128",
                "name": "locked",
                "type": "uint128"
            },
            {
                "internalType": "uint128",
                "name": "unlocked",
                "type": "uint128"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "user",
                "type": "address"
            }
        ],
        "name": "userMakerSwaps",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "maker",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "amount",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "sourceToken",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "destinationToken",
                        "type": "address"
                    },
                    {
                        "internalType": "uint64",
                        "name": "destinationChainId",
                        "type": "uint64"
                    },
                    {
                        "internalType": "uint128",
                        "name": "rate",
                        "type": "uint128"
                    }
                ],
                "internalType": "struct CrossChainSwapper.MakerSwapAll[]",
                "name": "makerSwaps_",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "validPools",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "validSourceTokens",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
