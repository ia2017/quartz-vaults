import { StratSingleStakeConfig } from "../../../utils/deploy-util";
import { TOKENS } from "../../data/tokens";
import {
  DAO_FUND_ADDRESS_BSC,
  DEFAULT_KEEPER_ADDRESS_BSC,
  DEFAULT_STRATEGIST_ADDRESS_BSC,
  PANCAKESWAP_ROUTER_ADDRESS,
  REWARD_POOL_ADDRESS_BSC,
} from "./bsc-addresses";

const constructorArgs: StratSingleStakeConfig = {
  want: TOKENS.QSHARE.BSC,
  poolId: 4,
  chefAddress: REWARD_POOL_ADDRESS_BSC,
  vault: "",
  router: PANCAKESWAP_ROUTER_ADDRESS,
  keeper: DEFAULT_KEEPER_ADDRESS_BSC,
  strategist: DEFAULT_STRATEGIST_ADDRESS_BSC,
  protocolFeeRecipient: DAO_FUND_ADDRESS_BSC,

  // Reward token: ASHARE
  // ASHARE -> UST -> BNB
  _outputToNativeRoute: [TOKENS.ASHARE.BSC, TOKENS.UST.BSC, TOKENS.BNB.BSC],

  // ASHARE -> UST -> 1QSHARE
  _outputToWant: [TOKENS.ASHARE.BSC, TOKENS.UST.BSC, TOKENS.QSHARE.BSC],
};

export const STRAT_SINGLE_STAKE_1QSHARE_BSC = {
  tokenName: "1QSHARE",
  constructorArgs,
};
