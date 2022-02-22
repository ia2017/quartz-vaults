import { ethers } from "hardhat";

async function main() {
  const QuartzVault = await ethers.getContractFactory("QuartzVault");
  // IStrategy _strategy,
  // string memory _name,
  // string memory _symbol,
  // uint256 _approvalDelay
  const vault = await QuartzVault.deploy(
    "0x72bd47e1AF4b97D25076E36d2c177aa9c45033e2",
    `Qyartz.Defi-QuartzUstVaultLP`,
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
