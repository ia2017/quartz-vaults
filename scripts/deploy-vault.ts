import { ethers } from "hardhat";
import { predictAddresses } from "../utils/predictAddresses";
import { deployCommonVault } from "./deploy-util";
import {
  STRAT_1QSHARE_UST_ADDRESS_BSC,
  STRAT_AMETHYST_UST_ADDRESS_BSC,
  STRAT_ASHARE_UST_ADDRESS_BSC,
} from "./strats/bsc/bsc-addresses";
import { STRAT_UST_1QSHARE_BSC } from "./strats/bsc/strat-1qshare-ust";

async function main() {
  const predictedAddresses = await predictAddresses();
  console.log(predictedAddresses);

  await deployCommonVault(
    STRAT_UST_1QSHARE_BSC.nameToken0,
    STRAT_UST_1QSHARE_BSC.nameToken1,
    STRAT_UST_1QSHARE_BSC.constructorArgs
  );

  // const QuartzVault = await ethers.getContractFactory("QuartzVault");
  // // IStrategy _strategy,
  // // string memory _name,
  // // string memory _symbol,
  // // uint256 _approvalDelay
  // const vault = await QuartzVault.deploy(
  //   STRAT_1QSHARE_UST_ADDRESS_BSC,
  //   "Quartz 1QSHARE-UST Vault LP",
  //   `qtz1QSHARE-UST-VLP`,
  //   10
  // );

  // await vault.deployed();

  // console.log("QuartzVault deployed to:", vault.address);

  // const Strategy = await ethers.getContractFactory('StrategyQuartzLP');
  // const strategy = await Strategy.deploy(
  //   ...config.stratArgs,
  //   predictedAddresses.vault
  // );

  // await strategy.deployed();
  // console.log("StrategyQuartzLP deployed to:", strategy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
