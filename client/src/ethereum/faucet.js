// Import ethers
import { ethers } from "ethers";
import {faucetAbi} from "../utils/index.js";

// Create contract instance
const faucetContract = (provider) => {
  const contractAddress = "0x4e69ba97366455cde7892cAB41f8E46D0DabbB67";

  try {
    return new ethers.Contract(contractAddress, faucetAbi, provider);
  } catch (error) {
    console.error("Error creating contract instance:", error);
    throw error;
  }
};

export default faucetContract;
