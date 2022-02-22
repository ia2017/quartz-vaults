import { ethers } from "hardhat";

import {
  HARMONY_wONE_ADDRESS,
  JEWEL_ADDRESS,
  QSHARE_ADDRESS,
  QUARTZ_ADDRESS,
  UST_ADDRESS,
} from "../tokens";

// Quartz-UST LP address
const WANT = "0x90a48cb3a724ef6f8e6240f4788559f6370b6925";

const POOL_ID = 0;

// Reward Pool
const CHEF_ADDRESS = "0x1da194F8baf85175519D92322a06b46A2638A530";

const VAULT_ADDRESS = "";

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

// QShare -> WONE/ONE -> UST
const _outputToLp0Route: string[] = [
  QSHARE_ADDRESS,
  HARMONY_wONE_ADDRESS,
  JEWEL_ADDRESS,
  UST_ADDRESS,
];

// QShare -> WONE -> UST -> Quartz
const _outputToLp1Route: string[] = [
  QSHARE_ADDRESS,
  HARMONY_wONE_ADDRESS,
  UST_ADDRESS,
  QUARTZ_ADDRESS,
];

async function main() {
  if (!VAULT_ADDRESS) {
    throw new Error("ADD ADDRESS");
  }

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
    ethers.constants.AddressZero,
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
