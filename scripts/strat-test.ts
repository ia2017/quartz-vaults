import { ethers } from "hardhat";
import {
  DEFAULT_KEEPER_ADDRESS_BSC,
  DEFAULT_STRATEGIST_ADDRESS_BSC,
} from "./strats/bsc/bsc-addresses";

// Pair/LP address
const WANT = "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684"; // Bsc - USDT

const POOL_ID = 0;

// Reward Pool
const CHEF_ADDRESS = "0xccb9c252031f062272a149866899c60dc7388013";

// Deploy strategy and then updating its vault with setVault() seems to be easiest for now
const VAULT_ADDRESS = ethers.constants.AddressZero;

const ROUTER_ADDRESS = "0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3";

// Placeholder address, Keeper is an extra additional account to give access to the strategy as needed
const KEEPER_ADDRESS = DEFAULT_KEEPER_ADDRESS_BSC;

// Dev account address
const STRATEGIST_ADDRESS = DEFAULT_STRATEGIST_ADDRESS_BSC;

// Quartz DAO Fund
const PROTOCOL_FEE_RECEPIENT = "0x2b42f9b0ab98ACEa2D4ba7fa2Daf68D3a7dA7971";  // my dev address

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
