// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

//fake LP
contract AvaultDummyToken is ERC20Permit, Ownable {
    
    uint256 private _cap;

    constructor()
        ERC20("Avault LP Dummy Token", "aLPDummy")
        ERC20Permit("Avault Dummy Token")
    {
        _cap = 100 * (10 ** decimals());
        _mint(msg.sender, 100 * (10 ** decimals()));
    }

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    /**
     * @dev See {ERC20-_mint}.
     */
    function _mint(address account, uint256 amount) internal virtual override {
        require(ERC20.totalSupply() + amount <= cap(), "ERC20Capped: cap exceeded");
        super._mint(account, amount);
    }

}
