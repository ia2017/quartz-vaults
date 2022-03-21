// import { predictAddresses } from "../utils/predictAddresses";
// import {  deployStrategyCommon, deployStrategySharesLP } from "../utils/deploy-util";
// import { STRAT_SHARES_BSC } from "./strats/bsc/strat-shares-ust-lp";

// async function main() {
//   const currentStrat = STRAT_SHARES_BSC;

//   const predictedAddresses = await predictAddresses();

//   const vault = await deployStrategySharesLP(
//     predictedAddresses.strategy,
//     currentStrat.nameToken0,
//     currentStrat.nameToken1
//   );

//   currentStrat.constructorArgs.vault = vault.address;

//   // Update rewards check function name to match our reward pool/chef name
//   const strategy = await deployStrategyCommon(currentStrat.constructorArgs);

//   const tx = await strategy.setPendingRewardsFunctionName("pendingShare");
//   await tx.wait(1);

//   console.log({
//     vault: vault.address,
//     strategy: strategy.address,
//   });

//   let verifyArgs = "";
//   Object.values(currentStrat.constructorArgs).forEach((arg) => {
//     if (Array.isArray(arg)) {
//       verifyArgs += `"${JSON.stringify(arg)}"` + " ";
//     } else {
//       verifyArgs += typeof arg === "number" ? arg + " " : `"${arg}" `;
//     }
//   });

//   console.log(verifyArgs);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
