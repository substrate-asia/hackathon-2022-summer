// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IPool{
    function totalSupply() external view returns (uint256);
    function balanceOf(address _account) external view returns (uint256);
    function memberTimes(address _account) external view returns (uint256);
}

contract Governance{
    using SafeMath for uint256;
    //节点配置信息
    struct DAOConfig{
        uint daoTechFee;//技术方手续费2%
        uint collatorTechFee;//收集人服务费12%
        uint fundsDownLimit;//节点投资抵押最低下限1000
        uint fundsUpLimit;//投资抵押上限5000000
        uint perInvestDownLimit;//每人次投资抵押下限1
        uint voterProportion;//投票参与票数有效比例51%
        uint rewardDownLimit;//最低分配奖励额度10
        uint calTime ;//租赁收益和空投起始计算时限2
        uint redeemTimeLimit;//Pool最低赎回时限2
        uint zeroTimeLimit;//收集人和委托人零受益时限3
        uint marginProportion;//收集人和委托人租赁保证金比例（retToken）5/10
        uint proposalDownLimit;//发起提案最低数量10000
    }
    DAOConfig private daoConfig;

    //stkToken地址
    address public stkTokenAddr;
    //retToken地址
    address public retTokenAddr;
    //奖励地址
    address public rewardAddr;
    //查询地址
    address public searchAddr;

    //绑定NimbusId抵押
    uint256 public authorAmount;
    //计划退出区块高度
    uint public blockHeight;

    //技术方手续费最低限制
    uint public constant daoTechLimit = 1;
    //收集人服务费最低限制
    uint public constant collatorTechLimit = 10;
    //投票参与票数最低比例限制
    uint public constant voterDownLimit = 51;
    //retToken空投比例
    uint public constant dropProportion = 20;
    //每区间peroid包含的天数
    uint public constant dayLen = 3;//默认10
    //奖励类型
    bool public constant rewardType = true; //true奖励stkToken fals奖励质押Token

    //提案编号,顺序递增
    uint public currentNumber = 0;
    //提案对象
    struct GovernanceInfo{
        uint governType; //提案类型:每个配置参数为一个类型
        uint256 startDate;//治理开始时间
        uint256 endDate;//治理结束时间
        uint uintValue;//治理更新数值
        string strValue;//治理更新url,用于非参数外部治理
        uint256 totalVoter;//应投票总票数
        uint approveVoter;//赞成票
        uint opposeVoter;//反对票
        uint8 governState; //治理状态 0未开始 1进行中 2成功 3失败 4过期
    }
    //提案信息,governanceInfos[number]=info,number表示提案编号,info表示提案对象
    mapping(uint => GovernanceInfo) private governanceInfos;
    //提案投票governanceVotes[number][adr]=state,number表示提案编号,adr表示投票人,state表示投票状态0未投票 1赞成 2反对
    mapping(uint => mapping (address => uint)) private governanceVotes;
    //记录提案类型的提案最新结束时间governEndDate[type]=date,type表示提案类型,date表示提案最新结束时间
    mapping(uint => uint256) private governEndDate;
    //合约sudo地址
    address public owner;
    //质押池
    IPool public Ipool;
    //ether常量
    uint256 public constant etherBase = 1000000000000000000;

    event StartGovern(
        address indexed creator,
        uint number,
        uint governType,
        uint256 startDate,
        uint256 endDate,
        uint uintValue,
        string strValue,
        uint256 totalVoter);

    event VoteByNumber(
        address indexed votor,
        uint number,
        uint governType,
        uint state,
        uint voters);

    constructor(){
    }

    //克隆合约初始化调用,_authorAmount单位为Wei
    function initialize(
        uint256 _authorAmount,
        uint _blockHeight,
        address _owner
    ) external {
        require(owner == address(0),'owner seted!');
        require(_authorAmount > 0 && _blockHeight > 0,'parameter is illegal!');
        authorAmount = _authorAmount;
        blockHeight = _blockHeight;
        owner = _owner;

        daoConfig.daoTechFee = 2;
        daoConfig.collatorTechFee = 12;
        daoConfig.fundsDownLimit =  1 * etherBase;//部署时根据实际网络调整500-5000
        daoConfig.fundsUpLimit =  5000000 * etherBase;
        daoConfig.perInvestDownLimit =  1 * etherBase;
        daoConfig.voterProportion =  51;
        daoConfig.rewardDownLimit = 1 * etherBase;//部署时默认10
        daoConfig.calTime =  1;//部署时默认2
        daoConfig.redeemTimeLimit =  1;//部署时默认2
        daoConfig.zeroTimeLimit =  1;//部署时默认3
        daoConfig.marginProportion = 1;//部署时默认5
        daoConfig.proposalDownLimit = 1 * etherBase;//部署时默认10000
    }

    modifier isGovernance() {
        //pool开启治理，达到投资下限
        require(Ipool.totalSupply() >= daoConfig.fundsDownLimit,'not start governance!');
        _;
    }

    modifier isGovernOwner() {
        require(msg.sender == owner,'Not management!');
        //pool未开启治理，未达到投资下限
        require(Ipool.totalSupply() < daoConfig.fundsDownLimit,'start governance!');
        _;
    }

    function setStkTokenAddr(address _stkTokenAddr) public{
        require(stkTokenAddr == address(0) || msg.sender == owner,'Seted or Not management!');
        stkTokenAddr = _stkTokenAddr;
        Ipool = IPool(_stkTokenAddr);
    }

    function setRewardAddr(address _rewardAddr) public{
        require(rewardAddr == address(0) || msg.sender == owner,'Seted or Not management!');
        rewardAddr = _rewardAddr;
    }

    function setRetTokenAddr(address _retTokenAddr) public{
        require(retTokenAddr == address(0) || msg.sender == owner,'Seted or Not management!');
        retTokenAddr = _retTokenAddr;
    }

    function setSearchAddr(address _searchAddr) public{
        require(searchAddr == address(0) || msg.sender == owner,'Seted or Not management!');
        searchAddr = _searchAddr;
    }

    function setDaoTechFee(uint _daoTechFee) public isGovernOwner{
        require(_daoTechFee >= daoTechLimit,'_daoTechFee is illegal!');
        daoConfig.daoTechFee = _daoTechFee;
    }

    function setCollatorTechFee(uint _collatorTechFee) public isGovernOwner{
        require(_collatorTechFee >= collatorTechLimit,'_collatorTechFee is illegal!');
        daoConfig.collatorTechFee = _collatorTechFee;
    }

    //_fundsDownLimit单位为Wei
    function setFundsDownLimit(uint _fundsDownLimit) public isGovernOwner{
        daoConfig.fundsDownLimit = _fundsDownLimit;
    }

    //_fundsUpLimit单位为Wei
    function setFundsUpLimit(uint _fundsUpLimit) public isGovernOwner{
        daoConfig.fundsUpLimit =  _fundsUpLimit;
    }

    //_perInvestDownLimit单位为Wei
    function setPerInvestDownLimit(uint _perInvestDownLimit) public isGovernOwner{
        daoConfig.perInvestDownLimit =  _perInvestDownLimit;
    }

    function setVoterProportion(uint _voterProportion) public isGovernOwner{
        require(_voterProportion >= voterDownLimit,'_voterProportion is illegal!');
        daoConfig.voterProportion =  _voterProportion;
    }

    //_rewardDownLimit单位为Wei
    function setRewardDownLimit(uint _rewardDownLimit) public isGovernOwner{
        daoConfig.rewardDownLimit = _rewardDownLimit;
    }

    function setCalTime(uint _calTime) public isGovernOwner{
        daoConfig.calTime =  _calTime;
    }

    function setRedeemTimeLimit(uint _redeemTimeLimit) public isGovernOwner{
        daoConfig.redeemTimeLimit =  _redeemTimeLimit;
    }

    function setZeroTimeLimit(uint _zeroTimeLimit) public isGovernOwner{
        daoConfig.zeroTimeLimit =  _zeroTimeLimit;
    }

    function setMarginProportion(uint _marginProportion) public isGovernOwner{
        daoConfig.marginProportion = _marginProportion;
    }

    //_proposalDownLimit单位为Wei
    function setProposalDownLimit(uint _proposalDownLimit) public isGovernOwner{
        daoConfig.proposalDownLimit = _proposalDownLimit;
    }

    //治理开启
    function _setGovern(uint _uintValue
    ,string memory _strValue
    ,uint _governType
    ,uint256 _startDate
    ,uint256 _endDate) private {
        require(_startDate > block.timestamp && _startDate < _endDate,'Date is illegal!');
        require(governEndDate[_governType] == 0 || governEndDate[_governType] < _startDate,'Governing!');
        //获取pool的stkToken，达到要求数量则允许提案
        require(Ipool.balanceOf(msg.sender) >= daoConfig.proposalDownLimit,'Balance less than proposalDownLimit!');
        uint day = (block.timestamp).sub(Ipool.memberTimes(msg.sender)).div(60 * 60 *24);
        require(day >= daoConfig.calTime,'stakeTime less than calTime!');
        uint256 voters = Ipool.totalSupply();
        GovernanceInfo memory info;
        currentNumber = currentNumber.add(1);
        info.governType = _governType;
        info.startDate = _startDate;
        info.endDate = _endDate;
        info.uintValue = _uintValue;
        info.strValue = _strValue;
        info.totalVoter = voters;
        info.approveVoter = 0;
        info.opposeVoter = 0;
        info.governState = 0;
        governanceInfos[currentNumber] = info;
        governEndDate[_governType] = _endDate;
        emit StartGovern(msg.sender,currentNumber,_governType,_startDate,_endDate,_uintValue,_strValue,voters);
    }

    //开启技术方手续费治理
    function startDTGovern(
        uint _daoTechFee,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        require(_daoTechFee >= daoTechLimit,'_daoTechFee is illegal!');
        _setGovern(_daoTechFee, '', 0, _startDate, _endDate);
    }

    //开启收集人服务费治理
    function startCTGovern(
        uint _collatorTechFee,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        require(_collatorTechFee >= collatorTechLimit,'_collatorTechFee is illegal!');
        _setGovern(_collatorTechFee, '', 1, _startDate, _endDate);
    }

    //开启投资抵押最低下限治理,_fundsDownLimit单位为Wei
    function startFDLGovern(
        uint _fundsDownLimit,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_fundsDownLimit, '', 2, _startDate, _endDate);
    }

    //开启投资抵押上限治理,_fundsUpLimit单位为Wei
    function startFULGovern(
        uint _fundsUpLimit,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_fundsUpLimit, '', 3, _startDate, _endDate);
    }

    //开启每人次投资抵押下限治理,_perInvestDownLimit单位为Wei
    function startPIDLGovern(
        uint _perInvestDownLimit,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_perInvestDownLimit, '', 6, _startDate, _endDate);
    }

    //开启投票参与票数比例治理
    function startVPGovern(
        uint _voterProportion,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        require(_voterProportion >= voterDownLimit,'_voterProportion is illegal!');
        _setGovern(_voterProportion, '', 7, _startDate, _endDate);
    }

    //开启最低分配奖励额度治理,_rewardDownLimit单位为Wei
    function startRDGovern(
        uint _rewardDownLimit,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_rewardDownLimit, '', 8, _startDate, _endDate);
    }

    //开启租赁收益和空投起始计算时限治理
    function startCATGovern(
        uint _calTime,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_calTime, '', 9, _startDate, _endDate);
    }

    //开启Pool最低赎回时限治理
    function startRTLGovern(
        uint _redeemTimeLimit,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_redeemTimeLimit, '', 11, _startDate, _endDate);
    }

    //开启收集人和委托人零受益时限治理
    function startZTLGovern(
        uint _zeroTimeLimit,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_zeroTimeLimit, '', 12, _startDate, _endDate);
    }

    //开启收集人和委托人租赁保证金比例治理
    function startMPGovern(
        uint _marginProportion,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_marginProportion, '', 13, _startDate, _endDate);
    }

    //开启发起提案最低数量治理,_proposalDownLimit单位为Wei
    function startPDLGovern(
        uint _proposalDownLimit,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(_proposalDownLimit, '', 14, _startDate, _endDate);
    }

    //开启外部治理
    function startUrlGovern(
        string memory _urlPath,
        uint256 _startDate,
        uint256 _endDate
    ) public isGovernance{
        _setGovern(0, _urlPath, 15, _startDate, _endDate);
    }

    //治理投票
    function _setVote(
        uint _governType,
        uint _number,
        uint _state
    ) private returns (bool success,uint uintValue){
        require(_number > 0,'_number is illegal!');
        require(_state > 0 && _state < 3,'_state is illegal!');
        GovernanceInfo memory info = governanceInfos[_number];
        require(info.startDate <= block.timestamp && info.endDate >= block.timestamp,'Governace is not started or ended!');
        require(info.governType == _governType ,'governType is illegal!');
        require(info.totalVoter > 0 ,'totalVoter is illegal!');
        require(governanceVotes[_number][msg.sender] == 0,'Voted!');

        require(Ipool.balanceOf(msg.sender) > 0,'Balance is zero!');
        require(Ipool.memberTimes(msg.sender) < info.startDate,'stakeTime not enought!');

        uint day = (info.startDate).sub(Ipool.memberTimes(msg.sender)).div(60 * 60 *24);
        require(day >= daoConfig.calTime,'stakeTime less than calTime!');

        governanceVotes[_number][msg.sender] = _state;
        if(_state == 1){
            info.approveVoter = info.approveVoter.add(Ipool.balanceOf(msg.sender));
        }else if(_state == 2){
            info.opposeVoter = info.opposeVoter.add(Ipool.balanceOf(msg.sender));
        }
        if(info.approveVoter.mul(100).div(info.totalVoter) >= daoConfig.voterProportion){
            info.endDate = block.timestamp;
            governEndDate[_governType] = block.timestamp;
            info.governState = 2;
        }else if(info.opposeVoter.mul(100).div(info.totalVoter) > (100 - daoConfig.voterProportion)){
            info.endDate = block.timestamp;
            governEndDate[_governType] = block.timestamp;
            info.governState = 3;
        }
        governanceInfos[_number] = info;
        emit VoteByNumber(msg.sender,_number,_governType,_state,Ipool.balanceOf(msg.sender));
        return (info.governState == 2,info.uintValue);
    }

    //技术方手续费治理投票
    function voteTPByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(0, _number, _state);
        if(success){
            //治理成功
            daoConfig.daoTechFee = uintValue;
        }
    }

    //收集人服务费治理投票，_state表示投票状态1赞成 2反对
    function voteCTByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(1, _number, _state);
        if(success){
            //治理成功
            daoConfig.collatorTechFee = uintValue;
        }
    }

    //节点投资抵押最低下限治理投票
    function voteFDLByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(2, _number, _state);
        if(success){
            //治理成功
            daoConfig.fundsDownLimit = uintValue;
        }
    }

    //投资抵押上限治理投票
    function voteFULByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(3, _number, _state);
        if(success){
            //治理成功
            daoConfig.fundsUpLimit = uintValue;
        }
    }

    //每人次投资抵押下限治理投票
    function votePIDLByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(6, _number, _state);
        if(success){
            //治理成功
            daoConfig.perInvestDownLimit = uintValue;
        }
    }

    //投票参与票数比例治理投票
    function voteVPByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(7, _number, _state);
        if(success){
            //治理成功
            daoConfig.voterProportion = uintValue;
        }
    }

    //最低分配奖励额度治理投票
    function voteRDByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(8, _number, _state);
        if(success){
            //治理成功
            daoConfig.rewardDownLimit = uintValue;
        }
    }

    //租赁收益和空投起始计算时限治理投票
    function voteCATByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(9, _number, _state);
        if(success){
            //治理成功
            daoConfig.calTime = uintValue;
        }
    }

    //Pool最低赎回时限治理投票
    function voteRTLByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(11, _number, _state);
        if(success){
            //治理成功
            daoConfig.redeemTimeLimit = uintValue;
        }
    }

    //收集人和委托人零受益时限治理投票
    function voteZTLByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(12, _number, _state);
        if(success){
            //治理成功
            daoConfig.zeroTimeLimit = uintValue;
        }
    }

    //收集人和委托人租赁保证金比例治理投票
    function voteMPByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(13, _number, _state);
        if(success){
            //治理成功
            daoConfig.marginProportion = uintValue;
        }
    }

    //发起提案最低数量治理投票
    function votePDLByNumber(uint _number,uint _state) public {
        (bool success,uint uintValue) = _setVote(14, _number, _state);
        if(success){
            //治理成功
            daoConfig.proposalDownLimit = uintValue;
        }
    }

    //外部治理投票
    function voteURLByNumber(uint _number,uint _state) public {
        _setVote(15, _number, _state);
    }

    //查看技术方手续费
    function getDaoTechFee() public  view returns(uint){
        return daoConfig.daoTechFee;
    }

    //查看收集人服务费
    function getCollatorTechFee() public  view returns(uint){
        return daoConfig.collatorTechFee;
    }

    //查看节点投资抵押最低下限
    function getFundsDownLimit() public  view returns(uint){
        return daoConfig.fundsDownLimit;
    }

    //查看投资抵押上限
    function getFundsUpLimit() public  view returns(uint){
        return daoConfig.fundsUpLimit;
    }

    //查看每人次投资抵押下限
    function getPerInvestDownLimit() public  view returns(uint){
        return daoConfig.perInvestDownLimit;
    }

    //查看投票参与票数有效比例
    function getVoterProportion() public  view returns(uint){
        return daoConfig.voterProportion;
    }

    //查看最低分配奖励额度
    function getRewardDownLimit() public  view returns(uint){
        return daoConfig.rewardDownLimit;
    }

    //查看租赁收益和空投起始计算时限
    function getCalTime() public  view returns(uint){
        return daoConfig.calTime;
    }

    //查看Pool最低赎回时限
    function getRedeemTimeLimit() public  view returns(uint){
        return daoConfig.redeemTimeLimit;
    }

    //查看收集人和委托人零受益时限
    function getZeroTimeLimit() public  view returns(uint){
        return daoConfig.zeroTimeLimit;
    }

    //查看收集人和委托人租赁保证金比例（retToken）
    function getMarginProportion() public  view returns(uint){
        return daoConfig.marginProportion;
    }

    //查看发起提案最低数量
    function getProposalDownLimit() public  view returns(uint){
        return daoConfig.proposalDownLimit;
    }

    //查看治理信息,根据提案编号 governState表示0未开始 1进行中 2成功 3失败 4过期
    function getGovernanceInfo(uint _number) public view returns(
        uint governType,
        uint256 startDate,
        uint256 endDate,
        uint uintValue,
        string memory strValue,
        uint256 totalVoter,
        uint approveVoter,
        uint opposeVoter,
        uint8 governState
    ){
        GovernanceInfo memory info = governanceInfos[_number];
        if(info.governState == 0){
            if(info.startDate > block.timestamp){
                governState = 0;
            }else if(info.startDate <= block.timestamp && block.timestamp <= block.timestamp){
                governState = 1;
            }else{
                governState = 4;
            }
        }else{
            governState = info.governState;
        }
        return (
        info.governType,
        info.startDate,
        info.endDate,
        info.uintValue,
        info.strValue,
        info.totalVoter,
        info.approveVoter,
        info.opposeVoter,
        governState);
    }

    //查看治理投票结束日期,根据提案类型
    function getGovernEndDate(uint _governType) public view returns(uint256){
        return governEndDate[_governType];
    }

    //查看治理投票状态,根据提案编号和地址
    function getGovernanceVote(uint _number,address _addr) public view returns(uint){
        return governanceVotes[_number][_addr];
    }
}