//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IADAO is IERC20 {
    function depositFor(address payable account) external payable;
    function withdraw(uint ibASTRAmount) external;
    function withdrawTo(address payable account, uint ibASTRAmount) external;
    function ratio() external returns (uint);
    function RATIO_PRECISION() external returns (uint);
}