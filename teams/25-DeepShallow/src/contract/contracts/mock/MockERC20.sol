pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MockERC20  is ERC20 {
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        _mint(msg.sender, 10000 * 1e18);
    }

    function mint(address _user, uint256 _amount) external {
        _mint(_user, _amount);
    }
}