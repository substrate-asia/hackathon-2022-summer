// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "../interfaces/IGrassHouse.sol";

/// @title GrassHouseGateway
contract GrassHouseGateway {
  function claimMultiple(address[] calldata _grassHouses, address _for) external {
    for (uint256 i = 0; i < _grassHouses.length; i++) {
      IGrassHouse(_grassHouses[i]).claim(_for);
    }
  }
}
