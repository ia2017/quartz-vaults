import { StratShareLpDeployConfig } from "../../../utils/deploy-util";
import { TOKENS } from "../../data/tokens";
import {
  DAO_FUND_ADDRESS_AVALANCHE,
  DEFAULT_KEEPER_ADDRESS_AVALANCHE,
  DEFAULT_STRATEGIST_ADDRESS_AVALANCHE,
  PAIR_GRAVE_AVAX_ADDRESS,
  TRADERJOE_ROUTER_ADDRESS,
  REWARD_POOL_ADDRESS_GRAVE,
} from "./avax-addresses";

// Output to native = ASHARE -> UST
const _outputToNativeRoute: string[] = [
  TOKENS.GRAVE.AVALANCHE,
  TOKENS.AVAX.AVALANCHE,
];

// Token0: AVAX
const _outputToLp0Route: string[] = [TOKENS.GSHARE.AVALANCHE, TOKENS.AVAX.AVALANCHE]; // Change this

// Token1: GRAVE
const _outputToLp1Route: string[] = [TOKENS.GSHARE.AVALANCHE,TOKENS.AVAX.AVALANCHE, TOKENS.GRAVE.AVALANCHE];

export const nameToken0 = "AVAX"; 
export const nameToken1 = "GRAVE";

export const constructorArgs: StratShareLpDeployConfig = {
  want: PAIR_GRAVE_AVAX_ADDRESS,
  poolId: 3,
  chefAddress: REWARD_POOL_ADDRESS_GRAVE,
  vault: null,
  router: TRADERJOE_ROUTER_ADDRESS,
  keeper: DEFAULT_KEEPER_ADDRESS_AVALANCHE,
  strategist: DEFAULT_STRATEGIST_ADDRESS_AVALANCHE,
  protocolFeeRecipient: DAO_FUND_ADDRESS_AVALANCHE, // Check charge fees function
  _outputToNativeRoute,
  _outputToLp0Route,
  _outputToLp1Route,
  _protocolLp0Route: [TOKENS.AVAX.AVALANCHE],
  _protocolLp1Route: [TOKENS.AVAX.AVALANCHE, TOKENS.GRAVE.AVALANCHE],
  _protocolPairAddress: PAIR_GRAVE_AVAX_ADDRESS,
  _burnTokenAddress: TOKENS.GRAVE.AVALANCHE,
  _nativeToBuybackRoute: [TOKENS.AVAX.AVALANCHE, TOKENS.GRAVE.AVALANCHE]
};

export const STRAT_PROTO_GRAVE_AVAX = {
  nameToken0,
  nameToken1,
  constructorArgs,
};
