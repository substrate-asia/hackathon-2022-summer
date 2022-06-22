// SPDX-License-Identifier: GLP-3.0


pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "../interfaces/IMasterChefV2.sol";

/// @title AVATFeeder
contract AVATBurner is Initializable, OwnableUpgradeable {

  /// @notice Events
  event LogBurn(uint256 _burnAmount);
  event LogFarmDeposit();
  event LogFarmWithdraw();
  event LogFarmHarvest(address _caller, uint256 _harvestAmount);
  event LogSetNewGrassHouse(address indexed _caller, address _prevGrassHouse, address _newGrassHouse);

  IMasterChefV2 public farm;
  uint256 public farmPoolId;

  /// @notice Attributes for AlcapaFeeder
  /// token - address of the token to be deposited in this contract
  /// proxyToken - just a simple ERC20 token for staking with Farm
  address public token;
  IERC20Upgradeable public proxyToken;

  mapping(address => bool) public boostBonus;


  function initialize(
    address _token,
    IERC20Upgradeable _proxyToken,
    address _farmAddress,
    uint256 _farmPoolId
  ) external initializer {
    OwnableUpgradeable.__Ownable_init();

    token = _token;
    proxyToken = _proxyToken;
    farmPoolId = _farmPoolId;
    farm = IMasterChefV2(_farmAddress);
    boostBonus[_farmAddress] = true;

    proxyToken.approve(_farmAddress, type(uint256).max);
  }

  /// @notice Deposit token to Farm
  function farmDeposit() external onlyOwner {
    uint b = proxyToken.balanceOf(address(this));
    farm.deposit(farmPoolId, b);
    emit LogFarmDeposit();
  }

  /// @notice Withdraw all staked token from Farm
  function farmWithdraw(uint _amount) external onlyOwner {
    farm.withdraw(farmPoolId, _amount);
    emit LogFarmWithdraw();
  }


  /// @notice Receive reward from Farm
  function farmHarvest() external {
    _farmHarvest();
  }

  /// @notice Receive reward from Farm
  function _farmHarvest() internal returns (uint _balance) {
    uint256 _before = IERC20Upgradeable(token).balanceOf(address(this));
    farm.deposit(farmPoolId, 0);
    _balance = IERC20Upgradeable(token).balanceOf(address(this));
    emit LogFarmHarvest(address(this), _balance - _before);
  }

  /// @notice burn a _percent of AVAT
  function burnAVAT(uint _percent) external onlyOwner {
      require(_percent <= 100, "invalid _percent");
      uint _burnAmount = IERC20Upgradeable(token).balanceOf(address(this)) * _percent / 100;
      IERC20Upgradeable(token).transfer(address(0), _burnAmount);
      emit LogBurn(_burnAmount);
  }
}
