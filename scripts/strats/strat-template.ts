import { ethers } from "hardhat";
import {} from "../harmony-tokens";

// Quartz-UST LP address
const WANT = "";

const POOL_ID = -1;

// Reward Pool
const CHEF_ADDRESS = "";

// Deploy strategy and then updating its vault with setVault() seems to be easiest for now
const VAULT_ADDRESS = ethers.constants.AddressZero;

// DFK Harmony Router
const ROUTER_ADDRESS = "";

// Placeholder address, Keeper is an extra additional account to give access to the strategy as needed
const KEEPER_ADDRESS = "";

// Dev account address
const STRATEGIST_ADDRESS = "";

// Quartz DAO Fund
const PROTOCOL_FEE_RECEPIENT = "";

//
const _outputToNativeRoute: string[] = [];

//
const _outputToLp0Route: string[] = [];

//
const _outputToLp1Route: string[] = [];

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
