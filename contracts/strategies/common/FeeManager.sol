// SPDX-License-Identifier: MIT

pragma solidity ^0.6.12;

import "./StratManager.sol";

abstract contract FeeManager is StratManager {
    uint256 public constant STRATEGIST_FEE = 112;
    uint256 public constant MAX_FEE = 1000;
    uint256 public constant MAX_CALL_FEE = 111;

    uint256 public constant WITHDRAWAL_FEE_CAP = 50;
    uint256 public constant WITHDRAWAL_MAX = 10000;

    // 100 / 10000 = 1% max
    uint256 public constant PROTOCOL_WITHDRAWAL_FEE_CAP = 100;

    // Used to convert into Protocol Owned Liquidity.
    // 1% default and max value. 100 / WITHDRAWAL_MAX = 1%
    uint256 public protocolWithdrawalFee = 100;

    // Fee taken when a user withdraws to increase base value
    // for remaining remaining depositors.
    uint256 public withdrawalFee = 10;

    uint256 public callFee = 111;
    uint256 public protocolFee = MAX_FEE - STRATEGIST_FEE - callFee;

    event WithdrawFeeUpdate(
        uint256 indexed previousFee,
        uint256 indexed newFee
    );
    event ProtocolWithdrawFeeUpdate(
        uint256 indexed previousFee,
        uint256 indexed newFee
    );

    function setCallFee(uint256 _fee) public onlyManager {
        require(_fee <= MAX_CALL_FEE, "!cap");

        callFee = _fee;
        protocolFee = MAX_FEE - STRATEGIST_FEE - callFee;
    }

    /// @dev Set the withdrawal fee that remains pooled to accrue value for current depositors.
    function setWithdrawalFee(uint256 _fee) public onlyManager {
        require(_fee <= WITHDRAWAL_FEE_CAP, "!cap");

        uint256 previousFee = withdrawalFee;
        withdrawalFee = _fee;
        emit WithdrawFeeUpdate(previousFee, _fee);
    }

    /// @dev Set the protocol portion of the withdrawal fee.
    function setProtocolWithdrawalFee(uint256 _fee) public onlyManager {
        require(_fee <= PROTOCOL_WITHDRAWAL_FEE_CAP, "!protocol fee cap");

        uint256 previousFee = protocolWithdrawalFee;
        protocolWithdrawalFee = _fee;
        emit ProtocolWithdrawFeeUpdate(previousFee, _fee);
    }
}
