// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "lib/forge-std/src/Script.sol";
import {IERC20} from "lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Faucet} from "../src/Faucet.sol";

contract DeployFaucet is Script {
    address public tokenAddress = 0x36b2285628e088FD7Ed21C1a6624a8FA90C26961; // Your deployed OGToken address

    function run() external {
        vm.startBroadcast();

        // Deploy the Faucet contract, passing the token address
        new Faucet(tokenAddress);

        vm.stopBroadcast();
    }
}

// 0x4e69ba97366455cde7892cAB41f8E46D0DabbB67 - 