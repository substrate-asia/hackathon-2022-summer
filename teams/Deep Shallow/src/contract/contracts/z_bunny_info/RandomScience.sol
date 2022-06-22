//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


contract RandomScience {

    //@dev random % based < hitRate ? 0 : 1
    //@return gender 0:female 1:male
    function random(uint256 salt) external view returns (uint256) {
       return uint256(keccak256(abi.encodePacked(tx.origin, block.difficulty, block.timestamp, salt)));
    }
}