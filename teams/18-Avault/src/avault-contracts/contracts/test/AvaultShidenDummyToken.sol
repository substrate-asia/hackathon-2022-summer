// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//fake AVAT
contract AvaultShidenDummyToken is ERC20Capped, Ownable {
    
    mapping(address => uint) public mintCapacity;
    mapping(address => bool) public transferWhitelist;
    bool public isWhiteListEnable = true;

    constructor()
        ERC20("Avault Shiden Dummy Token", "AVATDummy")
        ERC20Capped(500000000 * (10 ** decimals()))
    {
        mintCapacity[msg.sender] = 500000000 * (10 ** decimals());
    }


    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        if(isWhiteListEnable){
            require(transferWhitelist[from] || from == address(0), "not in WhiteList");
        }
    }

    function setIsWhiteListEnable(bool _b) external onlyOwner{
        isWhiteListEnable = _b;
    }

    function setTransferWhiteList(address _user, bool _isAdmitted) external onlyOwner{
        transferWhitelist[_user] = _isAdmitted;
    }


    function mint(address account, uint256 amount) external {
        uint256 fromBalance = mintCapacity[_msgSender()];
        require(fromBalance >= amount, "mint: not enough amount");

        mintCapacity[_msgSender()] = fromBalance - amount;
        _mint(account, amount);
    }

    function transferMintCapacity(address to, uint amount) external{
        uint256 fromBalance = mintCapacity[_msgSender()];
        require(fromBalance >= amount, "transferMint: not enough amount");

        mintCapacity[_msgSender()] = fromBalance - amount;
        mintCapacity[to] = mintCapacity[to] + amount;
    }

}
