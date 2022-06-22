//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract BuildScience  {

    //@dev random % based < hitRate ? 0 : 1
    //@return gender 0:female 1:male
    function breeedGender(uint256 based, uint256 hitRate) external view returns (uint256 hit) {
       uint256 random = uint256(keccak256(abi.encodePacked(tx.origin, block.difficulty, block.timestamp)));
       return random % based < hitRate ? 0 : 1;
    }
}