🪙 OGToken - Web3 Token and Faucet

A Web3 application featuring an ERC-20 token deployed on the Sepolia testnet with a faucet for controlled token distribution and cooldown restrictions.  
Built with Solidity, OpenZeppelin, React.js, Tailwind CSS, and Foundry.

---

🚀 Features

- ERC-20 token developed and deployed on Sepolia testnet
- Faucet smart contract for secure and controlled token distribution
- Cooldown timer to prevent abuse
- Integrated transaction tracking via Sepolia Etherscan

---

🛠️ Tech Stack

- Smart Contracts: Solidity + OpenZeppelin + Foundry
- Frontend: React.js + Tailwind CSS
- Blockchain: Sepolia Testnet

---

🖥️ Getting Started

1. Clone the repository
```bash
git clone https://github.com/Arun20Sb/OGT.git
cd OGT
```

2. Install frontend dependencies
```bash
npm install
```

3. Configure environment variables  
Create a `.env` file in the root directory and add:
```env
PRIVATE_KEY=your_wallet_private_key
SEPOLIA_RPC_URL=your_sepolia_rpc_url
```

4. Install Foundry (if you haven't already)
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

5. Deploy the smart contracts to Sepolia using Foundry
```bash
forge script script/Deploy.s.sol:Deploy --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify
```

6. Run the frontend development server
```bash
npm run dev
```

The frontend app should now be running at:  
http://localhost:5173

---

✅ You can claim tokens from the faucet and verify transactions on Sepolia Etherscan!  
