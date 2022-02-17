import * as dotenv from "dotenv";

import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "@openzeppelin/hardhat-upgrades";

dotenv.config();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: {
    compilers: [{ version: "0.8.4" }, { version: "0.6.12" }],
  },
  networks: {
    harmony_mainnet: {
      url: process.env.HARMONY_MAINNET_URL || "",
      accounts:
        process.env.HARMONY_MAINNET_DEV_KEY !== undefined
          ? [process.env.HARMONY_MAINNET_DEV_KEY]
          : [],
    },
  },
};

export default config;
