import { StratProtocolSingleStakeConfig } from "../../../utils/deploy-util";
import { TOKENS } from "../../data/tokens";
import {
  DAO_FUND_ADDRESS_BSC,
  DEFAULT_KEEPER_ADDRESS_BSC,
  DEFAULT_STRATEGIST_ADDRESS_BSC,
  PANCAKESWAP_ROUTER_ADDRESS,
  REWARD_POOL_ADDRESS_BSC,
} from "./bsc-addresses";
import { STRAT_PROTOCOL_ARGS } from "./common-proto-strat-args";

const constructorArgs: StratProtocolSingleStakeConfig = {
  want: TOKENS.AMETHYST.BSC,
  poolId: 6,
  chefAddress: REWARD_POOL_ADDRESS_BSC,
  vault: "",
  router: PANCAKESWAP_ROUTER_ADDRESS,
  keeper: DEFAULT_KEEPER_ADDRESS_BSC,
  strategist: DEFAULT_STRATEGIST_ADDRESS_BSC,
  protocolFeeRecipient: DAO_FUND_ADDRESS_BSC,

  // Reward token: ASHARE
  // ASHARE -> UST
  _outputToNativeRoute: [TOKENS.ASHARE.BSC, TOKENS.UST.BSC],

  // AMETHYST
  // ASHARE -> UST -> AMETHYST
  _outputToWant: [TOKENS.ASHARE.BSC, TOKENS.UST.BSC, TOKENS.AMETHYST.BSC],
  
  ...STRAT_PROTOCOL_ARGS
};

export const STRAT_PROTOCOL_SINGLE_STAKE_AMETHYST_BSC = {
  tokenName: "AMETHYST",
  constructorArgs,
};
