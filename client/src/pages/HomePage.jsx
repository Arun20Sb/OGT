import { Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import faucetContract from "../ethereum/faucet.js";
import TileBackground from "../components/TileBackground";

const HomePage = () => {
  const [account, setAccount] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [signer, setSigner] = useState();
  const [fcContract, setFcContract] = useState();
  const [withDrawlError, setWithDrawlError] = useState("");
  const [withDrawlSuccess, setWithDrawlSuccess] = useState("");
  const [transactionData, setTransactionData] = useState("");

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const newSigner = await provider.getSigner();

        setSigner(newSigner);
        setFcContract(faucetContract(provider));
        setAccount(accounts[0]);

        // Save the account to localStorage
        localStorage.setItem("connectedAccount", accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
        setWithDrawlError("Failed to connect wallet: " + error.message);
      }
    } else {
      setWithDrawlError("Please install MetaMask!");
    }
  };

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
      const savedAccount = localStorage.getItem("connectedAccount");
      if (savedAccount && typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const newSigner = await provider.getSigner();

          setSigner(newSigner);
          setFcContract(faucetContract(provider));
          setAccount(savedAccount);
        } catch (error) {
          console.error("Error reconnecting wallet:", error);
          localStorage.removeItem("connectedAccount");
        }
      }
    };

    reconnectWallet();
  }, []);

  const getOGTHandler = async () => {
    setWithDrawlError("");
    setWithDrawlSuccess("");
    try {
      if (!fcContract || !signer) {
        throw new Error("Please connect your wallet first");
      }

      const fcContractWithSigner = fcContract.connect(signer);
      const response = await fcContractWithSigner.requestTokens();

      setWithDrawlSuccess("Tokens sent - enjoy your tokens !! 🎉");
      setTransactionData(response.hash);
    } catch (error) {
      console.error(error);
      setWithDrawlError("Error sending tokens, 💀 ERROR: " + error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getOGTHandler();
  };

  return (
    <div className="relative min-h-screen">
      <TileBackground />
      <div className="z-20 relative text-gray-50 font-serif">
        <nav className="bg-gray-900 shadow-2xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-extrabold tracking-wide">
              OG Token Faucet
            </h1>
            <button
              onClick={account ? disconnectWallet : connectWallet}
              className={`flex items-center gap-3 text-xl bg-gray-50 text-gray-900 px-4 py-2 rounded-md hover:bg-green-400 hover:text-black transition-all ${
                account ? "text-green-500 font-bold" : ""
              }`}
            >
              <Wallet size={20} />
              {account
                ? `${account.slice(0, 6)}...${account.slice(-4)} ⚡`
                : "Connect Wallet"}
            </button>
          </div>
        </nav>

        <main className="max-w-3xl flex flex-col gap-5 mx-auto mt-16 px-5">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-extrabold tracking-wider text-gray-50 animate-fade-in">
              Get <span className="text-blue-500">OG Tokens</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Use this faucet to receive OG tokens for fun 🎈. Just hold them
              and chill, value will rise soon 💤. Tokens will be sent to your
              provided address on the Sepolia testnet.⚡
            </p>
            <p className="text-2xl font-bold tracking-wider animate-fade-in text-gray-50">
              50 OG/day.
            </p>
          </div>
          <div className="text-center space-y-4">
            {withDrawlError && (
              <div className="text-balance text-red-300 text-sm">
                {withDrawlError}
              </div>
            )}
            {withDrawlSuccess && (
              <div className="text-balance text-indigo-300 text-lg">
                <h1>{withDrawlSuccess}</h1>
                <p>
                  To recieve Tokens into your metamask, import from here:{" "}
                  <strong>0x36b2285628e088FD7Ed21C1a6624a8FA90C26961</strong>
                </p>
              </div>
            )}
          </div>
        </main>

        <div className="bg-gray-800 mt-10 p-8 rounded-lg mr-24 relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-0 sm:max-w-7xl">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 flex flex-col items-center"
          >
            <div className="w-full">
              <label
                htmlFor="address"
                className="block text-sm font-medium mb-2 text-gray-50"
              >
                Wallet Address
              </label>
              <input
                type="text"
                id="address"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="Enter your wallet address (0x...)"
                className="w-full px-4 py-2 bg-gray-900 text-gray-200 border border-gray-700 rounded-lg outline-none transition-all "
                required
              />
            </div>

            <div className="border border-black shadow-[-7px_7px_0px_#000000] w-1/4">
              <button
                type="submit"
                className="w-full rounded-none bg-blue-600 py-3 text-white font-semibold hover:bg-blue-500 transition-transform transform active:scale-95 active:-translate-x-1"
              >
                Request Tokens
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-800 mt-10 p-8 rounded-lg mr-24 relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-0 sm:max-w-7xl">
          <p>
            {transactionData
              ? `Transaction hash: ${transactionData}`
              : "--😑--"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
