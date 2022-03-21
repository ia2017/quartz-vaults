import { MockProvider } from 'ethereum-waffle';
import { Wallet } from 'ethers';
import { ethers } from 'hardhat'
import { deployMockContract } from '@ethereum-waffle/mock-contract';
import { MockChef, MockRouter, SharesVault, StrategySharesLP } from "../typechain";
import mockChefInfo from "../artifacts/contracts/mocks/MockChef.sol/MockChef.json"
import mockRouterInfo from "../artifacts/contracts/mocks/MockRouter.sol/MockRouter.json"


describe('StrategySharesLP', () => {
	let strategy: StrategySharesLP;

	let name = 'TESTVAULT';
	let symbol = 'TESTVAULT';
	let approvalDelay = 10;
	let dailyDepositLimit = 1;

	let provider: MockProvider;
	let accounts: Wallet[];

	let mockRouter: MockRouter
	let mockChef: MockChef;

	let user;
	
	beforeEach(async () => {
		provider = new MockProvider();
		accounts = provider.getWallets();
		user = accounts[0]

		mockChef = await deployMockContract(user.address, mockChefInfo.abi) as unknown as MockChef
		mockRouter = await deployMockContract(user.address, mockRouterInfo.abi) as unknown as MockRouter

		// const StrategySharesLP = await ethers.getContractFactory("StrategySharesLP");
		// const strat = await StrategySharesLP.deploy(
		// 		sdsd,
		// 		name,
		// 		symbol,
		// 		approvalDelay,
		// 		dailyDepositLimit
		// );
		// strategy = await strat.deployed();
	});

	it('should do things', () => {
		
	});
});