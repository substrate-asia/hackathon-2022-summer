// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

interface IGrassHouse {
  function rewardToken() external returns (address);
  function feed(uint256 _amount) external returns (bool);
  function claim(address _for) external returns (uint256);
}
