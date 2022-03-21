// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "../interfaces/common/IMasterChef.sol";

contract MockChef is IMasterChef {
    function deposit(uint256 _pid, uint256 _amount) public override {
        //
    }

    function withdraw(uint256 _pid, uint256 _amount) public override {
        //
    }

    function emergencyWithdraw(uint256 _pid) public override {
        //
    }

    function userInfo(uint256 _pid, address _user)
        external
        view
        override
        returns (uint256, uint256)
    {
        return (0, 0);
    }
}
