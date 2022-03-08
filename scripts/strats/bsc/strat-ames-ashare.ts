import {
  DAO_FUND_ADDRESS_BSC,
  DEFAULT_KEEPER_ADDRESS_BSC,
  DEFAULT_STRATEGIST_ADDRESS_BSC,
  PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
  PANCAKESWAP_ROUTER_ADDRESS,
  REWARD_POOL_ADDRESS_BSC,
} from "./bsc-addresses";
import { TOKENS } from "../../data/tokens";
import { StratCommonDeployConfig } from "../../../utils/deploy-util";

// Output = ASHARE -> UST -> BNB
const _outputToNativeRoute: string[] = [
  TOKENS.ASHARE.BSC,
  TOKENS.UST.BSC,
  TOKENS.BNB.BSC,
];

// Token0: AMETHYST
// ASHARE -> UST -> AMETHYST
const _outputToLp0Route: string[] = [
  TOKENS.ASHARE.BSC,
  TOKENS.UST.BSC,
  TOKENS.AMETHYST.BSC,
];

// Token1: ASHARE
//  ASHARE
const _outputToLp1Route: string[] = [TOKENS.ASHARE.BSC];

export const nameToken0 = "AMETHYST";
export const nameToken1 = "ASHARE";

export const constructorArgs: StratCommonDeployConfig = {
  want: PAIR_AMETHYST_ASHARE_PAIR_ADDRESS_BSC,
  poolId: 5,
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

export const STRAT_AMETHYST_ASHARE_BSC = {
  nameToken0,
  nameToken1,
  constructorArgs,
};
