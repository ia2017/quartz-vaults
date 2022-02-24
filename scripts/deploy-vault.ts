import { ethers } from "hardhat";
import { STRAT_DFK_JEWEL_BTC_ADDRESS } from "./data";

async function main() {
  const QuartzVault = await ethers.getContractFactory("QuartzVault");
  // IStrategy _strategy,
  // string memory _name,
  // string memory _symbol,
  // uint256 _approvalDelay
  const vault = await QuartzVault.deploy(
    STRAT_DFK_JEWEL_BTC_ADDRESS,
    `Qyartz.Defi-Jewel-WBTC-VaultLP`,
    `QuartzUstVaultLP`,
    10
  );

  await vault.deployed();

  console.log("QuartzVault deployed to:", vault.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
