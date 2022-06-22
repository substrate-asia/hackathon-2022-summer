//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
interface IMetaBunny{

    function grantBreedMetadata(uint256 tokenId) external;

    function grantByRarity(uint256 tokenId, uint256 rarity) external;
}