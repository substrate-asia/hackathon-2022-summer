// SPDX-License-Identifier: GLP-v3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IPancakeRouter02.sol";
import "../interfaces/IPancakeFactory.sol";
import "../interfaces/IWETH.sol";
import "../interfaces/IPancakeswapFarm.sol";


contract PresaleShidenTest is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    IERC20 public constant avat = IERC20(0xd7d505283A7cd9CBc4760e32d9c80b4Fc66dBDea);
    IPancakeRouter02 public constant arthswapRouter = IPancakeRouter02(0x72e86269b919Db5bDbF61cB1DeCfD6d14feC4D7F); // to add liquidity
    IPancakeFactory public constant arthswapFactory = IPancakeFactory(0xcd8620889c1dA22ED228e6C00182177f9dAd16b7); // to get LP address
    IWETH public constant weth = IWETH(0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef);
    uint public constant AVATdonation = 100 * (10**18);
    uint public constant avaultWithrawPercentUplimit = 10; // 10%
    uint public constant astrLimit = 10 * (10**18); // todo to be termined.
    uint public constant farmPeriodInBlocks = 365 * 24 * 60 * 60 / 12; // 1 year.
    uint public constant precision = 10**18;
    IPancakeswapFarm public constant arthswapFarm = IPancakeswapFarm(0x293A7824582C56B0842535f94F6E3841888168C8);


    uint public depositStartBlock;
    uint public depositEndBlock;

    mapping(address => uint) public userAstr;
    uint public countedAstrAmount;
    uint public abortedCountedAstrAmount;
    uint public initialAstrAmount;
    uint public initialAstrAmountRemained;

    address public lp;
    uint public farmStartBlock;
    mapping(address => uint) public userClaimedAstr;
    mapping(address => bool) public userIsAborted;

    mapping(address => uint) public extraBonus;
    mapping(address => mapping (address => uint)) public extraBonusUserWithdrawn;

    uint public poolId;
    /**
     *  0. depositing. Allow ASTR deposit
     *  1. deposit done. Timeup, do not allow ASTR deposit, owner should withdraw maximum `avaultWithrawPercentUplimit`% ASTR.
     *  2. create LP. Owner should deposit AVAT, add liquidity(100%AVAT + 50%ASTR) to Arthswap
     *  3. farming. Start to accumulate ASTR reward, claim ASTR reward, allow to abort and withraw AVAT-ASTR LP.
     */
    uint public state;

    event newState(uint _state);

    modifier onlyState(uint _state) {
        require(state == _state, "invalid state");
        _;
    }

    constructor(uint _depositStartBlock, uint _depositEndBlock)
    {
        setDepostPeriod(_depositStartBlock, _depositEndBlock);
    }

    function escalateState() internal{
        emit newState(++state);
    }

    //------------------state 0----------------
    receive() external payable {
        _depositASTR(msg.value);
    }

    function _depositASTR(uint _amount) internal onlyState(0) {
        if(block.number > depositEndBlock || countedAstrAmount > astrLimit){
            escalateState();
            payable(msg.sender).transfer(_amount);
            countedAstrAmount -= 1_000_000; // remained by contract for keeping this contract alive;
            initialAstrAmount = countedAstrAmount;
            initialAstrAmountRemained = countedAstrAmount;
            return;
        }

        require(block.number >= depositStartBlock, "havn't started");
        require(block.number <= depositEndBlock, "ended");
        userAstr[msg.sender] += _amount;
        countedAstrAmount += _amount;
        require(countedAstrAmount <= astrLimit, "exceed upper limit");
    }

    function setDepostPeriod(uint _depositStartBlock, uint _depositEndBlock) public onlyOwner onlyState(0){
        require(_depositEndBlock > _depositStartBlock, "_depositEndBlock");
        depositStartBlock = _depositStartBlock;
        depositEndBlock = _depositEndBlock;
    }


    //------------------state 1----------------
    function avaultWithdraw(uint _percent) external onlyOwner onlyState(1) {
        require(_percent <= avaultWithrawPercentUplimit, "_percent invalid");
        escalateState();
        uint toWithdrawAmount = countedAstrAmount * _percent / 100;
        countedAstrAmount -= toWithdrawAmount;
        payable(msg.sender).transfer(toWithdrawAmount);
    }


    //-------------------state 2---------------
    function createLP() external onlyOwner onlyState(2){
        uint _avatBalance = avat.balanceOf(address(this));
        require(_avatBalance >= AVATdonation, "AVAT not enough");
        lp = arthswapFactory.getPair(address(avat), address(weth));
        uint _astrLpAmount = countedAstrAmount * 50 / 90;
        arthswapRouter.addLiquidityETH{value: _astrLpAmount}(address(avat), _avatBalance, _avatBalance, _astrLpAmount, address(this), block.timestamp + 600);
        require(IERC20(lp).balanceOf(address(this)) > 0, "lp 0");

        countedAstrAmount -= _astrLpAmount;
        farmStartBlock = block.number;
        escalateState();
    }


    //-------------------state 3---------------
    function abort() external onlyState(3){
        claim();

        uint _userSharePercent = userAstr[msg.sender] * precision / initialAstrAmountRemained; // will increase whenever any user abort.
        uint _lpBalance = IERC20(lp).balanceOf(address(this));
        uint _lpInFarm;
        if(poolId > 0){
            (_lpInFarm, ) = arthswapFarm.userInfo(poolId, address(this));
        }
        uint _lpForUser = (_lpBalance + _lpInFarm) * _userSharePercent / precision;

        // update abortedCountedAstrAmount and userIsAborted[msg.sender] and initialAstrAmountRemained;
        initialAstrAmountRemained -= userAstr[msg.sender];
        userIsAborted[msg.sender] = true;
        
        uint _farmPeriod = block.number - farmStartBlock;
        uint _farmPeriodInBlocks = farmPeriodInBlocks;
        if(_farmPeriod > _farmPeriodInBlocks){
            _farmPeriod = _farmPeriodInBlocks;
        }
        abortedCountedAstrAmount += countedAstrAmount * _farmPeriod * userAstr[msg.sender] * precision / _farmPeriodInBlocks / initialAstrAmount / precision;

        if(_lpForUser > _lpBalance){
            _unfarm(_lpForUser - _lpBalance);
        }
        IERC20(lp).safeTransfer(msg.sender, _lpForUser);
    }

    function claim() public nonReentrant onlyState(3) returns (uint _amount){
        require(!userIsAborted[msg.sender], "user aborted");
        uint _userSharePercent = userAstr[msg.sender] * precision / initialAstrAmountRemained; // will increase whenever any user abort.
        
        uint _farmPeriod = block.number - farmStartBlock;
        uint _farmPeriodInBlocks = farmPeriodInBlocks;
        if(_farmPeriod > _farmPeriodInBlocks){
            _farmPeriod = _farmPeriodInBlocks;
        }
        uint _astrToRelease = (countedAstrAmount * precision * _farmPeriod / _farmPeriodInBlocks / precision) - abortedCountedAstrAmount;
        _amount = (_astrToRelease * _userSharePercent / precision) - userClaimedAstr[msg.sender];

        userClaimedAstr[msg.sender] += _amount;
        require(_amount <= address(this).balance, "astr not enough");
        payable(msg.sender).transfer(_amount);
    }

    function claimExtraBonus(address _token) external onlyState(3) returns (uint _amount){
        uint _extraBonus = extraBonus[_token];
        require(_extraBonus > 0, "no extra bonus");
        require(!userIsAborted[msg.sender], "user aborted");

        uint _extraBonusUserWithdrawn = extraBonusUserWithdrawn[_token][msg.sender];
        _amount = userAstr[msg.sender] * precision * _extraBonus / initialAstrAmount / precision - _extraBonusUserWithdrawn;
        extraBonusUserWithdrawn[_token][msg.sender] = _extraBonusUserWithdrawn + _amount;
        IERC20(_token).safeTransfer(msg.sender, _amount);
    }



    //------------------extra bonus--------------
    function addExtraBonus(address _token, uint _amount) external onlyOwner{
        extraBonus[_token] += _amount;
    }

    function lpFarm(uint _poolId) external onlyOwner {
        require(_poolId > 0, "invalid pid");
        poolId = _poolId;

        uint256 wantAmt = IERC20(lp).balanceOf(address(this));
        IERC20(lp).safeIncreaseAllowance(address(arthswapFarm), wantAmt);
        arthswapFarm.deposit(poolId, wantAmt);
    }

    /** 
    *  1. in case incorrect token deposition.
    *  2. in case user sending ASTR from Polkadot Address which couldn't be counted.
    *  3. withraw excessive ExtraBonus
    *  @notice Please contact admin if you sent token to this address incorrectly
    **/
    function withdrawMissSending(address _token, uint _amount) external nonReentrant onlyOwner {
        if(_token == address(0)){
            //withraw uncounted astr
            payable(msg.sender).transfer(address(this).balance - countedAstrAmount);
        }else{
            require(_token != lp, "invalid token");
            IERC20(_token).safeTransfer(msg.sender, _amount);
        }
    }

    function _unfarm(uint256 _wantAmt) internal {        
        arthswapFarm.withdraw(poolId, _wantAmt);
    }
}
