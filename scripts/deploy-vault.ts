import { predictAddresses } from "../utils/predictAddresses";
import { deployCommonVault, deployStrategyCommon } from "../utils/deploy-util";
import { STRAT_UST_AMETHYST_BSC } from "./strats/bsc/strat-amethyst-ust";

async function main() {
  const currentStrat = STRAT_UST_AMETHYST_BSC;

  const predictedAddresses = await predictAddresses();

  const vault = await deployCommonVault(
    predictedAddresses.strategy,
    currentStrat.nameToken0,
    currentStrat.nameToken1
  );

  currentStrat.constructorArgs.vault = vault.address;
  const strategy = await deployStrategyCommon(currentStrat.constructorArgs);

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
