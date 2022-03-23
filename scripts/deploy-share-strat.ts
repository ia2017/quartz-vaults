import { predictAddresses } from "../utils/predictAddresses";
import { deployStrategySharesLP, deploySharesLpVault } from "../utils/deploy-util";
import { ethers } from "hardhat";
import { STRAT_PROTO_SHARES_UST_BSC } from "./strats/bsc/strat-proto-shares-ust";

async function main() {
  const currentStrat = STRAT_PROTO_SHARES_UST_BSC;

  const currentStrategist = '0x570108E54d11348BD3734FF73dc55eC52c28d3EF'

  const predictedAddresses = await predictAddresses(currentStrategist);

  const DEFAULT_TOTAL_DEPOSIT_LIMIT = ethers.utils.parseEther('1000');
  const USER_DEPOSIT_LIMIT = ethers.utils.parseEther('100');

  const vault = await deploySharesLpVault(
    currentStrategist,
    predictedAddresses.strategy,
    currentStrat.nameToken0,
    currentStrat.nameToken1,
    DEFAULT_TOTAL_DEPOSIT_LIMIT,
    USER_DEPOSIT_LIMIT
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
