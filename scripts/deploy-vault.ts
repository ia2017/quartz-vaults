import { predictAddresses } from "../utils/predictAddresses";
import { deployCommonVault, deployStrategyCommon } from "../utils/deploy-util";
import { STRAT_UST_1QSHARE_BSC } from "./strats/bsc/strat-1qshare-ust";

async function main() {
  const predictedAddresses = await predictAddresses();

  const vault = await deployCommonVault(
    predictedAddresses.strategy,
    STRAT_UST_1QSHARE_BSC.nameToken0,
    STRAT_UST_1QSHARE_BSC.nameToken1
  );

  STRAT_UST_1QSHARE_BSC.constructorArgs.vault = vault.address;
  const strategy = await deployStrategyCommon(
    STRAT_UST_1QSHARE_BSC.constructorArgs
  );

  await strategy.setPendingRewardsFunctionName("pendingShare");

  console.log({
    vault: vault.address,
    strategy: strategy.address,
  });

  let verifyArgs = "";
  Object.values(STRAT_UST_1QSHARE_BSC.constructorArgs).forEach((arg) => {
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
