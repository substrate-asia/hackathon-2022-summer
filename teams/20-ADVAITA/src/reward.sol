// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
 
contract TransferERC20Token {

  address public owner;
  uint  balance;

  //a map to store info if the user has been rewarded
  mapping(string => bool) public user_is_reward;

  event TransferReceived(address _from,uint _amount);
  event TransferSent(address _from,address _destAddr,uint _amount);
  
  constructor() {
    owner = msg.sender;
  }

  //get erc20 token
  receive() payable external {
    balance += msg.value;
    emit TransferReceived(msg.sender, msg.value);
  }

  // //withdraw the rest money
  // function withdraw(uint amount, address payable destAddr) public {
  //   require(msg.sender == owner,"Only owner can withdraw funds");
  //   require(amount <= balance,"Insufficient funds");

  //   destAddr.transfer(amount);
  //   balance -= amount;
  //   emit TransferSent(msg.sender,destAddr,amount);
  // }

  //
  function transferERC20(IERC20 token, uint amount, string memory reportHash,address publicAddr) public { 

    //verify hash 
    require(bytes(reportHash).length >0,"invalid report hash, please check it again");

    //duplicate reward varify
    require(user_is_reward[reportHash]== false,"the report hash has been used,please try another one ");

    //Only owner can transfer funds
    require(msg.sender == owner,"Only owner can transfer funds");

    //get erc20 token balance
    uint256 erc20balance = token.balanceOf(address(this));
    require(amount <= erc20balance,"balance is low");

    //transfer
    token.transfer(publicAddr,amount);
    emit TransferSent(msg.sender,publicAddr,amount);

    user_is_reward[reportHash] = true;
  }

}


 
