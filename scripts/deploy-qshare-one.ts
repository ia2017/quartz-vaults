import { ethers } from "hardhat";
import { VAULT_QSHARE_ONE_ADDRESS } from "./data";
import {
  HARMONY_wONE_ADDRESS,
  JEWEL_ADDRESS,
  QSHARE_ADDRESS,
  QUARTZ_ADDRESS,
  UST_ADDRESS,
} from "./tokens";

// QShare-ONE LP address
const WANT = "0x157e2E205b8d307501F1AAd1C5C96c562e6f07c5";

const POOL_ID = 1;

// Reward Pool
const CHEF_ADDRESS = "0x1da194F8baf85175519D92322a06b46A2638A530";

const VAULT_ADDRESS = VAULT_QSHARE_ONE_ADDRESS;

// DFK Harmony Router
const ROUTER_ADDRESS = "0x24ad62502d1c652cc7684081169d04896ac20f30";

// Placeholder address, Keeper is an extra additional account to give access to the strategy as needed
const KEEPER_ADDRESS = "0x570108E54d11348BD3734FF73dc55eC52c28d3EF";

// Dev account address
const STRATEGIST_ADDRESS = "0x570108E54d11348BD3734FF73dc55eC52c28d3EF";

// Quartz DAO Fund
const PROTOCOL_FEE_RECEPIENT = "0xEE07b8Ee4D827F7EDAC3FFA7bf1a84B8c816623A";

// QShare -> WONE/ONE
const _outputToNativeRoute: string[] = [QSHARE_ADDRESS, HARMONY_wONE_ADDRESS];

// QShare -> WONE/ONE
const _outputToLp0Route: string[] = [QSHARE_ADDRESS, HARMONY_wONE_ADDRESS];

// QShare
const _outputToLp1Route: string[] = [QUARTZ_ADDRESS];

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
