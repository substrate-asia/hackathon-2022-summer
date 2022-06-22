//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20CappedUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract CstlToken is ERC20CappedUpgradeable, AccessControlUpgradeable {
    using SafeMath for uint256;

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant GAMING_DEV_ROLE = keccak256("GAMING_DEV_ROLE");

    uint256 public constant MAX_CAP = 10000000 * 1e18;
    uint256 public constant PRE_MINT = 500000 * 1e18;
    uint256 public constant ONE_DAY = 1 days;

    uint256 public SHARE_PER_DAY = 20000 * 1e18;

    uint256 public constant FEE_BASE = 10000;
    address public feeTo;

    uint256 public feeRate; //based 10000
    uint256 public startAt;

    mapping(address => bool) public excludeUsers;

    event Distribute(address indexed _account, uint256 _amount);

    function initialize(address _admin) public initializer {
        __ERC20Capped_init(MAX_CAP);
        __ERC20_init("Crystal", "CSTL");

        __AccessControl_init();
        _setupRole(ADMIN_ROLE, _admin);
        _setRoleAdmin(GAMING_DEV_ROLE, ADMIN_ROLE);

        _mint(_admin, PRE_MINT);
        feeRate = FEE_BASE / 10;
        SHARE_PER_DAY = 20000 * 1e18;
    }

    function distribute(address _account, uint256 _amount) external  onlyRole(GAMING_DEV_ROLE) {
        require(startAt > 0 && block.timestamp >= startAt, "Carrot: no start");
        //fee
        uint256 fee = _amount.mul(feeRate).div(FEE_BASE);
        if(totalSupply().add(_amount) <= MAX_CAP) { //mint able
            require(amountMintable(_amount), "Carrot: mint out of bounds");
            _mint(_account, _amount.sub(fee));
            _mint(feeTo, fee);
        }else if(balanceOf(address(this)) >= _amount ) { // redistribute
            _transfer(address(this), _account, _amount.sub(fee));
            _transfer(address(this), feeTo, fee);
        }
        emit Distribute(_account, _amount);
    }

    function setSharePerDay(uint256 _share) external onlyRole(ADMIN_ROLE) {
        SHARE_PER_DAY = _share;
    }

    function setFeeTo(address _feeTo) external onlyRole(ADMIN_ROLE) {
        feeTo = _feeTo;
    }

    function setStartAt(uint256 _startAt) external onlyRole(ADMIN_ROLE) {
        startAt = _startAt;
    }

    function excludeUser(address _user, bool _exculde) external onlyRole(ADMIN_ROLE) {
        excludeUsers[_user] = _exculde;
    }

    function setRoleAdmin(bytes32 role, bytes32 adminRole) external onlyRole(ADMIN_ROLE) {
        _setRoleAdmin(role, adminRole);
    }
    
    function amountMintable(uint256 _amount) private view returns (bool) {

        uint256 dayGap = (block.timestamp - startAt) / ONE_DAY + 1;
        uint256 maxValue = dayGap * SHARE_PER_DAY;

        return totalSupply().sub(PRE_MINT).add(_amount) <= maxValue;
    }

     function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override virtual {
        require(!excludeUsers[from], "BAC: from address in exclude list");
        require(!excludeUsers[to], "BAC: to address in exclude list");
    }
}