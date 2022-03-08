import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@nomiclabs/hardhat-web3";

dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    harmony_mainnet: {
      url: process.env.HARMONY_MAINNET_URL || "",
      accounts:
        process.env.HARMONY_MAINNET_DEV_KEY !== undefined
          ? [process.env.HARMONY_MAINNET_DEV_KEY]
          : [],
    },
    bsc_mainnet: {
      url: process.env.BSC_MAINNET_URL || "",
      accounts:
        process.env.BSC_MAINNET_DEV_KEY !== undefined
          ? [process.env.BSC_MAINNET_DEV_KEY]
          : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
