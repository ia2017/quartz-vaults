import { ethers } from "hardhat";
import {
  STRAT_1QSHARE_UST_ADDRESS_BSC,
  STRAT_AMETHYST_UST_ADDRESS_BSC,
} from "./strats/bsc/bsc-data";

async function main() {
  const QuartzVault = await ethers.getContractFactory("QuartzVault");
  // IStrategy _strategy,
  // string memory _name,
  // string memory _symbol,
  // uint256 _approvalDelay
  const vault = await QuartzVault.deploy(
    STRAT_AMETHYST_UST_ADDRESS_BSC,
    "Quartz AMES-UST Vault LP",
    `Quartz-AMES-UST-VaultLP`,
    10
  );

  await vault.deployed();

  console.log("QuartzVault deployed to:", vault.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
