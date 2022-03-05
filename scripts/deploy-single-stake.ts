import { predictAddresses } from "../utils/predictAddresses";
import {
  deploySingleStakeVault,
  deployStrategySingleStake,
} from "../utils/deploy-util";
import { STRAT_SINGLE_STAKE_QUARTZ_HARMONY } from "./strats/harmony/strat-single-quartz";

async function main() {
  const currentStrat = STRAT_SINGLE_STAKE_QUARTZ_HARMONY;

  const predictedAddresses = await predictAddresses();

  const vault = await deploySingleStakeVault(
    predictedAddresses.strategy,
    currentStrat.tokenName
  );

  currentStrat.constructorArgs.vault = vault.address;

  const strategy = await deployStrategySingleStake(
    currentStrat.constructorArgs
  );

  // Update rewards check function name to match our reward pool/chef name
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
