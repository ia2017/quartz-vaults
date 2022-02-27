import { ethers } from "hardhat";
import {
  DEFAULT_KEEPER_ADDRESS_BSC,
  DEFAULT_STRATEGIST_ADDRESS_BSC,
} from "./bsc/bsc-addresses";

// Pair/LP address
const WANT = "";

const POOL_ID = -1;

// Reward Pool
const CHEF_ADDRESS = "";

// Deploy strategy and then updating its vault with setVault() seems to be easiest for now
const VAULT_ADDRESS = ethers.constants.AddressZero;

const ROUTER_ADDRESS = "";

// Placeholder address, Keeper is an extra additional account to give access to the strategy as needed
const KEEPER_ADDRESS = DEFAULT_KEEPER_ADDRESS_BSC;

// Dev account address
const STRATEGIST_ADDRESS = DEFAULT_STRATEGIST_ADDRESS_BSC;

// Quartz DAO Fund
const PROTOCOL_FEE_RECEPIENT = "";

//
const _outputToNativeRoute: string[] = [];

// Token0:
//
const _outputToLp0Route: string[] = [];

// Token1:
//
const _outputToLp1Route: string[] = [];

const args = [
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
  _outputToLp1Route,
];

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
