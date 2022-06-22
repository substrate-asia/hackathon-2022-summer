// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../avat/AVAT.sol";

contract AVATMultiSend is Ownable{

    AVAT public AToken;

    constructor(AVAT _avat)
    {
        AToken = _avat;
    }
    
    function multiSending(address[] calldata addrs, uint amnt) external onlyOwner{
        require(addrs.length * amnt <= AToken.balanceOf(address(this)), "not enough balance");
        
        for (uint i=0; i < addrs.length; i++) {
            AToken.transfer(addrs[i], amnt);
        }
    }
}