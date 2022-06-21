// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./AVAT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AVATEscrow is Ownable {
    AVAT public AToken;

    constructor(AVAT _avat)
    {
        AToken = _avat;
    }

    
}
