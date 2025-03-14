// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    event Transfer(address indexed from, address indexed to, uint256 value); 
}

contract Faucet {
    // Errors:
    error Faucet_ZeroAddress();
    error Faucet_InsufficientBalanceAvailable();
    error Faucet_ComeTomorrow();

    // Events:
    event Deposit(address indexed from, uint256 indexed amount);
    event Withdrawal(address indexed to, uint256 indexed amount);

    address payable public owner; 
    IERC20 public token;

    uint256 public withdrawalAmount = 50 ether; 
    uint256 public lockTime = 1 minutes;

    mapping(address => uint256) public nextRequestTime; 

    constructor(address tokenAddress) payable {
        if (tokenAddress == address(0)) revert Faucet_ZeroAddress(); 
        token = IERC20(tokenAddress);
        owner = payable(msg.sender);
    }

    // Request Tokens:
    function requestTokens() public {
        if (msg.sender == address(0)) revert Faucet_ZeroAddress();
        if (token.balanceOf(address(this)) < withdrawalAmount)
            revert Faucet_InsufficientBalanceAvailable();
        if (block.timestamp < nextRequestTime[msg.sender])
            revert Faucet_ComeTomorrow();

        nextRequestTime[msg.sender] = block.timestamp + lockTime;

        bool success = token.transfer(msg.sender, withdrawalAmount);
        require(success, "Token transfer failed");
    }

    // Deposit Native Token (Receive ETH):
    receive() external payable {
        emit Deposit(msg.sender, msg.value);
    }

    // Get Contract Token Balance:
    function getBalance() external view returns (uint256) {
        return token.balanceOf(address(this));
    }

    // Set Withdrawal Amount:
    function setWithdrawalAmount(uint256 amount) public onlyOwner {
        withdrawalAmount = amount * 1 ether;
    }

    // Set Lock Time:
    function setLockTime(uint256 amountInMinutes) public onlyOwner {
        lockTime = amountInMinutes * 1 minutes;
    }

    // Withdraw Contract Tokens to Owner:
    function withdraw() external onlyOwner {
        uint256 contractBalance = token.balanceOf(address(this));
        emit Withdrawal(msg.sender, contractBalance);

        bool success = token.transfer(msg.sender, contractBalance);
        require(success, "Withdrawal failed");
    }

    // Modifier to Restrict Access to Owner Only:
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }
}
