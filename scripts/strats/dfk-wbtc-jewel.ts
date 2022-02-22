import { ethers } from "hardhat";
import {
  DFK_ROUTER_ADDRESS_HARMONY,
  QUARTZ_DAO_ADDRESS_HARMONY,
  QUARTZ_REWARD_POOL_ADDRESS_HARMONY,
  TEST_KEEPER_ADDRESS,
  TEST_STRATEGIST_ADDRESS,
} from "../common-contracts";
import {
  ETH_ADDRESS,
  HARMONY_wONE_ADDRESS,
  JEWEL_ADDRESS,
  WBTC_ADDRESS,
} from "../harmony-tokens";

// Quartz-UST LP address
const WANT = "0x0AcCE15D05B4BA4dBEdFD7AFD51EA4FA1592f75E";

const POOL_ID = 7;

// Reward Pool
const CHEF_ADDRESS = QUARTZ_REWARD_POOL_ADDRESS_HARMONY;

// Deploy strategy and then updating its vault with setVault() seems to be easiest for now
const VAULT_ADDRESS = ethers.constants.AddressZero;

// DFK Harmony Router
const ROUTER_ADDRESS = DFK_ROUTER_ADDRESS_HARMONY;

// Placeholder address, Keeper is an extra additional account to give access to the strategy as needed
const KEEPER_ADDRESS = TEST_KEEPER_ADDRESS;

// Dev account address
const STRATEGIST_ADDRESS = TEST_STRATEGIST_ADDRESS;

// Quartz DAO Fund
const PROTOCOL_FEE_RECEPIENT = QUARTZ_DAO_ADDRESS_HARMONY;

// JEWEL -> ONE
const _outputToNativeRoute: string[] = [JEWEL_ADDRESS, HARMONY_wONE_ADDRESS];

// Token0 = WBTC
// JEWEL -> ETH -> WBTC ??
const _outputToLp0Route: string[] = [JEWEL_ADDRESS, ETH_ADDRESS, WBTC_ADDRESS];

// Token1 = JEWEL
// JEWEL
const _outputToLp1Route: string[] = [JEWEL_ADDRESS];

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
