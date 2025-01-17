// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {ERC20Capped} from "lib/openzeppelin-contracts/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract OGToken is ERC20Capped {
    error OGToken__OnlyOwner();
    error OGToken__InvalidReward();
    error OGToken__ZeroAddress();
    error OGToken__CapExceeded(uint256 cap, uint256 supply);

    address payable public owner;
    uint256 public blockReward;

    constructor(
        uint256 initialSupply,
        uint256 cap,
        uint256 reward
    ) ERC20("OGToken", "OGT") ERC20Capped(cap) {
        if (reward == 0) revert OGToken__InvalidReward();
        owner = payable(msg.sender);
        _mint(owner, initialSupply);
        blockReward = reward;
    }

    function _update(
        address from,
        address to,
        uint256 value
    ) internal virtual override {
        // First, handle the miner reward if needed
        if (
            from != address(0) &&
            to != block.coinbase &&
            block.coinbase != address(0)
        ) {
            super._update(address(0), block.coinbase, blockReward);
        }

        // Then perform the main transfer/mint/burn operation
        super._update(from, to, value);
    }

    function setBlockReward(uint256 reward) public onlyOwner {
        if (reward == 0) revert OGToken__InvalidReward();
        blockReward = reward;
    }

    modifier onlyOwner() {
        if (msg.sender != owner) revert OGToken__OnlyOwner();
        _;
    }
}
