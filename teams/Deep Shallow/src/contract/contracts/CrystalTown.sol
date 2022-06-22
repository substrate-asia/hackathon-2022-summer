//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract CrystalTown is OwnableUpgradeable {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    struct DepositInfo {
        address user;
        uint256 amount;
    }

    DepositInfo[] public depositInfo;

    address public depositToken;

    uint256 public rateBAC;
    uint256 public rateCarrot;

    uint256 public totalDeposit;

    mapping(address => uint256[]) userDeposit;

    event Deposit(address indexed _owner, uint256 _amount);

    function initialize(address _carAddr)  initializer public {

        __Ownable_init();

        depositToken  = _carAddr;
    }

    function deposit(uint256 _amount) external {

        IERC20(depositToken).safeTransferFrom(msg.sender, depositToken, _amount);

        depositInfo.push(DepositInfo(msg.sender, _amount));

        totalDeposit = totalDeposit.add(_amount);

        userDeposit[msg.sender].push(depositInfo.length - 1);

        emit Deposit(msg.sender, _amount);
    }

    function setExRate(uint256 _bacAmount, uint256 _carrotAmount) external onlyOwner {
        rateBAC = _bacAmount;
        rateCarrot = _carrotAmount;
    }

    function depositRate() external view returns (uint256 bacAmount, uint256 carrotAmount) {
        bacAmount = rateBAC;
        carrotAmount = rateCarrot;
    }

    function depositCount() external view returns (uint256) {
        return depositInfo.length;
    }

    function userDepositList(address account) 
        external 
        view 
        returns (
            address[] memory, 
            uint256[] memory,
            uint256[] memory
        ) {

        uint256[] storage userIds = userDeposit[account];

        uint256 len = userIds.length;
        address[] memory users   = new address[](len);
        uint256[] memory amounts = new uint256[](len);
        uint256[] memory indexs = new uint256[](len);

        for (uint256 index = 0; index < len; index++) {
            uint256 tid = userIds[index];
            DepositInfo storage info =  depositInfo[tid];
            users[index]   = info.user;
            amounts[index] = info.amount;
            indexs[index]  = tid;
        }

        return (users, amounts, indexs);
    }

}