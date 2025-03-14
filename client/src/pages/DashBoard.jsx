import { useEffect, useState } from "react";
import { ethers } from "ethers";
import faucetContract from "../ethereum/faucet.js";

const Dashboard = () => {
  const [owner, setOwner] = useState(null);
  const [userAddress, setUserAddress] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [lockTime, setLockTime] = useState("");
  const [balance, setBalance] = useState("Loading...");

  useEffect(() => {
    const checkOwnership = async () => {
      if (!window.ethereum) {
        alert("Please install MetaMask!");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const userAddr = await signer.getAddress();
      setUserAddress(userAddr);

      const contract = faucetContract(provider);
      const contractOwner = await contract.owner();
      setOwner(contractOwner);

      setIsOwner(userAddr.toLowerCase() === contractOwner.toLowerCase());
    };

    checkOwnership();
    getBalance();
  }, []);

  // Function to update withdrawal amount
  const updateWithdrawalAmount = async () => {
    if (!withdrawalAmount) return alert("Enter withdrawal amount");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = faucetContract(signer);

      const tx = await contract.setWithdrawalAmount(withdrawalAmount);
      await tx.wait();
      alert("Withdrawal amount updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  // Function to update lock time
  const updateLockTime = async () => {
    if (!lockTime) return alert("Enter lock time in minutes");

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = faucetContract(signer);

      const tx = await contract.setLockTime(lockTime);
      await tx.wait();
      alert("Lock time updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  // Function to withdraw contract funds
  const withdrawFunds = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = faucetContract(signer);

      const tx = await contract.withdraw();
      await tx.wait();
      alert("Funds withdrawn successfully!");
    } catch (error) {
      console.error(error);
      alert("Transaction failed!");
    }
  };

  // Function to get contract balance
  const getBalance = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = faucetContract(provider);
      const balanceWei = await contract.getBalance();
      const balanceEth = ethers.formatEther(balanceWei);
      setBalance(balanceEth + " ETH");
    } catch (error) {
      console.error(error);
      setBalance("Error fetching balance");
    }
  };

  if (!isOwner) return <h2>Access Denied: Only the Owner Can View This</h2>;

  return (
    <div>
      <h1>Owner Dashboard</h1>
      <p>
        <strong>Connected Wallet:</strong> {userAddress}
      </p>
      <p>
        <strong>Contract Owner:</strong> {owner}
      </p>
      <p>
        <strong>Contract Balance:</strong> {balance}
      </p>

      <h3>Update Withdrawal Amount</h3>
      <input
        type="number"
        placeholder="Enter amount (ETH)"
        value={withdrawalAmount}
        onChange={(e) => setWithdrawalAmount(e.target.value)}
      />
      <button onClick={updateWithdrawalAmount}>Update</button>

      <h3>Update Lock Time</h3>
      <input
        type="number"
        placeholder="Enter time (minutes)"
        value={lockTime}
        onChange={(e) => setLockTime(e.target.value)}
      />
      <button onClick={updateLockTime}>Update</button>

      <h3>Withdraw Contract Funds</h3>
      <button onClick={withdrawFunds}>Withdraw</button>

      <h3>Get Contract Balance</h3>
      <button onClick={getBalance}>Refresh Balance</button>
    </div>
  );
};

export default Dashboard;
