// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./interfaces/quartz/IStrategy.sol";

/**
 * @dev Implementation of a vault to deposit funds for yield optimizing.
 * This is the contract that receives funds and that users interface with.
 * The yield optimizing strategy itself is implemented in a separate 'Strategy.sol' contract.
 */
contract SharesVault is ERC20, Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct StratCandidate {
        address implementation;
        uint256 proposedTime;
    }

    // Cap on amount of LP tokens that can deposited
    uint256 public totalDepositLimit;

    // Cap on the amount any account can have deposited
    uint256 public userDepositLimit;

    // Toggle for whether limits are being set on deposits
    bool public depositLimitsEnabled = true;

    // The last proposed strategy to switch to.
    StratCandidate public stratCandidate;

    // The strategy currently in use by the vault.
    IStrategy public strategy;

    // The minimum time it has to pass before a strat candidate can be approved.
    uint256 public immutable approvalDelay;

    event NewStratCandidate(address implementation);
    event UpgradeStrat(address implementation);

    /**
     * @dev Sets the value of {token} to the token that the vault will
     * hold as underlying value. It initializes the vault's own 'qd' token.
     * This token is minted when someone does a deposit. It is burned in order
     * to withdraw the corresponding portion of the underlying assets.
     * @param _strategy the address of the strategy.
     * @param _name the name of the vault token.
     * @param _symbol the symbol of the vault token.
     * @param _approvalDelay the delay before a new strat can be approved.
     */
    constructor(
        IStrategy _strategy,
        string memory _name,
        string memory _symbol,
        uint256 _approvalDelay,
        uint256 _totalDepositLimit,
        uint256 _userDepositLimit
    ) public ERC20(_name, _symbol) {
        // If using this version of a vault then these values should be provided
        require(_totalDepositLimit > 0, "!_dailyDepositLimit");
        require(_userDepositLimit > 0, "!_userDepositLimit");

        strategy = _strategy;
        approvalDelay = _approvalDelay;
        totalDepositLimit = _totalDepositLimit;
        userDepositLimit = _userDepositLimit;
    }

    function want() public view returns (IERC20) {
        return IERC20(strategy.want());
    }

    /**
     * @dev It calculates the total underlying value of {token} held by the system.
     * It takes into account the vault contract balance, the strategy contract balance
     *  and the balance deployed in other contracts as part of the strategy.
     */
    function balance() public view returns (uint256) {
        return
            want().balanceOf(address(this)).add(
                IStrategy(strategy).balanceOf()
            );
    }

    /**
     * @dev Custom logic in here for how much the vault allows to be borrowed.
     * We return 100% of tokens for now. Under certain conditions we might
     * want to keep some of the system funds at hand in the vault, instead
     * of putting them to work.
     */
    function available() public view returns (uint256) {
        return want().balanceOf(address(this));
    }

    /**
     * @dev Function for various UIs to display the current value of one of our yield tokens.
     * Returns an uint256 with 18 decimals of how much underlying asset one vault share represents.
     */
    function getPricePerFullShare() public view returns (uint256) {
        return
            totalSupply() == 0 ? 1e18 : balance().mul(1e18).div(totalSupply());
    }

    /**
     * @dev A helper function to call deposit() with all the sender's funds.
     */
    function depositAll() external {
        deposit(want().balanceOf(msg.sender));
    }

    /**
     * @dev The entrypoint of funds into the system. People deposit with this function
     * into the vault. The vault is then in charge of sending funds into the strategy.
     */
    function deposit(uint256 _amount) public nonReentrant {
        _checkDepositLimits(_amount);

        // Get current total holdings amount (vault and strat)
        uint256 totalDepositBalance = balance();

        // Allow any setup steps implemented in strategy to run first
        strategy.beforeDeposit();

        // Pull callers tokens to vault
        want().safeTransferFrom(msg.sender, address(this), _amount);

        // Transfer current available `want` amount to strategy and call its `deposit` function after.
        earn();

        // Run checks after transfer into the strategy to determine vault token mint amount
        uint256 _after = balance();
        // Additional check for deflationary tokens
        _amount = _after.sub(totalDepositBalance);

        // Mint the amount vault tokens to the caller according to current deposits in vault
        uint256 shares = 0;
        if (totalSupply() == 0) {
            shares = _amount;
        } else {
            shares = (_amount.mul(totalSupply())).div(totalDepositBalance);
        }

        _mint(msg.sender, shares);
    }

    /**
     * @dev If `depositLimitsEnabled`,
     * this function will run the required checks against the input deposit amount.
     */
    function _checkDepositLimits(uint256 _amountIn) private view {
        if (depositLimitsEnabled) {
            uint256 userDeposits = balanceOf(msg.sender);
            if (userDeposits > 0) {
                // Current deposit amount + incoming should be under the current cap
                uint256 wouldBeTotalDeposits = userDeposits.add(_amountIn);
                require(
                    wouldBeTotalDeposits < userDepositLimit,
                    "Exceeds user deposit limit"
                );

                // Increase of user balance should not exceed current total cap limit for vault
                require(
                    balance().add(wouldBeTotalDeposits) < totalDepositLimit,
                    "Exceeds current total deposit limit"
                );
            } else {
                // If new depositor then just check the deposit does not exceed vaults current total cap
                require(
                    balance().add(_amountIn) < totalDepositLimit,
                    "Exceeds current total deposit limit"
                );
            }
        }
    }

    /**
     * @dev Function to send funds into the strategy and put them to work.
     * Primarily called by the vault's deposit() function.
     */
    function earn() public {
        uint256 _bal = available();
        want().safeTransfer(address(strategy), _bal);
        strategy.deposit();
    }

    /**
     * @dev A helper function to call withdraw() with all the sender's funds.
     */
    function withdrawAll() external {
        withdraw(balanceOf(msg.sender));
    }

    /**
     * @dev Function to exit the system. The vault will withdraw the required tokens
     * from the strategy and pay up the token holder. A proportional number of IOU
     * tokens are burned in the process.
     */
    function withdraw(uint256 _amountSharesOut) public {
        uint256 requestedWithdrawAmount = (balance().mul(_amountSharesOut)).div(
            totalSupply()
        );
        _burn(msg.sender, _amountSharesOut);

        uint256 currentBalance = want().balanceOf(address(this));

        // Then check strat for funds to pull into vault
        if (currentBalance < requestedWithdrawAmount) {
            uint256 withdrawAmount = requestedWithdrawAmount.sub(
                currentBalance
            );
            strategy.withdraw(withdrawAmount);

            // Withdraw fees can be taken in strategies
            // So adjust total returned to caller as needed
            uint256 balanceAfterStratWithdraw = want().balanceOf(address(this));
            uint256 vaultStratBalanceDiff = balanceAfterStratWithdraw.sub(
                currentBalance
            );

            if (vaultStratBalanceDiff < withdrawAmount) {
                requestedWithdrawAmount = currentBalance.add(
                    vaultStratBalanceDiff
                );
            }
        }

        want().safeTransfer(msg.sender, requestedWithdrawAmount);
    }

    /**
     * @dev Sets the candidate for the new strat to use with this vault.
     * @param _implementation The address of the candidate strategy.
     */
    function proposeStrat(address _implementation) public onlyOwner {
        require(
            address(this) == IStrategy(_implementation).vault(),
            "Proposal not valid for this Vault"
        );
        stratCandidate = StratCandidate({
            implementation: _implementation,
            proposedTime: block.timestamp
        });

        emit NewStratCandidate(_implementation);
    }

    /**
     * @dev It switches the active strat for the strat candidate. After upgrading, the
     * candidate implementation is set to the 0x00 address, and proposedTime to a time
     * happening in +100 years for safety.
     */

    function upgradeStrat() public onlyOwner {
        require(
            stratCandidate.implementation != address(0),
            "There is no candidate"
        );
        require(
            stratCandidate.proposedTime.add(approvalDelay) < block.timestamp,
            "Delay has not passed"
        );

        emit UpgradeStrat(stratCandidate.implementation);

        strategy.retireStrat();
        strategy = IStrategy(stratCandidate.implementation);
        stratCandidate.implementation = address(0);
        stratCandidate.proposedTime = 5000000000;

        earn();
    }

    /**
     * @dev Rescues random funds stuck that the strat can't handle.
     * @param _token address of the token to rescue.
     */
    function inCaseTokensGetStuck(address _token) external onlyOwner {
        require(_token != address(want()), "!token");

        uint256 amount = IERC20(_token).balanceOf(address(this));
        IERC20(_token).safeTransfer(msg.sender, amount);
    }

    function setTotalDepositLimit(uint256 _totalDepositLimit)
        external
        onlyOwner
    {
        totalDepositLimit = _totalDepositLimit;
    }

    function setUserDepositLimit(uint256 _userDepositLimit) external onlyOwner {
        userDepositLimit = _userDepositLimit;
    }

    function setDepositLimitEnabaled(bool _enabled) external onlyOwner {
        require(depositLimitsEnabled != _enabled, "No update");

        depositLimitsEnabled = _enabled;
    }
}
