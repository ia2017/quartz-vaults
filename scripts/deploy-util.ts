import { ethers } from "hardhat";
import { predictAddresses } from "../utils/predictAddresses";

export interface VaultDeployConfig {
  tokenName: string;
  tokenSymbol: string;
  approvalDelay: number;
  vaultName: string;
  strategyName: string;
  stratArgs: any[];
}

export interface StratCommonDeployConfig {
  want: string;
  poolId: number;
  chefAddress: string;
  vault: string;
  router: string;
  keeper: string;
  strategist: string;
  protocolFeeRecipient: string;
  _outputToNativeRoute: string[];
  _outputToLp0Route: string[];
  _outputToLp1Route: string[];
}

export const deployCommonVault = async (
  nameToken0: string,
  nameToken1: string,
  stratArgs: StratCommonDeployConfig
) => {
  const predictedAddresses = await predictAddresses();

  const Vault = await ethers.getContractFactory("QuartzVault");
  const vault = await Vault.deploy(
    predictedAddresses.strategy,
    `Quartz ${nameToken0}-${nameToken1} Vault LP`,
    `qtz${nameToken0}-${nameToken1}-VLP`,
    10
  );
  await vault.deployed();
  console.log("QuartzVault deployed to:", vault.address);
  console.log(
    `predicted: ${predictedAddresses.vault} - actual: ${vault.address}`
  );
  const strategy = await deployStrategyCommon(vault.address, stratArgs);

  return { vault, strategy };
};

export const deployStrategyCommon = async (
  vaultAddress: string,
  stratArgs: StratCommonDeployConfig
) => {
  const Strategy = await ethers.getContractFactory("StrategyQuartzLP");

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
  const strategy = await Strategy.deploy(
    stratArgs.want,
    stratArgs.poolId,
    stratArgs.chefAddress,
    vaultAddress,
    stratArgs.router,
    stratArgs.keeper,
    stratArgs.strategist,
    stratArgs.protocolFeeRecipient,
    stratArgs._outputToNativeRoute,
    stratArgs._outputToLp0Route,
    stratArgs._outputToLp1Route
  );

  await strategy.deployed();
  console.log("StrategyQuartzLP deployed to:", strategy.address);
};
