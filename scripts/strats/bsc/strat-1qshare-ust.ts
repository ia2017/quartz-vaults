import { ethers } from "hardhat";
import {
  DAO_FUND_ADDRESS_BSC,
  DEFAULT_KEEPER_ADDRESS_BSC,
  DEFAULT_STRATEGIST_ADDRESS_BSC,
  PAIR_1QSHARE_UST_BSC,
  PANCAKESWAP_ROUTER_ADDRESS,
  REWARD_POOL_ADDRESS_BSC,
} from "./bsc-addresses";
import { TOKENS } from "../../data/tokens";
import { StratCommonDeployConfig } from "../../deploy-util";

// // Pair/LP address
// const WANT = PAIR_1QSHARE_UST_BSC;

// const POOL_ID = 2;

// // Reward Pool
// const CHEF_ADDRESS = REWARD_POOL_ADDRESS_BSC;

// // Deploy strategy and then updating its vault with setVault() seems to be easiest for now
// const VAULT_ADDRESS = ethers.constants.AddressZero;

// const ROUTER_ADDRESS = PANCAKESWAP_ROUTER_ADDRESS;

// // Placeholder address, Keeper is an extra additional account to give access to the strategy as needed
// const KEEPER_ADDRESS = DEFAULT_KEEPER_ADDRESS_BSC;

// // Dev account address
// const STRATEGIST_ADDRESS = DEFAULT_STRATEGIST_ADDRESS_BSC;

// // Quartz DAO Fund
// const PROTOCOL_FEE_RECEPIENT = DAO_FUND_ADDRESS_BSC;

// Output = ASHARE: ASHARE -> UST -> BNB
const _outputToNativeRoute: string[] = [
  TOKENS.ASHARE.BSC,
  TOKENS.UST.BSC,
  TOKENS.BNB.BSC,
];

// Token0 = UST: ASHARE -> UST
const _outputToLp0Route: string[] = [TOKENS.ASHARE.BSC, TOKENS.UST.BSC];

// Token1 = 1QSHARE: ASHARE -> UST -> 1QSHARE
const _outputToLp1Route: string[] = [
  TOKENS.ASHARE.BSC,
  TOKENS.UST.BSC,
  TOKENS.QSHARE.BSC,
];

export const nameToken0 = "UST";
export const nameToken1 = "1QSHARE";

export const constructorArgs: StratCommonDeployConfig = {
  want: PAIR_1QSHARE_UST_BSC,
  poolId: 2,
  chefAddress: REWARD_POOL_ADDRESS_BSC,
  vault: null,
  router: PANCAKESWAP_ROUTER_ADDRESS,
  keeper: DEFAULT_KEEPER_ADDRESS_BSC,
  strategist: DEFAULT_STRATEGIST_ADDRESS_BSC,
  protocolFeeRecipient: DAO_FUND_ADDRESS_BSC,
  _outputToNativeRoute,
  _outputToLp0Route,
  _outputToLp1Route,
};

export const STRAT_UST_1QSHARE_BSC = {
  nameToken0,
  nameToken1,
  constructorArgs,
};

// async function main() {
//   const StrategyQuartzLP = await ethers.getContractFactory("StrategyQuartzLP");
//   const strat = await StrategyQuartzLP.deploy(
//     WANT,
//     POOL_ID,
//     CHEF_ADDRESS,
//     VAULT_ADDRESS,
//     ROUTER_ADDRESS,
//     KEEPER_ADDRESS,
//     STRATEGIST_ADDRESS,
//     PROTOCOL_FEE_RECEPIENT,
//     _outputToNativeRoute,
//     _outputToLp0Route,
//     _outputToLp1Route
//   );
//   await strat.deployed();
//   console.log("StrategyQuartzLP deployed to:", strat.address);
// }

// main().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
