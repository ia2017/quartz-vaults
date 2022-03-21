import { MockProvider } from 'ethereum-waffle';
import { Wallet } from 'ethers';
import { ethers } from 'hardhat'
import { deployMockContract } from '@ethereum-waffle/mock-contract';
import { MockChef, MockRouter, SharesVault } from "../typechain";
import mockChefInfo from "../artifacts/contracts/mocks/MockChef.sol/MockChef.json"
import mockRouterInfo from "../artifacts/contracts/mocks/MockRouter.sol/MockRouter.json"


describe('SharesVault', () => {
	let vault: SharesVault;

	let strategy = ''
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

		const Vault = await ethers.getContractFactory("SharesVault");
		const deploying = await Vault.deploy(
				strategy,
				name,
				symbol,
				approvalDelay,
				dailyDepositLimit
		);
		vault = await deploying.deployed();
	});

	it('should do things', () => {
		
	});
});