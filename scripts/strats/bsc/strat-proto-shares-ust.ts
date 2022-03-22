import { StratShareLpDeployConfig } from "../../../utils/deploy-util";
import { TOKENS } from "../../data/tokens";
import {
  DAO_FUND_ADDRESS_BSC,
  DEFAULT_KEEPER_ADDRESS_BSC,
  DEFAULT_STRATEGIST_ADDRESS_BSC,
  PAIR_AMETHYST_UST_ADDRESS,
  PAIR_ASHARE_UST_ADDRESS,
  PANCAKESWAP_ROUTER_ADDRESS,
  REWARD_POOL_ADDRESS_BSC,
} from "./bsc-addresses";

// Output to native = ASHARE -> UST
const _outputToNativeRoute: string[] = [
  TOKENS.ASHARE.BSC,
  TOKENS.UST.BSC,
];

// Token0: UST
const _outputToLp0Route: string[] = [TOKENS.ASHARE.BSC, TOKENS.UST.BSC];

// Token1: ASHARE
const _outputToLp1Route: string[] = [TOKENS.ASHARE.BSC];

export const nameToken0 = "UST";
export const nameToken1 = "ASHARE";

export const constructorArgs: StratShareLpDeployConfig = {
  want: PAIR_ASHARE_UST_ADDRESS,
  poolId: 1,
  chefAddress: REWARD_POOL_ADDRESS_BSC,
  vault: null,
  router: PANCAKESWAP_ROUTER_ADDRESS,
  keeper: DEFAULT_KEEPER_ADDRESS_BSC,
  strategist: DEFAULT_STRATEGIST_ADDRESS_BSC,
  protocolFeeRecipient: DAO_FUND_ADDRESS_BSC,
  _outputToNativeRoute,
  _outputToLp0Route,
  _outputToLp1Route,
  _protocolLp0Route: [TOKENS.ASHARE.BSC, TOKENS.UST.BSC],
  _protocolLp1Route: [TOKENS.ASHARE.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
  _protocolPairAddress: PAIR_AMETHYST_UST_ADDRESS,
  _burnTokenAddress: TOKENS.AMETHYST.BSC,
  _nativeToBuybackRoute: [TOKENS.UST.BSC, TOKENS.AMETHYST.BSC]
};

export const STRAT_PROTO_SHARES_UST_BSC = {
  nameToken0,
  nameToken1,
  constructorArgs,
};
