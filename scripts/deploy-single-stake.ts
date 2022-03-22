import { predictAddresses } from "../utils/predictAddresses";
import {
  deploySingleStakeVault,
  deployStrategySingleStake,
} from "../utils/deploy-util";
import { STRAT_SINGLE_STAKE_AMETHYST_BSC } from "./strats/bsc/strat-ames-single";

async function main() {
  const currentStrat = STRAT_SINGLE_STAKE_AMETHYST_BSC;
  const predictedAddresses = await predictAddresses('');

  const vault = await deploySingleStakeVault(
    '0x570108E54d11348BD3734FF73dc55eC52c28d3EF',
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
