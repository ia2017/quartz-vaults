import { ethers } from "hardhat";
import { STRAT_QUARTZ_UST } from "./data";

async function main() {
  const QuartzVault = await ethers.getContractFactory("QuartzVault");
  // IStrategy _strategy,
  // string memory _name,
  // string memory _symbol,
  // uint256 _approvalDelay
  const PREFIX = "qd";
  const vault = await QuartzVault.deploy(
    STRAT_QUARTZ_UST,
    `QUARTZ-VAULT-LP`,
    `${PREFIX}-Quartz-UST`,
    10
  );

  await vault.deployed();

  console.log("QuartzVault deployed to:", vault.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
