import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x0000000000000000000000000000000000000000000000000000000000000001";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    // Injective EVM Testnet
    injectiveTestnet: {
      url: process.env.INJECTIVE_TESTNET_RPC || "https://testnet.svm.injective.network/",
      chainId: 1440002,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
    // Injective EVM Mainnet
    injectiveMainnet: {
      url: "https://svm.injective.network/",
      chainId: 1738,
      accounts: [PRIVATE_KEY],
      gasPrice: "auto",
    },
  },
  etherscan: {
    apiKey: {
      injectiveTestnet: "placeholder", // Injective explorer doesn't require API key
    },
    customChains: [
      {
        network: "injectiveTestnet",
        chainId: 1440002,
        urls: {
          apiURL: "https://testnet.explorer.injective.network/api",
          browserURL: "https://testnet.explorer.injective.network",
        },
      },
    ],
  },
};

export default config;
