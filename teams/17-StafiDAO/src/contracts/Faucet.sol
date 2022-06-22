// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;
import "./StakingInterface.sol";
import "./AuthorMappingInterface.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

interface IAirdrop{
    function zeroIncomePunish(uint _leaseDate,uint256 _amount) external;
    function unlockLeaseMargin(
        address _account,
        uint _leaseDate,
        uint256 _amount
    ) external;
}

interface IGovernance{
    function getRewardDownLimit() external  view returns(uint);
    function getZeroTimeLimit() external  view returns(uint);
    function stkTokenAddr() external view returns (address);
    function retTokenAddr() external view returns (address);
    function rewardAddr() external view returns (address);
    function authorAmount() external view returns(uint256);
    function blockHeight() external  view returns(uint);
    function getCollatorTechFee() external  view returns(uint);
    function getDaoTechFee() external  view returns(uint);
    function ownerAddress() external view returns (address);
    function dayLen() external  view returns(uint);
}

contract Faucet{
    using SafeMath for uint256;

    IGovernance public Igovern;
    IAirdrop public Iairdrop;

    //水龙头类型
    bool public faucetType;//真收集人，假为委托人
    //委托收集人地址(faucetType为假有效)
    address public collatorAddr;
    //收集人技术服务奖励地址(faucetType为真有效)
    address public techAddr;
    //租赁日期数组，按序号排
    uint[] public leaseDates;
    //总的租赁数
    uint256 public leaseTotal = 0;
    //租赁状态
    bool public bstate = false;
    //退出减少租赁时所在区块高度
    uint256 public leaveNumber = 0;
    //绑定的nimbusId
    bytes32 public nimbusId = 0;

    //租赁信息
    struct LeaseInfo{
        uint period;//租赁周期:1个周期为30天，2个周期为60天，依次类推
        uint256 amount;//租赁票数
        uint256 totAmount;//每日总租赁票数
        uint256 totMarginAmount;//每日总抵押票数
        address redeemAddr;//抵押赎回地址
        bool redeemFlag;//抵押赎回标记
        bool bflag;//是否有效
    }
    mapping(uint => LeaseInfo) public leaseInfos;
    //预编译地址
    address private constant precompileAddress = 0x0000000000000000000000000000000000000800;
    address private constant precompileAuthorMappingAddr = 0x0000000000000000000000000000000000000807;
    //预编译接口对象
    ParachainStaking public staking;
    AuthorMapping public authorMapping;
    //无奖励计数
    uint public punishCount = 0;
    //奖励记录信息(每日一次)
    struct DayRewardInfo{
        uint rdDate;//最新奖励日期
        uint256 rdAmount;//最新奖励账户余额
    }
    DayRewardInfo public dayRewardInfo;
    //收集人管理者
    address public faucetOwner;
    //合约sudo地址
    address public owner;
    //lock锁
    bool private unlocked = true;

    event SendReward(uint256 _reward);

    event RecordRewardInfo(uint _rdDate,uint256 _rdAmount);

    event LeaveRedeem(uint256 _leaveNumber);

    event Association(bytes32 _nimbusId);

    event RedeemState(bool _success);

    constructor (){
    }

    //克隆合约初始化调用
    function initialize (
        address _governAddr,
        address _collatorAddr,
        address _techAddr,
        address _faucetOwner,
        bool _faucetType,
        address _owner
    ) external{
        require(address(Igovern) == address(0),'Igovern seted!');
        Igovern = IGovernance(_governAddr);
        staking = ParachainStaking(precompileAddress);
        faucetOwner = _faucetOwner;
        owner = _owner;
        faucetType = _faucetType;
        if(faucetType){
            techAddr = _techAddr;
            authorMapping = AuthorMapping(precompileAuthorMappingAddr);
        }else{
            collatorAddr = _collatorAddr;
        }
        //克隆合约需要初始化非默认值非constant的参数值
        unlocked = true;
    }

    fallback () external payable{}

    receive () external payable{
        //判断发送地址是否来自Pool，来自Pool则调用激活委托人或为委托人增加选票
        if(Igovern.stkTokenAddr() == msg.sender){
            if(bstate){
                //增加收集人/委托人选票
                updateFaucet();
            }else{
                //激活收集人/委托人
                ActivateFaucet();
            }
        }
    }

    modifier isOwner() {
        require(msg.sender == owner,'Not management!');
        _;
    }

    function setGovernAddr(address _governAddr) public isOwner{
        Igovern = IGovernance(_governAddr);
    }

    modifier isFaucetOwner() {
        require(msg.sender == faucetOwner,'Not management!');
        _;
    }

    modifier lock() {
        require(unlocked, 'Faucet: LOCKED!');
        unlocked = false;
        _;
        unlocked = true;
    }

    //激活收集人/委托人
    function ActivateFaucet() private {
        uint leaseDate = block.timestamp.div(24 * 60 * 60);
        LeaseInfo memory info = leaseInfos[leaseDate];
        require(info.bflag && info.amount > 0 && address(this).balance >= info.amount,'ActivateFaucet: info is illegal!');
        //开始抵押
        if(faucetType){
            staking.join_candidates(info.amount, staking.candidate_count());
        }else{
            staking.delegate(collatorAddr, info.amount, staking.candidate_delegation_count(collatorAddr), staking.delegator_delegation_count(address(this)));
        }
        leaseTotal += info.amount;
        bstate = true;
    }

    //增加选票
    function updateFaucet() private {
        uint leaseDate = block.timestamp.div(24 * 60 * 60);
        LeaseInfo memory info = leaseInfos[leaseDate];
        require(info.bflag && info.amount > 0 && address(this).balance >= info.amount,'updateFaucet: info is illegal!');
        //开始抵押
        if(faucetType){
            staking.candidate_bond_more(info.amount);
        }else{
            staking.delegator_bond_more(collatorAddr, info.amount);
        }
        leaseTotal += info.amount;
    }

    //按地址日期租赁时限记录选票信息,_amount、_marginAmount单位为Wei
    function setLeaseInfo(
        address _redeemAddr,
        uint _leaseDate,
        uint _period,
        uint256 _amount,
        uint256 _marginAmount
    ) public{
        require(_period > 0,'setLeaseInfo: period is illegal!');
        require(_leaseDate > 0,'setLeaseInfo: _leaseDate is illegal!');
        require(Igovern.stkTokenAddr() == msg.sender,'setLeaseInfo: msg.sender is illegal!');//保证从Pool发起
        require(leaveNumber == 0,'redeeming!');
        LeaseInfo memory info = leaseInfos[_leaseDate];
        if(info.period == 0){
            leaseDates.push(_leaseDate);
        }
        info.amount = _amount;
        info.totMarginAmount = info.totMarginAmount.add(_marginAmount);
        if(info.bflag){
            info.totAmount = info.totAmount.add(_amount);
        }else{
            info.totAmount = _amount;
            info.bflag = true;
        }
        info.period = _period;
        info.redeemFlag = false;
        info.redeemAddr = _redeemAddr;
        leaseInfos[_leaseDate] = info;
    }

    //奖励收集人
    function collatorReward(uint256 reward) private{
        uint256 daoFee = reward.mul(Igovern.getDaoTechFee()).div(100);
        Address.sendValue(payable(Igovern.ownerAddress()), daoFee);
        uint256 techFee = reward.mul(Igovern.getCollatorTechFee()).div(100);
        Address.sendValue(payable(techAddr), techFee);
        Address.sendValue(payable(Igovern.rewardAddr()), reward.sub(techFee).sub(daoFee));
    }

    //奖励收集人
    function delegatorReward(uint256 reward) private{
        uint256 daoFee = reward.mul(Igovern.getDaoTechFee()).div(100);
        Address.sendValue(payable(Igovern.ownerAddress()), daoFee);
        Address.sendValue(payable(Igovern.rewardAddr()), reward.sub(daoFee));
    }

    //抵押收益，发送到奖励池（定时器执行）
    function sendReward() public{
        require(bstate,'sendReward: not delegator or collator!');
        require(leaveNumber == 0,'sendReward: redeeming!');
        uint256 reward = address(this).balance;
        require(reward >= Igovern.getRewardDownLimit(),'sendReward: balance is not enough!');
        if(faucetType){
            collatorReward(reward);
        }else{
            delegatorReward(reward);
        }
        emit SendReward(reward);
    }

    //每日记录一次奖励信息（定时器执行）
    function recordRewardInfo() public{
        require(bstate,'recordRewardInfo: not delegator or collator!');
        uint rdDate = block.timestamp.div(24 * 60 * 60);
        require(dayRewardInfo.rdDate < rdDate,'recordRewardInfo: rdDate is illegal!');
        if(dayRewardInfo.rdDate > 0 && dayRewardInfo.rdAmount == address(this).balance){
            punishCount += rdDate.sub(dayRewardInfo.rdDate);
        }
        dayRewardInfo.rdDate = rdDate;
        dayRewardInfo.rdAmount = address(this).balance;
        emit RecordRewardInfo(rdDate,address(this).balance);
    }

    //零收益处罚，并强制计划回收选票（定时器执行）
    function zeroIncomePunish() public lock{
        require(bstate,'zeroIncomePunish: not delegator  or collator!');
        require(leaveNumber == 0,'redeeming!');
        require(punishCount >= Igovern.getZeroTimeLimit(),'zeroIncomePunish: punishCount is not enough!');
        Iairdrop = IAirdrop(Igovern.retTokenAddr());
        for(uint i = 0;i < leaseDates.length; i++){
            uint leaseDate = leaseDates[i];
            LeaseInfo memory info = leaseInfos[leaseDate];
            if(info.bflag){
                info.bflag = false;
                leaseInfos[leaseDate] = info;
                Iairdrop.zeroIncomePunish(leaseDate,info.totMarginAmount);
            }
        }
        //强制计划回收
        bstate = false;
        leaveNumber = block.number;
        if(faucetType){
            staking.schedule_leave_candidates(staking.candidate_count());
        }else{
            staking.schedule_leave_delegators();
        }
        emit LeaveRedeem(leaveNumber);
    }

    //按选票信息正常计划回收选票（定时器执行）
    function scheduleRedeemStake() public lock{
        require(bstate,'not delegator or collator!');
        require(leaveNumber == 0,'redeeming!');
        //赎回抵押
        LeaseInfo memory info;
        uint redeemDate = 0;
        for(uint i = 0;i < leaseDates.length; i++){
            uint leaseDate = leaseDates[i];
            info = leaseInfos[leaseDate];
            if(info.bflag && leaseDate.add(info.period * Igovern.dayLen()) <= block.timestamp.div(24 * 60 * 60)){
                redeemDate = leaseDate;
                break;
            }
        }
        require(redeemDate > 0,'scheduleRedeem is not exists!');
        //根据数量判断是否委托退出或是部分赎回
        leaveNumber = block.number;
        if(leaseTotal.sub(info.totAmount) < staking.min_delegation()){
            bstate = false;
            if(faucetType){
                staking.schedule_leave_candidates(staking.candidate_count());
            }else{
                staking.schedule_leave_delegators();
            }
        }else{
            info.redeemFlag = true;
            leaseInfos[redeemDate] = info;
            if(faucetType){
                staking.schedule_candidate_bond_less(info.totAmount);
            }else{
                staking.schedule_delegator_bond_less(collatorAddr, info.totAmount);
            }
        }
        emit LeaveRedeem(leaveNumber);
    }
    //确认已计划回收的选票，并返还到质押池Pool（定时器执行）
    function executeRedeemStake() public lock{
        require(leaveNumber > 0,'Redeem schedule is not exists!');
        //判断区块高度是否到达设定高度
        require(leaveNumber.add(Igovern.blockHeight()) <= block.number,'not yet reached!');
        leaveNumber = 0;
        Iairdrop = IAirdrop(Igovern.retTokenAddr());
        if(!bstate){
            if(faucetType){
                //这里需要判断是否计划是否已经被执行
                if(staking.candidate_exit_is_pending(address(this))){
                    staking.execute_leave_candidates(address(this),staking.candidate_delegation_count(address(this)));
                }
                if(nimbusId > 0){
                    authorMapping.clear_association(nimbusId);
                    nimbusId = 0;
                }
                //奖励收集人
                uint256 reward = address(this).balance.sub(leaseTotal);
                Address.sendValue(payable(Igovern.stkTokenAddr()), leaseTotal);
                leaseTotal = 0;
                if(reward > 0){
                    collatorReward(reward);
                }
            }else{
                //这里需要判断是否计划是否已经被执行
                if(staking.delegator_exit_is_pending(address(this))){
                    staking.execute_leave_delegators(address(this),staking.delegator_delegation_count(address(this)));
                }
                //奖励委托人
                uint256 reward = address(this).balance.sub(leaseTotal);
                Address.sendValue(payable(Igovern.stkTokenAddr()), leaseTotal);
                leaseTotal = 0;
                if(reward > 0){
                    delegatorReward(reward);
                }
            }
            for(uint i = 0;i < leaseDates.length; i++){
                uint leaseDate = leaseDates[i];
                LeaseInfo memory info = leaseInfos[leaseDate];
                if(info.bflag){
                    info.bflag = false;
                    leaseInfos[leaseDate] = info;
                    Iairdrop.unlockLeaseMargin(info.redeemAddr,leaseDate,info.totMarginAmount);
                }
            }
        }else{
            for(uint i = 0;i < leaseDates.length; i++){
                uint leaseDate = leaseDates[i];
                LeaseInfo memory info = leaseInfos[leaseDate];
                if(info.bflag && info.redeemFlag){
                    info.bflag = false;
                    info.redeemFlag = false;
                    leaseInfos[leaseDate] = info;
                    if(faucetType){
                        //这里需要判断是否计划是否已经被执行
                        if(staking.candidate_request_is_pending(address(this))){
                            staking.execute_candidate_bond_less(address(this));
                        }
                    }else {
                        //这里需要判断是否计划是否已经被执行
                        if(staking.delegation_request_is_pending(address(this), collatorAddr)){
                            staking.execute_delegation_request(address(this),collatorAddr);
                        }
                    }
                    leaseTotal = leaseTotal.sub(info.totAmount);
                    Address.sendValue(payable(Igovern.stkTokenAddr()), info.totAmount);
                    Iairdrop.unlockLeaseMargin(info.redeemAddr,leaseDate,info.totMarginAmount);
                    break;
                }
            }
        }
        emit RedeemState(true);
    }

    //添加NimbusId，用于绑定钱包奖励(收集人)
    function addAssociation(bytes32 newNimbusId) public isOwner(){
        require(faucetType && bstate,'not collator!');
        require(address(this).balance >= Igovern.authorAmount(),'balance not enough!');
        authorMapping.add_association(newNimbusId);
        nimbusId = newNimbusId;
        emit Association(nimbusId);
    }

    //更新NimbusId(收集人)
    function updateAssociation(bytes32 oldNimbusId,bytes32 newNimbusId) public isOwner(){
        require(nimbusId > 0,'Association not binded!');
        authorMapping.update_association(oldNimbusId,newNimbusId);
        nimbusId = newNimbusId;
        emit Association(nimbusId);
    }

    //原生质押token余额
    function balance() public view returns(uint256){
        return address(this).balance;
    }

    function getRecordRewardDate() public view returns(uint){
        return dayRewardInfo.rdDate;
    }

    function getPendingRedeemDate() public view returns(uint){
        uint redeemDate = 0;
        for(uint i = 0;i < leaseDates.length; i++){
            uint leaseDate = leaseDates[i];
            LeaseInfo memory info = leaseInfos[leaseDate];
            uint expiryDate = leaseDate.add(info.period * Igovern.dayLen());
            if(info.bflag
                && expiryDate <= block.timestamp.div(24 * 60 * 60)){
                redeemDate = leaseDate;
                break;
            }
        }
        return redeemDate;
    }

    function getPendingRedeemAmount() public view returns(uint){
        uint redeemAmount = 0;
        if(!bstate){
            if(leaveNumber > 0){
                redeemAmount = leaseTotal;
            }
        }else{
            for(uint i = 0;i < leaseDates.length; i++){
                uint leaseDate = leaseDates[i];
                LeaseInfo memory info = leaseInfos[leaseDate];
                if(info.bflag  && info.redeemFlag){
                    redeemAmount = info.totAmount;
                    break;
                }
            }
        }
        return redeemAmount;
    }

//    function startDelegate(address collator) public payable {
//        staking.delegate(collator, msg.value, staking.candidate_delegation_count(collator), staking.delegator_delegation_count(address(this)));
//    }
//
//    function scheduleExitDelegate() public{
//        staking.schedule_leave_delegators();
//        leaveNumber = block.number;
//    }
//
//    function executeExitDelegate() public{
//        staking.execute_leave_delegators(address(this),staking.delegator_delegation_count(address(this)));
//    }
//
//    function executeExitDelegatePending() public{
//        if(staking.delegator_exit_is_pending(address(this))){
//            leaveNumber = 0;
//            staking.execute_leave_delegators(address(this),staking.delegator_delegation_count(address(this)));
//        }
//    }
//
//    function redeemStake(address redeem) public{
//        Address.sendValue(payable(redeem), address(this).balance);
//    }
}