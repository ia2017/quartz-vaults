import { predictAddresses } from "../utils/predictAddresses";
import { deployStrategySharesLP, deployStrategySharesLpVault } from "../utils/deploy-util";
import { STRAT_PROTO_AMES_SHARES_BSC } from "./strats/bsc/strat-proto-ames-share";
import { ethers } from "hardhat";

async function main() {
  const currentStrat = STRAT_PROTO_AMES_SHARES_BSC;

  const predictedAddresses = await predictAddresses();

  const DEFAULT_DEPOSIT_LIMIT = ethers.utils.parseEther('1000');

  const vault = await deployStrategySharesLpVault(
    predictedAddresses.strategy,
    currentStrat.nameToken0,
    currentStrat.nameToken1,
    DEFAULT_DEPOSIT_LIMIT
  );

  currentStrat.constructorArgs.vault = vault.address;

  // Update rewards check function name to match our reward pool/chef name
  const strategy = await deployStrategySharesLP(currentStrat.constructorArgs);

  const tx = await strategy.setPendingRewardsFunctionName("pendingShare");
  await tx.wait(1);

  console.log({
    vault: vault.address,
    strategy: strategy.address,
  });

  let verifyArgs = "";
  Object.values(currentStrat.constructorArgs).forEach((arg) => {
    if (Array.isArray(arg)) {
      verifyArgs += `"${JSON.stringify(arg)}"` + " ";
    } else {
      verifyArgs += typeof arg === "number" ? arg + " " : `"${arg}" `;
    }
  });

  console.log(verifyArgs);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
