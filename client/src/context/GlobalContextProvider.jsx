/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { ethers } from "ethers";
import { createContext, useContext, useEffect, useState } from "react";
import faucetContract from "../ethereum/faucet";

const GlobalContext = createContext();

const GlobalContextProvider = ({ children }) => {
  // Globally used states:
  const [account, setAccount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [signer, setSigner] = useState(null);
  const [fcContract, setFcContract] = useState(null);
  const [contractOwner, setContractOwner] = useState("");

  // Frontend Errors:
  const [withDrawlError, setWithDrawlError] = useState("");
  const [withDrawlSuccess, setWithDrawlSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  // Connect Wallet:
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const newSigner = await provider.getSigner();

        setSigner(newSigner);
        setFcContract(faucetContract(newSigner)); // Ensure contract uses signer
        setAccount(accounts[0]);

        // Save the account to localStorage
        localStorage.setItem("connectedAccount", accounts[0]);

        // Fetch Contract Owner
        const owner = await faucetContract(newSigner).owner();
        setContractOwner(owner);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setWithDrawlError("Failed to connect wallet: " + error.message);
      }
    } else {
      setWithDrawlError("Please install MetaMask!");
    }
  };

  // Disconnect Wallet:
  const disconnectWallet = () => {
    setAccount("");
    setSigner(null);
    setFcContract(null);

    // Clear the account from localStorage
    localStorage.removeItem("connectedAccount");
  };

  // Automatically reconnect the wallet on page load
  useEffect(() => {
    const reconnectWallet = async () => {
      if (!window.ethereum || !(await window.ethereum._metamask.isUnlocked()))
        return;

      const savedAccount = localStorage.getItem("connectedAccount");
      if (savedAccount) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await provider.getSigner();

          setSigner(newSigner);
          setFcContract(faucetContract(newSigner));
          setAccount(savedAccount);
        } catch (error) {
          console.error("Error reconnecting wallet:", error);
          localStorage.removeItem("connectedAccount");
        }
      }
    };

    reconnectWallet();
  }, []);

  // Get OG Tokens:
  const getOGTHandler = async () => {
    setWithDrawlError("");
    setWithDrawlSuccess("");

    try {
      if (!fcContract || !signer) {
        throw new Error("Please connect your wallet first");
      }

      const fcContractWithSigner = fcContract.connect(signer);
      const tx = await fcContractWithSigner.requestTokens();

      await tx.wait(); // Wait for transaction confirmation
      setWithDrawlSuccess("Tokens sent - enjoy your tokens! 🎉");
      setTransactionData(tx.hash);
    } catch (error) {
      console.error("Transaction Failed:", error.message);

      try {
        if (error.data && fcContract.interface) {
          const decodedError = fcContract.interface.parseError(error.data);
          setWithDrawlError(
            `💀 ERROR: ${decodedError?.name || "Unknown custom error"}`
          );
          return;
        }
      } catch (decodeError) {
        console.error("Error decoding custom error:", decodeError);
      }

      // Handle standard errors
      if (error.reason) {
        setWithDrawlError(`💀 ERROR: ${error.reason}`);
      } else if (error.data?.message) {
        setWithDrawlError(`💀 ERROR: ${error.data.message}`);
      } else if (error.error?.message) {
        setWithDrawlError(`💀 ERROR: ${error.error.message}`);
      } else {
        setWithDrawlError("❌ An unknown error occurred!");
      }
    }
  };

  return (
    <GlobalContext.Provider
      value={{
        account,
        recipientAddress,
        setRecipientAddress,
        contractOwner,
        withDrawlError,
        withDrawlSuccess,
        transactionData,
        connectWallet,
        disconnectWallet,
        getOGTHandler,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export { GlobalContextProvider, useGlobalContext };
