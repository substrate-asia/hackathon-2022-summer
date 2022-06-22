// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "../interfaces/IAVAT.sol";
import "../interfaces/IMasterChefV2.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-IERC20Permit.sol";

import "@openzeppelin/contracts/access/Ownable.sol";


// inspired by Pancake MasterChef
// MasterChef is the master of AVAT. He can make AVAT and he is a fair guy.
//
// Note that it's ownable and the owner wields tremendous power. The ownership
// will be transferred to a governance smart contract once AVAT is sufficiently
// distributed and the community can show to govern itself.
//
// Have fun reading it. Hopefully it's bug-free. God bless.
contract MasterChef is Ownable, ReentrancyGuard, IMasterChefV2 {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;    

    // Info of each pool.
    struct PoolInfo {
        IERC20 lpToken;           // Address of LP token contract.
        uint256 allocPoint;       // How many allocation points assigned to this pool. AVATs to distribute per block.
        uint256 lastRewardBlock;  // Last block number that AVATs distribution occurs.
        uint256 accAVATPerShare; // Accumulated AVATs per share, times 1e12. See below.
        uint256 totalBoostedShare;
    }

    mapping(address => bool) public lpSet; // in case of duplicate LP setting

    // AVAT tokens created per block.
    uint256 public avatPerBlock;

    address public boostContract;

    // Info of each pool.
    PoolInfo[] public poolInfo;
    // Info of each user that stakes LP tokens.
    mapping (uint256 => mapping (address => UserInfo)) public userInfo;
    // Total allocation points. Must be the sum of all allocation points in all pools.
    uint256 public totalAllocPoint;
    // The block number when AVAT mining starts.
    uint256 public startBlock;

    uint256 public constant ACC_AVAT_PRECISION = 1e18;
    /// @notice Basic boost factor, none boosted user's boost factor
    uint256 public constant BOOST_PRECISION = 100 * 1e10;
    /// @notice Hard limit for maxmium boost factor, it must greater than BOOST_PRECISION
    uint256 public constant MAX_BOOST_PRECISION = 200 * 1e10;

    IAVAT public constant AVAT = IAVAT(0xd7d505283A7cd9CBc4760e32d9c80b4Fc66dBDea); //AVATDummy in Shiden


    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event UpdateBoostContract(address indexed boostContract);
    event UpdateBoostMultiplier(address indexed user, uint256 pid, uint256 oldMultiplier, uint256 newMultiplier);

    constructor(
        uint256 _startBlock,
        uint256 _avatPerBlock
    ) {
        startBlock = _startBlock;
        avatPerBlock = _avatPerBlock;
    }

    /**
     * @dev Throws if caller is not the boost contract.
     */
    modifier onlyBoostContract() {
        require(boostContract == msg.sender, "only boost contract");
        _;
    }

    function updateAVATPerBlock(
        uint256 _avatPerBlock,
        bool _withUpdate
    ) external onlyOwner{
        avatPerBlock = _avatPerBlock;
        if (_withUpdate) {
            massUpdatePools();
        }
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // Add a new lp to the pool. Can only be called by the owner.
    function add(uint256 _allocPoint, IERC20 _lpToken, bool _withUpdate) external onlyOwner {
        require(!lpSet[address(_lpToken)], "duplicated lp");
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint = totalAllocPoint.add(_allocPoint);
        poolInfo.push(PoolInfo({
            lpToken: _lpToken,
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accAVATPerShare: 0,
            totalBoostedShare: 0
        }));
        lpSet[address(_lpToken)] = true;
    }

    // Update the given pool's AVAT allocation point. Can only be called by the owner.
    function set(uint256 _pid, uint256 _allocPoint, bool _withUpdate) external onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 prevAllocPoint = poolInfo[_pid].allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
        if (prevAllocPoint != _allocPoint) {
            totalAllocPoint = totalAllocPoint.sub(prevAllocPoint).add(_allocPoint);
        }
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(uint256 _from, uint256 _to) public pure returns (uint256) {
        return _to.sub(_from);
    }

    // View function to see pending AVATs on frontend.
    function pendingAVAT(uint256 _pid, address _user) external view override returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accAVATPerShare = pool.accAVATPerShare;
        uint256 lpSupply = pool.totalBoostedShare;
        if (block.number > pool.lastRewardBlock && lpSupply != 0) {
            uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
            uint256 avatReward = multiplier.mul(avatPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
            accAVATPerShare = accAVATPerShare.add(avatReward.mul(ACC_AVAT_PRECISION).div(lpSupply));
        }

        uint256 boostedAmount = user.amount.mul(getBoostMultiplier(_user, _pid)).div(BOOST_PRECISION);
        return boostedAmount.mul(accAVATPerShare).div(ACC_AVAT_PRECISION).sub(user.rewardDebt);
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            if (poolInfo[pid].allocPoint != 0) {
                updatePool(pid);
            }
        }
    }


    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 lpSupply = pool.totalBoostedShare;
        if (lpSupply == 0 || totalAllocPoint == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }
        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 avatReward = multiplier.mul(avatPerBlock).mul(pool.allocPoint).div(totalAllocPoint);
        pool.accAVATPerShare = pool.accAVATPerShare.add(avatReward.mul(ACC_AVAT_PRECISION).div(lpSupply));
        pool.lastRewardBlock = block.number;
    }

    function depositWithPermit(
        uint _pid,
        uint _amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s)
        external
        virtual
    {
        IERC20Permit(address(poolInfo[_pid].lpToken)).permit(msg.sender, address(this), type(uint).max, deadline, v, r, s);
        deposit(_pid, _amount);
    }

    // Deposit LP tokens to MasterChef for AVAT allocation.
    function deposit(uint256 _pid, uint256 _amount) public override nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        updatePool(_pid);

        uint256 multiplier = getBoostMultiplier(msg.sender, _pid);

        if (user.amount > 0) {
            settlePendingAVAT(msg.sender, _pid, multiplier);
        }

        if (_amount > 0) {
            IERC20 _lpToken = pool.lpToken;
            uint256 before = _lpToken.balanceOf(address(this));
            _lpToken.safeTransferFrom(msg.sender, address(this), _amount);
            _amount = _lpToken.balanceOf(address(this)).sub(before);
            user.amount = user.amount.add(_amount);

            // Update total boosted share.
            pool.totalBoostedShare = pool.totalBoostedShare.add(_amount.mul(multiplier).div(BOOST_PRECISION));
        }

        user.rewardDebt = user.amount.mul(multiplier).div(BOOST_PRECISION).mul(pool.accAVATPerShare).div(
            ACC_AVAT_PRECISION
        );

        emit Deposit(msg.sender, _pid, _amount);
    }

    // Withdraw LP tokens from MasterChef.
    function withdraw(uint256 _pid, uint256 _amount) external override nonReentrant{
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "Insufficient amount");

        updatePool(_pid);

        uint256 multiplier = getBoostMultiplier(msg.sender, _pid);

        settlePendingAVAT(msg.sender, _pid, multiplier);

        if(_amount > 0) {
            user.amount = user.amount.sub(_amount);
            pool.lpToken.safeTransfer(address(msg.sender), _amount);
        }
        user.rewardDebt = user.amount.mul(multiplier).div(BOOST_PRECISION).mul(pool.accAVATPerShare).div(
            ACC_AVAT_PRECISION
        );
        pool.totalBoostedShare = pool.totalBoostedShare.sub(
            _amount.mul(multiplier).div(BOOST_PRECISION)
        );
        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Withdraw without caring about rewards. EMERGENCY ONLY.
    function emergencyWithdraw(uint256 _pid) external override nonReentrant{
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 userAmount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        uint256 boostedAmount = userAmount.mul(getBoostMultiplier(msg.sender, _pid)).div(BOOST_PRECISION);
        pool.totalBoostedShare = pool.totalBoostedShare > boostedAmount ? pool.totalBoostedShare.sub(boostedAmount) : 0;

        pool.lpToken.safeTransfer(address(msg.sender), userAmount);
        emit EmergencyWithdraw(msg.sender, _pid, userAmount);
    }

    /// @notice Update boost contract address and max boost factor.
    /// @param _newBoostContract The new address for handling all the share boosts.
    function updateBoostContract(address _newBoostContract) external onlyOwner {
        require(
            _newBoostContract != address(0) && _newBoostContract != boostContract,
            "invalid boost contract"
        );

        boostContract = _newBoostContract;
        emit UpdateBoostContract(_newBoostContract);
    }

    /// @notice Update user boost factor.
    /// @param _user The user address for boost factor updates.
    /// @param _pid The pool id for the boost factor updates.
    /// @param _newMultiplier New boost multiplier.
    function updateBoostMultiplier(
        address _user,
        uint256 _pid,
        uint256 _newMultiplier
    ) external onlyBoostContract nonReentrant {
        require(_user != address(0), "invalid user address");
        require(
            _newMultiplier >= BOOST_PRECISION && _newMultiplier <= MAX_BOOST_PRECISION,
            "Invalid new boost multiplier"
        );

        updatePool(_pid);
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];

        uint256 prevMultiplier = getBoostMultiplier(_user, _pid);
        settlePendingAVAT(_user, _pid, prevMultiplier);

        user.rewardDebt = user.amount.mul(_newMultiplier).div(BOOST_PRECISION).mul(pool.accAVATPerShare).div(
            ACC_AVAT_PRECISION
        );
        pool.totalBoostedShare = pool.totalBoostedShare.sub(user.amount.mul(prevMultiplier).div(BOOST_PRECISION)).add(
            user.amount.mul(_newMultiplier).div(BOOST_PRECISION)
        );
        user.boostMultiplier = _newMultiplier;

        emit UpdateBoostMultiplier(_user, _pid, prevMultiplier, _newMultiplier);
    }

    /// @notice Get user boost multiplier for specific pool id.
    /// @param _user The user address.
    /// @param _pid The pool id.
    function getBoostMultiplier(address _user, uint256 _pid) public view returns (uint256) {
        uint256 multiplier = userInfo[_pid][_user].boostMultiplier;
        return multiplier > BOOST_PRECISION ? multiplier : BOOST_PRECISION;
    }

    /// @notice Settles, distribute the pending AVAT rewards for given user.
    /// @param _user The user address for settling rewards.
    /// @param _pid The pool id.
    /// @param _boostMultiplier The user boost multiplier in specific pool id.
    function settlePendingAVAT(
        address _user,
        uint256 _pid,
        uint256 _boostMultiplier
    ) internal {
        UserInfo memory user = userInfo[_pid][_user];

        uint256 boostedAmount = user.amount.mul(_boostMultiplier).div(BOOST_PRECISION);
        uint256 accAVAT = boostedAmount.mul(poolInfo[_pid].accAVATPerShare).div(ACC_AVAT_PRECISION);
        uint256 pending = accAVAT.sub(user.rewardDebt);
        // SafeTransfer AVAT
        AVAT.mint(_user, pending);
    }

    function getUserInfo(uint _pid, address _user) external view override returns (UserInfo memory){
        return userInfo[_pid][_user];
    }
}
