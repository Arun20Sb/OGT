// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "lib/forge-std/src/Test.sol";
import {DeployOGToken} from "../script/DeployOGToken.s.sol";
import {OGToken} from "../src/OGToken.sol";

contract DeployOGTokenTest is Test {
    OGToken public ourToken;
    DeployOGToken public deployer;

    address bob = makeAddr("bob");
    address alice = makeAddr("alice");
    address miner = makeAddr("miner");

    uint256 public constant CAPPED_SUPPLY = 100_000_000 ether;
    uint256 public constant INITIAL_SUPPLY = 21_000_000 ether;
    uint256 public constant BLOCK_REWARD = 50 ether;
    uint256 public constant STARTING_BALANCE = 1000 ether;

    function setUp() public {
        deployer = new DeployOGToken();
        ourToken = deployer.run();

        vm.prank(msg.sender); // owner = msg.sender
    }

    // TEST - 1
    function test_DeploymentParameters() public view {
        assertEq(ourToken.totalSupply(), INITIAL_SUPPLY);
        assertEq(ourToken.cap(), CAPPED_SUPPLY);
        assertEq(ourToken.blockReward(), BLOCK_REWARD);
    }

    // TEST - 2
    function test_TransferAfterDeployment() public {
        // Transfer tokens from the deployer to Bob
        ourToken.transfer(bob, STARTING_BALANCE);
        // Verify the balance of Bob
        assertEq(ourToken.balanceOf(bob), STARTING_BALANCE);
        // Verify the deployer's balance decreases
        assertEq(
            ourToken.balanceOf(msg.sender),
            INITIAL_SUPPLY - STARTING_BALANCE
        );
    }

    function test_BlockRewardAfterDeployment() public {
        // Set the miner as the coinbase address
        vm.coinbase(miner);
        // Perform a transfer to trigger the block reward
        ourToken.transfer(alice, 500 ether);
        // Verify the miner received the block reward
        assertEq(ourToken.balanceOf(miner), BLOCK_REWARD);
    }
}
