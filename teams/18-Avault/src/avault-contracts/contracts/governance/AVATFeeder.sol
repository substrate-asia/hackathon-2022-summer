// SPDX-License-Identifier: MIT


pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/IERC20Upgradeable.sol";

import "../interfaces/IMasterChefV2.sol";
import "../interfaces/IGrassHouse.sol";

/// @title AVATFeeder
contract AVATFeeder is Initializable, OwnableUpgradeable {

  /// @notice Events
  event LogFeedGrassHouse(uint256 _feedAmount);
  event LogFarmDeposit();
  event LogFarmWithdraw();
  event LogFarmHarvest(address _caller, uint256 _harvestAmount);
  event LogSetNewGrassHouse(address indexed _caller, address _prevGrassHouse, address _newGrassHouse);

  /// @notice State
  IMasterChefV2 public farm;
  IGrassHouse public grassHouse;
  uint256 public farmPoolId;

  /// @notice Attributes for AlcapaFeeder
  /// token - address of the token to be deposited in this contract
  /// proxyToken - just a simple ERC20 token for staking with Farm
  address public token;
  IERC20Upgradeable public proxyToken;

  function initialize(
    address _token,
    IERC20Upgradeable _proxyToken,
    address _farmAddress,
    uint256 _farmPoolId,
    address _grasshouseAddress
  ) external initializer {
    OwnableUpgradeable.__Ownable_init();

    token = _token;
    proxyToken = _proxyToken;
    farmPoolId = _farmPoolId;
    farm = IMasterChefV2(_farmAddress);
    grassHouse = IGrassHouse(_grasshouseAddress);

    require(grassHouse.rewardToken() == _token, "!same rewardToken");

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

  /// @notice Harvest reward from Farm and Feed token to a GrassHouse
  function feedGrassHouse() external {
    uint256 _feedAmount = _farmHarvest();
    IERC20Upgradeable(token).approve(address(grassHouse), _feedAmount);
    grassHouse.feed(_feedAmount);
    emit LogFeedGrassHouse(_feedAmount);
  }

  /// @notice Set a new GrassHouse
  /// @param _newGrassHouse - new GrassHouse address
  function setGrassHouse(IGrassHouse _newGrassHouse) external onlyOwner {
    address _prevGrassHouse = address(grassHouse);
    grassHouse = _newGrassHouse;
    emit LogSetNewGrassHouse(msg.sender, _prevGrassHouse, address(_newGrassHouse));
  }
}
