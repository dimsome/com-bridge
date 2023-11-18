// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

library SelectorLib {
    function removeSelector(
        bytes calldata data
    ) external pure returns (bytes memory remainingData) {
        require(data.length >= 4, "no selector");

        remainingData = data[4:];
    }
}
