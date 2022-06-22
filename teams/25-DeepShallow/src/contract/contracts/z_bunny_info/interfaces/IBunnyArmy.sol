//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IBunnyArmy{

    function mintBunnyFromMeta(address _recipient) external returns (uint256 tokenId);
    
    function bunnyFather(uint256 sonTokenId) external view returns (uint256 tokenId);
    function bunnyMother(uint256 sonTokenId) external view returns (uint256 tokenId);
    
}