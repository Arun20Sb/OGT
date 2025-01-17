// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script} from "lib/forge-std/src/Script.sol";
import {OGToken} from "../src/OGToken.sol";

contract DeployOGToken is Script {
    uint256 public constant CAPPED_SUPPLY = 100_000_000 ether;
    uint256 public constant INITIAL_SUPPLY = 21_000_000 ether; // 21,000,000 * 10^18 wei
    uint256 public constant BLOCK_REWARD = 50 ether;

    function run() external returns (OGToken) {
        vm.startBroadcast();
        OGToken OG = new OGToken(INITIAL_SUPPLY, CAPPED_SUPPLY, BLOCK_REWARD);
        vm.stopBroadcast();
        return OG;
    }
}
