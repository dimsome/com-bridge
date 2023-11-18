// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
    uint8 internal immutable __decimals;

    constructor(
        string memory name,
        string memory symbol,
        uint8 _decimals,
        uint256 initSupply
    ) ERC20(name, symbol) {
        __decimals = _decimals;
        _mint(msg.sender, initSupply);
    }

    function decimals() public view virtual override returns (uint8 decimals_) {
        decimals_ = __decimals;
    }
}
