import { StratSingleStakeConfig } from "../../../utils/deploy-util";
import { TOKENS } from "../../data/tokens";
import {
  DEFAULT_STRATEGIST_ADDRESS_HARMONY,
  DEV_WALLET_ADDRESS_HARMONY,
  DFK_ROUTER_ADDRESS_HARMONY,
  QUARTZ_ADDRESS_HARMONY,
  DAO_ADDRESS_HARMONY,
  REWARD_POOL_ADDRESS_HARMONY,
} from "./harmony-addresses";

const constructorArgs: StratSingleStakeConfig = {
  want: QUARTZ_ADDRESS_HARMONY,
  poolId: 4,
  chefAddress: REWARD_POOL_ADDRESS_HARMONY,
  vault: "",
  router: DFK_ROUTER_ADDRESS_HARMONY,
  keeper: DEV_WALLET_ADDRESS_HARMONY,
  strategist: DEFAULT_STRATEGIST_ADDRESS_HARMONY,
  protocolFeeRecipient: DAO_ADDRESS_HARMONY,

  // Reward token: QSHARE
  // QSHARE -> ONE
  _outputToNativeRoute: [TOKENS.QSHARE.HARMONY, TOKENS.ONE_WRAPPED.HARMONY],

  // QSHARE -> WONE -> UST -> QUARTZ
  _outputToWant: [
    TOKENS.QSHARE.HARMONY,
    TOKENS.ONE_WRAPPED.HARMONY,
    TOKENS.UST.HARMONY,
    TOKENS.QUARTZ.HARMONY,
  ],
};

export const STRAT_SINGLE_STAKE_QUARTZ_HARMONY = {
  tokenName: "Quartz",
  constructorArgs,
};
