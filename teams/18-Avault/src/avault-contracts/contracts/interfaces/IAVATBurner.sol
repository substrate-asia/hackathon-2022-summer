// SPDX-License-Identifier: GLP-3.0


pragma solidity ^0.8.9;

/// @title AVATFeeder
interface IAVATBurner{

  /// @notice Receive reward from Farm
  function farmHarvest() external;


  function keepAVATForBoost(address _user, uint _amount) external returns (uint _finalAmount);
}
