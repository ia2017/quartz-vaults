import {
  DAO_FUND_ADDRESS_BSC,
  DEFAULT_KEEPER_ADDRESS_BSC,
  DEFAULT_STRATEGIST_ADDRESS_BSC,
  PAIR_AMETHYST_UST_ADDRESS,
  PANCAKESWAP_ROUTER_ADDRESS,
  REWARD_POOL_ADDRESS_BSC,
} from "./bsc-addresses";
import { TOKENS } from "../../data/tokens";
import { StratCommonDeployConfig } from "../../../utils/deploy-util";

// Output = ASHARE: ASHARE -> UST -> BNB
const _outputToNativeRoute: string[] = [
  TOKENS.ASHARE.BSC,
  TOKENS.UST.BSC,
  TOKENS.BNB.BSC,
];

// Token0 = UST: ASHARE -> UST
const _outputToLp0Route: string[] = [TOKENS.ASHARE.BSC, TOKENS.UST.BSC];

// Token1 = AMES: ASHARE -> UST -> AMES
const _outputToLp1Route: string[] = [
  TOKENS.ASHARE.BSC,
  TOKENS.UST.BSC,
  TOKENS.AMETHYST.BSC,
];

export const nameToken0 = "UST";
export const nameToken1 = "AMETHYST";

export const constructorArgs: StratCommonDeployConfig = {
  want: PAIR_AMETHYST_UST_ADDRESS,
  poolId: 0,
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

export const STRAT_UST_AMETHYST_BSC = {
  nameToken0,
  nameToken1,
  constructorArgs,
};
