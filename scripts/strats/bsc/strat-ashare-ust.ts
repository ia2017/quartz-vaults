import { ethers } from "hardhat";
import {
  DEFAULT_KEEPER_ADDRESS,
  DEFAULT_STRATEGIST_ADDRESS,
} from "../../data/data";
import { TOKENS } from "../../data/tokens";
import {
  DAO_FUND_ADDRESS_BSC,
  PAIR_ASHARE_UST_ADDRESS,
  PANCAKESWAP_ROUTER_ADDRESS,
  REWARD_POOL_ADDRESS_BSC,
} from "./bsc-data";

// Pair/LP address
const WANT = PAIR_ASHARE_UST_ADDRESS;

const POOL_ID = 1;

// Reward Pool
const CHEF_ADDRESS = REWARD_POOL_ADDRESS_BSC;

// Deploy strategy and then updating its vault with setVault() seems to be easiest for now
const VAULT_ADDRESS = ethers.constants.AddressZero;

const ROUTER_ADDRESS = PANCAKESWAP_ROUTER_ADDRESS;

// Placeholder address, Keeper is an extra additional account to give access to the strategy as needed
const KEEPER_ADDRESS = DEFAULT_KEEPER_ADDRESS;

// Dev account address
const STRATEGIST_ADDRESS = DEFAULT_STRATEGIST_ADDRESS;

// Quartz DAO Fund
const PROTOCOL_FEE_RECEPIENT = DAO_FUND_ADDRESS_BSC;

// Output to native = ASHARE -> UST -> BNB
const _outputToNativeRoute: string[] = [
  TOKENS.ASHARE.BSC,
  TOKENS.UST.BSC,
  TOKENS.BNB.BSC,
];

// UST
// ASHARE -> UST
const _outputToLp0Route: string[] = [TOKENS.ASHARE.BSC, TOKENS.UST.BSC];

// ASHARE
const _outputToLp1Route: string[] = [TOKENS.ASHARE.BSC];

async function main() {
  const StrategyQuartzLP = await ethers.getContractFactory("StrategyQuartzLP");
  //   address _want,
  //   uint256 _poolId,
  //   address _chef,
  //   address _vault,
  //   address _unirouter,
  //   address _keeper,
  //   address _strategist,
  //   address _protocolFeeRecipient,
  //   address[] memory _outputToNativeRoute,
  //   address[] memory _outputToLp0Route,

  const strat = await StrategyQuartzLP.deploy(
    WANT,
    POOL_ID,
    CHEF_ADDRESS,
    VAULT_ADDRESS,
    ROUTER_ADDRESS,
    KEEPER_ADDRESS,
    STRATEGIST_ADDRESS,
    PROTOCOL_FEE_RECEPIENT,
    _outputToNativeRoute,
    _outputToLp0Route,
    _outputToLp1Route
  );
  await strat.deployed();
  console.log("StrategyQuartzLP deployed to:", strat.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
