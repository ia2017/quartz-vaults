import { ethers } from "hardhat";
import { STRAT_PROTO_AMETHYST_UST_BSC } from "./strats/bsc/strat-proto-ames-ust";

const main = async () => {
  const currentStrat = STRAT_PROTO_AMETHYST_UST_BSC;

  const strategyAddress='0x570108E54d11348BD3734FF73dc55eC52c28d3EF';
  const nameToken0=currentStrat.nameToken0;
  const nameToken1=currentStrat.nameToken1;
  const Vault = await ethers.getContractFactory("Vault");
  const vaultArgs = {
    strategyAddress,
    tokenName: `AMES ${nameToken0}-${nameToken1} Vault LP`,
    tokenSymbol: `ames${nameToken0}-${nameToken1}-VLP`,
    approvalDelay: 10,
  };
  const vault = await Vault.deploy(
    vaultArgs.strategyAddress,
    vaultArgs.tokenName,
    vaultArgs.tokenSymbol,
    vaultArgs.approvalDelay
  );

  await vault.deployed();

  console.log("Vault deployed to:", vault.address);
}

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runMain();
