import { ethers } from "hardhat";
import { QuartzVault, StrategyQuartzLP } from "../typechain";
import { predictAddresses } from "./predictAddresses";
import * as fs from "fs-extra";

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

export interface StratSingleStakeConfig {
  want: string;
  poolId: number;
  chefAddress: string;
  vault: string;
  router: string;
  keeper: string;
  strategist: string;
  protocolFeeRecipient: string;
  _outputToNativeRoute: string[];
  _outputToWant: string[];
}

export const deployCommonVault = async (
  strategyAddress: string,
  nameToken0: string,
  nameToken1: string
) => {
  const predictedAddresses = await predictAddresses();

  const Vault = await ethers.getContractFactory("QuartzVault");
  const vaultArgs = {
    strategyAddress,
    tokenName: `Quartz ${nameToken0}-${nameToken1} Vault LP`,
    tokenSymbol: `qtz${nameToken0}-${nameToken1}-VLP`,
    approvalDelay: 10,
  };
  const vault = await Vault.deploy(
    vaultArgs.strategyAddress,
    vaultArgs.tokenName,
    vaultArgs.tokenSymbol,
    vaultArgs.approvalDelay
  );
  await vault.deployed();
  console.log("QuartzVault deployed to:", vault.address);
  console.log(
    `predicted: ${predictedAddresses.vault} - actual: ${vault.address}`
  );

  return vault;
};

export const deploySingleStakeVault = async (
  strategyAddress: string,
  tokenName: string
) => {
  const predictedAddresses = await predictAddresses();

  const Vault = await ethers.getContractFactory("QuartzVault");
  const vaultArgs = {
    strategyAddress,
    tokenName: `Quartz ${tokenName} Vault LP`,
    tokenSymbol: `qtz${tokenName}-VLP`,
    approvalDelay: 10,
  };
  const vault = await Vault.deploy(
    vaultArgs.strategyAddress,
    vaultArgs.tokenName,
    vaultArgs.tokenSymbol,
    vaultArgs.approvalDelay
  );
  await vault.deployed();
  console.log("QuartzVault deployed to:", vault.address);
  console.log(
    `predicted: ${predictedAddresses.vault} - actual: ${vault.address}`
  );

  return vault;
};

export const deployStrategyCommon = async (
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
    stratArgs.vault,
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
  return strategy;
};

export const deployStrategySingleStake = async (
  stratArgs: StratSingleStakeConfig
) => {
  const Strategy = await ethers.getContractFactory("StrategyQuartzSingleStake");
  // address _want,
  // uint256 _poolId,
  // address _chef,
  // address _vault,
  // address _unirouter,
  // address _keeper,
  // address _strategist,
  // address _protocolFeeRecipient,
  // address[] memory _outputToNativeRoute,
  // address[] memory _outputToWantRoute
  const strategy = await Strategy.deploy(
    stratArgs.want,
    stratArgs.poolId,
    stratArgs.chefAddress,
    stratArgs.vault,
    stratArgs.router,
    stratArgs.keeper,
    stratArgs.strategist,
    stratArgs.protocolFeeRecipient,
    stratArgs._outputToNativeRoute,
    stratArgs._outputToWant
  );

  await strategy.deployed();
  console.log("StrategyQuartzSingleStake deployed to:", strategy.address);
  return strategy;
};

export const saveVaultData = async (
  vault: QuartzVault,
  stratArgs: StratCommonDeployConfig,
  chainId: number
) => {
  try {
    // const data = await fs.readJSON();
  } catch (error) {
    throw error;
  }
};
