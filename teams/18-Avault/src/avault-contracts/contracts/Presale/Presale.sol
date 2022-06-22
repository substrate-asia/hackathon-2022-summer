// SPDX-License-Identifier: GLP-v3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../interfaces/IPancakeRouter02.sol";
import "../interfaces/IPancakeFactory.sol";
import "../interfaces/IWETH.sol";
import "../interfaces/IPancakeswapFarm.sol";
import "../interfaces/IADAO.sol";


contract Presale is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    IPancakeRouter02 public constant arthswapRouter = IPancakeRouter02(0xE915D2393a08a00c5A463053edD31bAe2199b9e7); // to add liquidity
    IPancakeFactory public constant arthswapFactory = IPancakeFactory(0xA9473608514457b4bF083f9045fA63ae5810A03E); // to get LP address
    IPancakeswapFarm public constant arthswapFarm = IPancakeswapFarm(0xc5b016c5597D298Fe9eD22922CE290A048aA5B75);
    IWETH public constant weth = IWETH(0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720);
    IADAO public constant adao = IADAO(0x3BFcAE71e7d5ebC1e18313CeCEbCaD8239aA386c);
    uint public constant astrWithrawPercentUplimit = 10; // 10%
    uint public constant farmPeriodInBlocks = 365 * 24 * 60 * 60 / 12; // 1 year.
    uint public constant precision = 10**18; //equal to ASTR decimals.

    /**
    *  @dev set 0 if it's not fixed price. 
    *  With `precision`:  1500000000000000000 == 1.5, 
    *  unit is 1.5 ASTR/XTOKEN.
    **/
    uint immutable public fixedPriceWithPrecision;
    uint immutable public xTokenPrecision;
    IERC20 immutable public xToken; //AVAT or other project token.
    uint immutable public XTOKENDonation; // for AVAT: 10_000_000 * (10**18)
    uint immutable public astrLimit; //for AVAT: 10_000_000 * (10**18)
    address immutable public lp; //shouldn't exist before creating this contract

    uint public whiteListStartBlock;
    mapping(address => bool) public whiteList;
    uint public depositStartBlock;
    uint public depositEndBlock;

    mapping(address => uint) public userAstr;
    uint public countedAstrAmount;
    uint public abortedCountedAstrAmount;
    uint public initialAstrAmount;
    uint public initialAstrAmountRemained;

    uint public farmStartBlock;
    mapping(address => uint) public userClaimedAstr;
    mapping(address => bool) public userIsAborted;

    mapping(address => uint) public extraBonus;
    mapping(address => mapping (address => uint)) public extraBonusUserWithdrawn;

    uint public poolId;

    uint public lastIbastrRebalanceBlock;
    /**
     *  0. depositing. Allow ASTR deposit
     *  1. deposit done. Timeup, do not allow ASTR deposit, owner should withdraw maximum `astrWithrawPercentUplimit`% ASTR.
     *  2. create LP. Owner should deposit XTOKEN, add liquidity(100%XTOKEN + 50%ASTR) to Arthswap
     *  3. farming. Start to accumulate ASTR reward, claim ASTR reward, allow to abort and withraw XTOKEN-ASTR LP.
     */
    uint public state;

    event newState(uint _state);

    modifier onlyState(uint _state) {
        require(state == _state, "invalid state");
        _;
    }

    constructor(
        uint _whiteListStartBlock, 
        uint _depositStartBlock, 
        uint _depositEndBlock, 
        uint _fixedPriceWithPrecision,
        IERC20 _xToken,
        uint _XTOKENDonation,
        uint _astrLimit)
    {
        xToken = _xToken;
        setDepostPeriod(_whiteListStartBlock, _depositStartBlock, _depositEndBlock);
        fixedPriceWithPrecision = _fixedPriceWithPrecision;
        xTokenPrecision = 10**(IERC20Metadata(address(xToken)).decimals());
        XTOKENDonation = _XTOKENDonation;
        astrLimit = _astrLimit;

        lp = arthswapFactory.getPair(address(xToken), address(weth));
        require(!isContract(address(lp)), "lp already created");
    }

    function escalateState() internal{
        emit newState(++state);
    }

    //------------------state 0----------------
    receive() external payable {
        if(state == 0){
            _depositASTR(msg.value);
        }else{
            require(state == 3, "receive with invalid state");
        }
    }

    function _depositASTR(uint _amount) internal onlyState(0) {
        if(whiteList[msg.sender]){
            require(block.number >= whiteListStartBlock, "WL haven't started");
        }else{
            require(block.number >= depositStartBlock, "haven't started");
        }

        if(block.number > depositEndBlock){
            escalateState();
            payable(msg.sender).transfer(_amount);

            countedAstrAmount -= 1_000_000; // remained by contract for keeping this contract alive;
            initialAstrAmount = countedAstrAmount;
            initialAstrAmountRemained = countedAstrAmount;
        }else if(countedAstrAmount + _amount >= astrLimit){
            escalateState();
            uint _excessiveAmount = countedAstrAmount + _amount - astrLimit;
            payable(msg.sender).transfer(_excessiveAmount);

            userAstr[msg.sender] += (_amount - _excessiveAmount);
            countedAstrAmount += (_amount - _excessiveAmount);

            countedAstrAmount -= 1_000_000; // remained by contract for keeping this contract alive;
            initialAstrAmount = countedAstrAmount;
            initialAstrAmountRemained = countedAstrAmount;
        }else{
            userAstr[msg.sender] += _amount;
            countedAstrAmount += _amount;
        }
    }

    function setDepostPeriod(uint _whiteListStartBlock, uint _depositStartBlock, uint _depositEndBlock) public onlyOwner onlyState(0){
        require(_depositStartBlock > _whiteListStartBlock, "start > whiteList start");
        require(_depositEndBlock > _depositStartBlock, "end > start");
        whiteListStartBlock = _whiteListStartBlock;
        depositStartBlock = _depositStartBlock;
        depositEndBlock = _depositEndBlock;
    }

    function setWhiteList(bool _isTrue, address[] calldata _addresses) public onlyOwner onlyState(0){
        uint _length = _addresses.length;
        for(uint i = 0; i < _length; i++){
            whiteList[_addresses[i]] = _isTrue;
        }
    }


    //------------------state 1----------------
    function astrWithdraw(uint _percent) external onlyOwner onlyState(1) {
        require(_percent <= astrWithrawPercentUplimit, "_percent invalid");
        escalateState();
        if(_percent > 0){
            uint toWithdrawAmount = countedAstrAmount * _percent / 100;
            countedAstrAmount -= toWithdrawAmount;
            payable(msg.sender).transfer(toWithdrawAmount);   
        }
    }


    //-------------------state 2---------------
    function createLP() external onlyOwner onlyState(2){
        uint _xTokenBalance = xToken.balanceOf(address(this));
        require(_xTokenBalance >= XTOKENDonation, "XTOKEN not enough");

        uint _astrLpAmount = countedAstrAmount * 50 / 90;
        uint _toAddLiquidAmount = _xTokenBalance;
        if(fixedPriceWithPrecision > 0){
            _toAddLiquidAmount = (_astrLpAmount * precision / fixedPriceWithPrecision) * xTokenPrecision / precision;
            if(_toAddLiquidAmount < _xTokenBalance){
                //burn the excessive tokens
                xToken.transfer(address(0), _xTokenBalance - _toAddLiquidAmount);
            }
            _toAddLiquidAmount = xToken.balanceOf(address(this));
        }

        xToken.safeIncreaseAllowance(address(arthswapRouter), _toAddLiquidAmount);
        //todo consider if the LP already created?
        arthswapRouter.addLiquidityETH{value: _astrLpAmount}(address(xToken), _toAddLiquidAmount, 0, 0, address(this), block.timestamp + 600);
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

        rebalanceIbastr();
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

        rebalanceIbastr();
    }


    function claimExtraBonus(address _token) external onlyState(3) returns (uint _amount){
        uint _extraBonus = extraBonus[_token];
        require(_extraBonus > 0, "no extra bonus");
        require(!userIsAborted[msg.sender], "user aborted");

        uint _extraBonusUserWithdrawn = extraBonusUserWithdrawn[_token][msg.sender];
        _amount = userAstr[msg.sender] * precision * _extraBonus / initialAstrAmount / precision - _extraBonusUserWithdrawn;
        extraBonusUserWithdrawn[_token][msg.sender] = _extraBonusUserWithdrawn + _amount;
        IERC20(_token).safeTransfer(msg.sender, _amount);

        rebalanceIbastr();
    }

    function rebalanceIbastr() public onlyState(3){
        if((address(adao) != address(0)) && block.number - lastIbastrRebalanceBlock > 3600){ //gas saving
            uint _farmPeriodInBlocks = farmPeriodInBlocks;
            uint _farmPeriodRemained = farmStartBlock + _farmPeriodInBlocks > (block.number + (24 * 7200)) ? farmStartBlock + _farmPeriodInBlocks - (block.number + (24 * 7200)) : 0;
            uint _targetAstrAmount = (countedAstrAmount * precision * _farmPeriodRemained / _farmPeriodInBlocks / precision);

            uint _targetIbastrAmount = _targetAstrAmount * adao.RATIO_PRECISION() / adao.ratio();
            uint _ibAstrBalance = adao.balanceOf(address(this));
            if(_targetIbastrAmount > _ibAstrBalance){
                uint _toDepositAmount = (_targetIbastrAmount - _ibAstrBalance) * adao.ratio() / adao.RATIO_PRECISION();
                adao.depositFor{value: _toDepositAmount}(payable (address(this)));
            }else if(_targetIbastrAmount < _ibAstrBalance){
                adao.withdrawTo(payable (address(this)), _ibAstrBalance - _targetIbastrAmount);
            }
            lastIbastrRebalanceBlock = block.number;
        }
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
            payable(msg.sender).transfer(address(this).balance - (countedAstrAmount - abortedCountedAstrAmount));
        }else{
            require(_token != lp, "invalid token");
            IERC20(_token).safeTransfer(msg.sender, _amount);
        }
    }

    function _unfarm(uint256 _wantAmt) internal {        
        arthswapFarm.withdraw(poolId, _wantAmt);
    }

    function isContract(address _addr) internal view returns (bool) {
        uint size;
        assembly { size := extcodesize(_addr) }
        return size > 0;
    }
}
