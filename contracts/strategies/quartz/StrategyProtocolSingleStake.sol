// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

import "../../interfaces/common/IUniswapRouterETH.sol";
import "../../interfaces/common/IUniswapV2Pair.sol";
import "../../interfaces/common/IMasterChef.sol";
import "../common/StratManager.sol";
import "../common/FeeManager.sol";
import "../../utils/StringUtils.sol";

contract StrategyProtocolSingleStake is StratManager, FeeManager {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    // Tokens used
    address public native;
    address public output;
    address public want;

    // Third party contracts
    address public chef;
    uint256 public poolId;

    bool public harvestOnDeposit;
    uint256 public lastHarvest;
    string public pendingRewardsFunctionName;

    // Routes
    address[] public outputToNativeRoute;
    address[] public outputToWantRoute;

    // ======== PROTOCOL SUPPORT ITEMS ======== //

    // Core LP pool for protocol
    address public protocolPairAddress;

    // Address of token used in buyback and burns
    address public burnTokenAddress;

    // Token0 in protocol core LP pair
    address public protocolLpToken0;

    // Token1 in protocol core LP pair
    address public protocolLpToken1;

    // Routing path from native to Token0 in core pair
    address[] public protocolLp0Route;

    // Routing path from native to Token1 in core pair
    address[] public protocolLp1Route;

    // Route used to swap native to burn token
    address[] public nativeToBuybackRoute;

    // openzeppelin ERC20 safety transfer checks require dead address instead of zero
    address public constant BURN_ADDRESS =
        0x000000000000000000000000000000000000dEaD;

    event ProtocolLiquidity(
        uint256 indexed amountA,
        uint256 indexed amountB,
        uint256 indexed liquidity
    );

    event TreasuryFeeTransfer(uint256 indexed amount);

    event BuyBackAndBurn(uint256 indexed amount);

    // ===== GENERAL EVENTS ===== //

    event StratHarvest(
        address indexed harvester,
        uint256 indexed wantHarvested,
        uint256 indexed tvl
    );
    event Deposit(address indexed who, uint256 indexed tvl);
    event Withdraw(address indexed who, uint256 indexed tvl);

    constructor(
        address _want,
        uint256 _poolId,
        address _chef,
        address _vault,
        address _unirouter,
        address _keeper,
        address _strategist,
        address _protocolFeeRecipient,
        address[] memory _outputToNativeRoute,
        address[] memory _outputToWantRoute,
        address[] memory _protocolLp0Route,
        address[] memory _protocolLp1Route,
        address _protocolPairAddress,
        address _burnTokenAddress,
        address[] memory _nativeToBuybackRoute
    )
        public
        StratManager(
            _keeper,
            _strategist,
            _unirouter,
            _vault,
            _protocolFeeRecipient
        )
    {
        want = _want;
        poolId = _poolId;
        chef = _chef;

        output = _outputToNativeRoute[0];
        native = _outputToNativeRoute[_outputToNativeRoute.length - 1];
        outputToNativeRoute = _outputToNativeRoute;

        require(
            _outputToWantRoute[0] == output,
            "outputToWantRoute[0] != output"
        );
        require(
            _outputToWantRoute[_outputToWantRoute.length - 1] == want,
            "!want"
        );
        outputToWantRoute = _outputToWantRoute;

        /**
            Protocol specific setup
         */

        require(_protocolPairAddress != address(0), "!_protocolPairAddress");
        protocolPairAddress = _protocolPairAddress;

        protocolLpToken0 = IUniswapV2Pair(protocolPairAddress).token0();
        require(
            _protocolLp0Route[_protocolLp0Route.length - 1] == protocolLpToken0,
            "_protocolLp0Route[last] != protocolLpToken0"
        );
        require(
            _protocolLp0Route[0] == native,
            "_protocolLp0Route[last] != native"
        );
        protocolLp0Route = _protocolLp0Route;

        protocolLpToken1 = IUniswapV2Pair(protocolPairAddress).token1();
        require(
            _protocolLp1Route[_protocolLp1Route.length - 1] == protocolLpToken1,
            "_protocolLp1Route[last] != protocolLpToken0"
        );
        require(
            _protocolLp1Route[0] == native,
            "_protocolLp1Route[last] != native"
        );
        protocolLp1Route = _protocolLp1Route;

        require(_burnTokenAddress != address(0), "!_burnTokenAddress");
        burnTokenAddress = _burnTokenAddress;

        require(
            _nativeToBuybackRoute[0] == native,
            "_nativeToBuybackRoute[0] != native"
        );
        require(
            _nativeToBuybackRoute[_nativeToBuybackRoute.length - 1] ==
                burnTokenAddress,
            "_nativeToBuybackRoute[last] != burnTokenAddress"
        );
        nativeToBuybackRoute = _nativeToBuybackRoute;

        _giveAllowances();
    }

    // puts the funds to work
    function deposit() public whenNotPaused {
        uint256 wantBal = balanceOfWant();

        if (wantBal > 0) {
            IMasterChef(chef).deposit(poolId, wantBal);
            emit Deposit(msg.sender, balanceOf());
        }
    }

    function withdraw(uint256 _amount) external {
        require(msg.sender == vault, "!vault");

        uint256 wantBal = IERC20(want).balanceOf(address(this));

        if (wantBal < _amount) {
            IMasterChef(chef).withdraw(poolId, _amount.sub(wantBal));
            wantBal = IERC20(want).balanceOf(address(this));
        }

        if (wantBal > _amount) {
            wantBal = _amount;
        }

        if (tx.origin != owner() && !paused()) {
            uint256 withdrawalFeeAmount = wantBal.mul(withdrawalFee).div(
                WITHDRAWAL_MAX
            );
            wantBal = wantBal.sub(withdrawalFeeAmount);

            // Subtract protocol portion and send to treasury
            uint256 protocolWithdrawalFeeAmount = wantBal
                .mul(protocolWithdrawalFee)
                .div(MAX_FEE);

            wantBal = wantBal.sub(protocolWithdrawalFeeAmount);
            IERC20(want).safeTransfer(
                protocolFeeRecipient,
                protocolWithdrawalFeeAmount
            );
        }

        IERC20(want).safeTransfer(vault, wantBal);

        emit Withdraw(msg.sender, balanceOf());
    }

    function beforeDeposit() external override {
        if (harvestOnDeposit) {
            require(msg.sender == vault, "!vault");
            _harvest(tx.origin);
        }
    }

    function harvest(address callFeeRecipient) external virtual {
        _harvest(callFeeRecipient);
    }

    function managerHarvest() external onlyManager {
        _harvest(tx.origin);
    }

    // compounds earnings and charges performance fee
    function _harvest(address callFeeRecipient) internal whenNotPaused {
        IMasterChef(chef).deposit(poolId, 0);
        uint256 outputBal = IERC20(output).balanceOf(address(this));
        if (outputBal > 0) {
            chargeFees(callFeeRecipient);
            swapRewards();
            uint256 wantHarvested = balanceOfWant();
            deposit();

            lastHarvest = block.timestamp;
            emit StratHarvest(msg.sender, wantHarvested, balanceOf());
        }
    }

    /// @dev Used to charge fees on harvested rewards before executing the compounding process.
    function chargeFees(address callFeeRecipient) internal {
        // 6% base fee
        // After call and strategist fees a 3 way split for:
        // - Treasury
        // - Core protocol LP (protocol owned)
        // - Buy and burn of core token

        uint256 rewardTokenBalance = IERC20(output)
            .balanceOf(address(this))
            .mul(6)
            .div(100);

        // Convert whatever the reward token is into the desired output token for rewards
        IUniswapRouterETH(unirouter).swapExactTokensForTokens(
            rewardTokenBalance,
            0,
            outputToNativeRoute,
            address(this),
            now
        );

        uint256 nativeBal = IERC20(native).balanceOf(address(this));

        uint256 callFeeAmount = nativeBal.mul(callFee).div(MAX_FEE);
        IERC20(native).safeTransfer(callFeeRecipient, callFeeAmount);

        uint256 strategistFee = nativeBal.mul(STRATEGIST_FEE).div(MAX_FEE);
        IERC20(native).safeTransfer(strategist, strategistFee);

        //  Handle protocol items

        // Remaining gets evenly distributed to the 3 protocol support items
        nativeBal = IERC20(native).balanceOf(address(this));

        // 1/3 of remaining as standard transfer of stables to treasury
        IERC20(native).safeTransfer(protocolFeeRecipient, nativeBal.div(3));

        // Add Protocol Owned Liquidity
        nativeBal = IERC20(native).balanceOf(address(this));
        // Half of remaining, leaving rest for buyback and burn
        _addProtocolLiquidity(nativeBal.div(2));

        // Send whatever remaining balance to get swapped to furnance
        _doBuybackAndBurn(IERC20(native).balanceOf(address(this)));
    }

    // swap rewards to {want}
    function swapRewards() internal {
        if (want != output) {
            uint256 outputBal = IERC20(output).balanceOf(address(this));
            IUniswapRouterETH(unirouter).swapExactTokensForTokens(
                outputBal,
                0,
                outputToWantRoute,
                address(this),
                now
            );
        }
    }

    // calculate the total underlaying 'want' held by the strat.
    function balanceOf() public view returns (uint256) {
        return balanceOfWant().add(balanceOfPool());
    }

    // it calculates how much 'want' this contract holds.
    function balanceOfWant() public view returns (uint256) {
        return IERC20(want).balanceOf(address(this));
    }

    // it calculates how much 'want' the strategy has working in the farm.
    function balanceOfPool() public view returns (uint256) {
        (uint256 _amount, ) = IMasterChef(chef).userInfo(poolId, address(this));
        return _amount;
    }

    function setPendingRewardsFunctionName(
        string calldata _pendingRewardsFunctionName
    ) external onlyManager {
        pendingRewardsFunctionName = _pendingRewardsFunctionName;
    }

    // returns rewards unharvested
    function rewardsAvailable() public view returns (uint256) {
        string memory signature = StringUtils.concat(
            pendingRewardsFunctionName,
            "(uint256,address)"
        );
        bytes memory result = Address.functionStaticCall(
            chef,
            abi.encodeWithSignature(signature, poolId, address(this))
        );
        return abi.decode(result, (uint256));
    }

    // native reward amount for calling harvest
    function callReward() public view returns (uint256) {
        uint256 outputBal = rewardsAvailable();
        uint256 nativeOut;
        if (outputBal > 0) {
            try
                IUniswapRouterETH(unirouter).getAmountsOut(
                    outputBal,
                    outputToNativeRoute
                )
            returns (uint256[] memory amountOut) {
                nativeOut = amountOut[amountOut.length - 1];
            } catch {}
        }

        return nativeOut.mul(6).div(100).mul(callFee).div(MAX_FEE);
    }

    function setHarvestOnDeposit(bool _harvestOnDeposit) external onlyManager {
        harvestOnDeposit = _harvestOnDeposit;

        if (harvestOnDeposit) {
            setWithdrawalFee(0);
        } else {
            setWithdrawalFee(10);
        }
    }

    // called as part of strat migration. Sends all the available funds back to the vault.
    function retireStrat() external {
        require(msg.sender == vault, "!vault");

        IMasterChef(chef).emergencyWithdraw(poolId);

        uint256 wantBal = balanceOfWant();
        IERC20(want).transfer(vault, wantBal);
    }

    // pauses deposits and withdraws all funds from third party systems.
    function panic() public onlyManager {
        pause();
        IMasterChef(chef).emergencyWithdraw(poolId);
    }

    function pause() public onlyManager {
        _pause();

        _removeAllowances();
    }

    function unpause() external onlyManager {
        _unpause();

        _giveAllowances();

        deposit();
    }

    function _giveAllowances() internal {
        IERC20(want).safeApprove(chef, uint256(-1));
        IERC20(output).safeApprove(unirouter, uint256(-1));

        // Protocol token approvals
        IERC20(protocolLpToken0).safeApprove(unirouter, 0);
        IERC20(protocolLpToken0).safeApprove(unirouter, uint256(-1));

        IERC20(protocolLpToken1).safeApprove(unirouter, 0);
        IERC20(protocolLpToken1).safeApprove(unirouter, uint256(-1));

        // Need to approve the pair to access contracts protocol LP pair tokens
        IERC20(protocolLpToken0).safeApprove(protocolPairAddress, uint256(-1));
        IERC20(protocolLpToken1).safeApprove(protocolPairAddress, uint256(-1));

        IERC20(native).safeApprove(unirouter, 0);
        IERC20(native).safeApprove(unirouter, uint256(-1));

        IERC20(protocolPairAddress).safeApprove(unirouter, 0);
        IERC20(protocolPairAddress).safeApprove(unirouter, uint256(-1));
    }

    function _removeAllowances() internal {
        IERC20(want).safeApprove(chef, 0);
        IERC20(output).safeApprove(unirouter, 0);

        IERC20(protocolLpToken0).safeApprove(unirouter, 0);
        IERC20(protocolLpToken1).safeApprove(unirouter, 0);
        IERC20(protocolPairAddress).safeApprove(unirouter, 0);
        IERC20(native).safeApprove(unirouter, 0);
    }

    function outputToNative() external view returns (address[] memory) {
        return outputToNativeRoute;
    }

    function outputToWant() external view returns (address[] memory) {
        return outputToWantRoute;
    }

    /// @dev Allow updating to a more optimal routing path if needed
    function setOutputToNative(address[] memory _path) external onlyManager {
        require(_path[0] == output, "_path[0] != output");

        outputToNativeRoute = _path;
    }

    /// @dev Allow updating to a more optimal routing path if needed
    function setOutputToWant(address[] memory _path) external onlyManager {
        require(_path[0] == output, "_path[0] != output");

        outputToWantRoute = _path;
    }

    // ============================= PROTOCOL ITEMS ================================ //

    /// @dev Takes some of amount of rewards and swaps to and burns the burn token
    function _doBuybackAndBurn(uint256 _amountNativeIn) private {
        IUniswapRouterETH(unirouter).swapExactTokensForTokens(
            _amountNativeIn,
            0,
            nativeToBuybackRoute,
            address(this),
            now
        );

        uint256 burnAmount = IERC20(burnTokenAddress).balanceOf(address(this));
        IERC20(burnTokenAddress).safeTransfer(BURN_ADDRESS, burnAmount);

        emit BuyBackAndBurn(burnAmount);
    }

    /**
     * @dev Uses funds from fees and adds liquidity to core protocol LP pool.
     * LP tokens are transferred to the treasury as Protocol Owned Liquidity.
     * @param _amountNativeToSlpit amount of native that will be div by 2 for LP
     */
    function _addProtocolLiquidity(uint256 _amountNativeToSlpit) private {
        uint256 nativeHalf = _amountNativeToSlpit.div(2);

        if (protocolLpToken0 != native) {
            IUniswapRouterETH(unirouter).swapExactTokensForTokens(
                nativeHalf,
                0,
                protocolLp0Route,
                address(this),
                now
            );
        }

        if (protocolLpToken1 != native) {
            IUniswapRouterETH(unirouter).swapExactTokensForTokens(
                nativeHalf,
                0,
                protocolLp1Route,
                address(this),
                now
            );
        }

        uint256 lpBal0 = IERC20(protocolLpToken0).balanceOf(address(this));
        uint256 lpBal1 = IERC20(protocolLpToken1).balanceOf(address(this));

        // Send liquidity tokens to treasury then for Protocol Own Liquidity
        (
            uint256 amountA,
            uint256 amountB,
            uint256 liquidity
        ) = IUniswapRouterETH(unirouter).addLiquidity(
                protocolLpToken0,
                protocolLpToken1,
                lpBal0,
                lpBal1,
                1,
                1,
                protocolFeeRecipient,
                now
            );

        emit ProtocolLiquidity(amountA, amountB, liquidity);
    }

    /// @dev Allow updating to a more optimal routing path if needed
    function setProtocolOutputToLp0(address[] memory _path)
        external
        onlyManager
    {
        require(_path[0] == native, "protocolLp0Route[0] != native");
        require(
            _path[_path.length - 1] == protocolLpToken0,
            "!path to protocolLpToken0"
        );

        protocolLp0Route = _path;
    }

    /// @dev Allow updating to a more optimal routing path if needed
    function setProtocolOutputToLp1(address[] memory _path)
        external
        onlyManager
    {
        require(_path[0] == native, "protocolLp1Route[0] != native");
        require(
            _path[_path.length - 1] == protocolLpToken1,
            "!path to protocolLpToken1"
        );

        protocolLp1Route = _path;
    }

    /// @dev Option to set burn token to share token if wanted/needed at some point
    function setBurnToken(
        address _burnTokenAddress,
        address[] calldata _nativeToBuybackRoute
    ) external onlyManager {
        require(_burnTokenAddress != address(0), "!_burnTokenAddress");
        require(
            _nativeToBuybackRoute[0] == native,
            "_nativeToBuybackRoute[0] != native"
        );
        require(
            _nativeToBuybackRoute[_nativeToBuybackRoute.length - 1] ==
                _burnTokenAddress,
            "_nativeToBuybackRoute[last] != burnTokenAddress"
        );

        burnTokenAddress = _burnTokenAddress;
        nativeToBuybackRoute = _nativeToBuybackRoute;
    }
}
