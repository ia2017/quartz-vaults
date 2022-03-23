
/** 
 *  SourceUnit: /Users/joebrown/@briz-crypto/@quartz.defi/vaults/contracts/utils/StringUtils.sol
*/

////// SPDX-License-Identifier-FLATTEN-SUPPRESS-WARNING: MIT

pragma solidity >=0.6.0 <0.8.0;

library StringUtils {
    function concat(string memory a, string memory b)
        internal
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, b));
    }
}

