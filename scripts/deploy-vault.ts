import { predictAddresses } from "../utils/predictAddresses";
import { deployCommonVault, deployStrategySharesLP } from "../utils/deploy-util";
import { STRAT_PROTO_AMETHYST_UST_BSC } from "./strats/bsc/strat-proto-ames-ust";

async function main() {
  const currentStrat = STRAT_PROTO_AMETHYST_UST_BSC;

  const predictedAddresses = await predictAddresses('0x570108E54d11348BD3734FF73dc55eC52c28d3EF'); // who's address?

  const vault = await deployCommonVault(
    '0x570108E54d11348BD3734FF73dc55eC52c28d3EF',
    predictedAddresses.strategy,
    currentStrat.nameToken0,
    currentStrat.nameToken1
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

// 2,011,657 gas units to deploy
// average 6.9 gwei / unit on bsc scan
// = 13880433.3 gwei
// = 35.46 US dollars
