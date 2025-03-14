import { Wallet } from "lucide-react";
import TileBackground from "../components/TileBackground";
import { useGlobalContext } from "../context/GlobalContextProvider";
import { useNavigate } from "react-router-dom";

const importaddress = "0x36b2285628e088fd7ed21c1a6624a8fa90c26961";

const HomePage = () => {
  const {
    account,
    contractOwner,
    recipientAddress,
    setRecipientAddress,
    withDrawlError,
    withDrawlSuccess,
    transactionData,
    connectWallet,
    disconnectWallet,
    getOGTHandler,
  } = useGlobalContext();

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    getOGTHandler();
  };

  return (
    <div className="relative min-h-screen">
      <TileBackground />
      <div className="z-20 relative text-gray-50 font-serif">
        <nav className="bg-gray-900 shadow-2xl">
          <div className="max-w-6xl mx-auto px-6 py-4 flex max-md:flex-col gap-5 justify-between items-center">
            <h1 className="text-2xl font-extrabold tracking-wide flex items-center">
              <img
                src="https://img.icons8.com/?size=100&id=7xqkdDZOH9Hv&format=png&color=000000"
                alt="🪙"
                className="mr-3 w-10 h-10 inline-block"
              />
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
          <div>
            <h1 className="text-3xl font-bold">Welcome to Findster</h1>
            <p className="mt-2">Your Web3 Faucet App</p>

            {account &&
              account.toLowerCase() === contractOwner.toLowerCase() && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Go to Dashboard
                </button>
              )}
          </div>
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
              <div className="text-indigo-300 text-lg">
                <h1>{withDrawlSuccess}</h1>
                <p>
                  To recieve Tokens into your metamask, click & import this into
                  metamask to let it know about OG Tokens:{" "}
                  <strong
                    onClick={() => {
                      navigator.clipboard.writeText(
                        "0x36b2285628e088FD7Ed21C1a6624a8FA90C26961"
                      );
                      alert("Address copied to clipboard! 📋");
                    }}
                    className="cursor-pointer text-blue-500 underline overflow-hidden whitespace-nowrap w-full"
                    style={{ textOverflow: "ellipsis" }}
                  >
                    {importaddress.slice(0, 20)}...
                    {importaddress.slice(-4)}
                  </strong>
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

            <div className="border border-black shadow-[-7px_7px_0px_#000000]">
              <button
                type="submit"
                className="w-fit rounded-none bg-blue-600 py-3 px-3 text-white font-semibold hover:bg-blue-500 transition-transform transform active:scale-95 active:-translate-x-1"
              >
                Request Tokens
              </button>
            </div>
          </form>
        </div>

        <div className="bg-gray-800 mt-10 p-8 rounded-lg mr-24 relative left-1/2 top-1/2 -translate-x-1/2 -translate-y-0 sm:max-w-7xl">
          Transaction hash:
          <p>
            {transactionData ? (
              <a
                href={`https://sepolia.etherscan.io/tx/${transactionData}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {transactionData.slice(0, 15)}...
                {transactionData.slice(-4)}
              </a>
            ) : (
              "--😑--"
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
