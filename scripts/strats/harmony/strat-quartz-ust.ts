import { StratCommonDeployConfig } from "../../../utils/deploy-util";
import { TOKENS } from "../../data/tokens";
import {
  DAO_ADDRESS_HARMONY,
  DEFAULT_STRATEGIST_ADDRESS_HARMONY,
  DEV_WALLET_ADDRESS_HARMONY,
  DFK_ROUTER_ADDRESS_HARMONY,
  PAIR_UST_QUARTZ_ADDRESS_HARMONY,
  REWARD_POOL_ADDRESS_HARMONY,
} from "./harmony-addresses";

// Output to native = QSHARE -> ONE
const _outputToNativeRoute: string[] = [
  TOKENS.QSHARE.HARMONY,
  TOKENS.ONE_WRAPPED.HARMONY,
];

// Token0: UST
// QSHARE -> UST
const _outputToLp0Route: string[] = [TOKENS.QSHARE.HARMONY, TOKENS.UST.HARMONY];

// Token1: QUARTZ
// QSHARE -> ONE -> UST -> QUARTZ
const _outputToLp1Route: string[] = [
  TOKENS.QSHARE.HARMONY,
  TOKENS.ONE_WRAPPED.HARMONY,
  TOKENS.UST.HARMONY,
  TOKENS.QUARTZ.HARMONY,
];

export const nameToken0 = "UST";
export const nameToken1 = "QUARTZ";

export const constructorArgs: StratCommonDeployConfig = {
  want: PAIR_UST_QUARTZ_ADDRESS_HARMONY,
  poolId: 0,
  chefAddress: REWARD_POOL_ADDRESS_HARMONY,
  vault: null,
  router: DFK_ROUTER_ADDRESS_HARMONY,
  keeper: DEV_WALLET_ADDRESS_HARMONY,
  strategist: DEFAULT_STRATEGIST_ADDRESS_HARMONY,
  protocolFeeRecipient: DAO_ADDRESS_HARMONY,
  _outputToNativeRoute,
  _outputToLp0Route,
  _outputToLp1Route,
};

export const STRAT_UST_QUARTZ_HARMONY = {
  nameToken0,
  nameToken1,
  constructorArgs,
};
