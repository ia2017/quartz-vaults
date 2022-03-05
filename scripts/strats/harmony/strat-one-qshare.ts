import { StratCommonDeployConfig } from "../../../utils/deploy-util";
import { TOKENS } from "../../data/tokens";
import {
  DAO_ADDRESS_HARMONY,
  DEFAULT_STRATEGIST_ADDRESS_HARMONY,
  DEV_WALLET_ADDRESS_HARMONY,
  DFK_ROUTER_ADDRESS_HARMONY,
  PAIR_ONE_QSHARE_ADDRESS_HARMONY,
  REWARD_POOL_ADDRESS_HARMONY,
} from "./harmony-addresses";

// Output to native = QSHARE -> ONE
const _outputToNativeRoute: string[] = [
  TOKENS.QSHARE.HARMONY,
  TOKENS.ONE_WRAPPED.HARMONY,
];

// Token0: ONE
// QSHARE -> ONE
const _outputToLp0Route: string[] = [
  TOKENS.QSHARE.HARMONY,
  TOKENS.ONE_WRAPPED.HARMONY,
];

// Token1: QSHARE
// QSHARE
const _outputToLp1Route: string[] = [TOKENS.QSHARE.HARMONY];

export const nameToken0 = "ONE";
export const nameToken1 = "QSHARE";

export const constructorArgs: StratCommonDeployConfig = {
  want: PAIR_ONE_QSHARE_ADDRESS_HARMONY,
  poolId: 2,
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

export const STRAT_ONE_QSHARE_HARMONY = {
  nameToken0,
  nameToken1,
  constructorArgs,
};
