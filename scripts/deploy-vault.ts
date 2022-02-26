import { ethers } from "hardhat";
import {
  STRAT_1QSHARE_UST_ADDRESS_BSC,
  STRAT_AMETHYST_UST_ADDRESS_BSC,
  STRAT_ASHARE_UST_ADDRESS_BSC,
} from "./strats/bsc/bsc-addresses";

async function main() {
  const QuartzVault = await ethers.getContractFactory("QuartzVault");
  // IStrategy _strategy,
  // string memory _name,
  // string memory _symbol,
  // uint256 _approvalDelay
  const vault = await QuartzVault.deploy(
    STRAT_1QSHARE_UST_ADDRESS_BSC,
    "Quartz 1QSHARE-UST Vault LP",
    `qtz1QSHARE-UST-VLP`,
    10
  );

  await vault.deployed();

  console.log("QuartzVault deployed to:", vault.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
