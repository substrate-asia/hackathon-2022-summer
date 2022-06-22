// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;
import "./StakingInterface.sol";
import "./AuthorMappingInterface.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract AdouCollator is AccessControl {
    using SafeMath for uint256;
    //成员角色权限
    bytes32 private MEMBER;
    //预编译地址
    address private constant precompileStakingAddr =
        0x0000000000000000000000000000000000000800;
    address private constant precompileAuthorMappingAddr =
        0x0000000000000000000000000000000000000807;
    //预编译接口对象
    ParachainStaking private staking;
    AuthorMapping private authorMapping;
    //抵押总量
    uint256 private totalStake;
    //收集成员抵押量
    mapping(address => uint256) private memberStakes;
    //收集成员赎回量
    mapping(address => uint256) private memberRedeems;

    //节点配置信息
    struct NodeConfig {
        uint256 techProportion; //技术服务比例
        uint256 fundsDownLimit; //节点投资抵押最低下限
        uint256 perInvestDownLimit; //每人次投资抵押下限
        uint256 rewardDownLimit; //最低分配奖励额度
        uint256 scheduleTime; //网络解绑时长
        uint256 authorMappingLimit; //authorid映射绑定额度
    }
    NodeConfig private nodeConfig;

    //赎回参数配置
    struct RedeemConfig {
        uint256 bondLess; //计划赎回解绑数
        address bondLessAddr; //计划赎回解绑地址
        uint256 bondLessTime; //计划赎回时间
    }
    RedeemConfig private redeemConfig;

    //节点启动时间,时间戳
    uint256 private nodeStartDate;
    //技术服务费最低比例限制
    uint256 private constant techDownLimit = 20;
    //治理开启标记
    bool private governanceFlag = false;
    //收集成员人数
    uint256 private memberTotal = 0;
    //实际收集成员人数
    uint256 private memberReal = 0;
    //收集成员地址
    mapping(uint256 => address) private memberAddrs;
    //收集成员奖励
    mapping(address => uint256) private memberRewards;
    //总奖励
    uint256 private totalReward = 0;
    //待领取奖励
    uint256 private pendingReward = 0;
    //计划解散时间
    uint256 private leaveTime;
    //合约sudo地址
    address private ownerAddress;
    //默认单位长度
    uint256 private constant unitLength = 1000000000000000000;
    //AuthorId奖励绑定标记
    bool private associationFlag = false;

    constructor(
        uint256 _techProportion,
        uint256 _fundsDownLimit,
        uint256 _perInvestDownLimit,
        uint256 _nodeStartDate,
        uint256 _rewardDownLimit,
        address _techRewardAddr,
        uint256 _scheduleTime,
        uint256 _authorMappingLimit
    ) {
        nodeConfig.techProportion = _techProportion;
        nodeConfig.fundsDownLimit = _fundsDownLimit.mul(unitLength);
        nodeConfig.perInvestDownLimit = _perInvestDownLimit.mul(unitLength);
        nodeConfig.rewardDownLimit = _rewardDownLimit.mul(unitLength);
        nodeStartDate = _nodeStartDate;
        nodeConfig.scheduleTime = _scheduleTime;
        nodeConfig.authorMappingLimit = _authorMappingLimit.mul(unitLength);
        ownerAddress = msg.sender;
        staking = ParachainStaking(precompileStakingAddr);
        authorMapping = AuthorMapping(precompileAuthorMappingAddr);
        //技术服务奖励地址
        MEMBER = bytes32(uint256(uint160(address(this))) << 96);
        memberAddrs[memberTotal] = _techRewardAddr;
        memberTotal = memberTotal.add(1);
        _setupRole(MEMBER, _techRewardAddr);
    }

    modifier isOwner() {
        require(msg.sender == ownerAddress, "Not management!");
        _;
    }

    fallback() external payable {}

    receive() external payable {}

    //sudo权限
    function setParameter(
        uint256 _techProportion,
        uint256 _fundsDownLimit,
        uint256 _perInvestDownLimit,
        uint256 _nodeStartDate,
        uint256 _rewardDownLimit,
        address _techRewardAddr,
        uint256 _scheduleTime,
        uint256 _authorMappingLimit
    ) public isOwner {
        require(!governanceFlag, "Node started!");
        require(
            _techProportion >= techDownLimit,
            "_techProportion is illegal!"
        );
        if (memberAddrs[0] != _techRewardAddr) {
            require(
                !hasRole(MEMBER, _techRewardAddr),
                "TechRewardAddr is not Member!"
            );
            if (memberRedeems[memberAddrs[0]] > 0) {
                memberRedeems[_techRewardAddr] = memberRedeems[memberAddrs[0]];
                memberRedeems[memberAddrs[0]] = 0;
            }
            _revokeRole(MEMBER, memberAddrs[0]);
            memberAddrs[0] = _techRewardAddr;
            _setupRole(MEMBER, _techRewardAddr);
        }
        nodeConfig.techProportion = _techProportion;
        nodeConfig.fundsDownLimit = _fundsDownLimit.mul(unitLength);
        nodeConfig.perInvestDownLimit = _perInvestDownLimit.mul(unitLength);
        nodeConfig.rewardDownLimit = _rewardDownLimit.mul(unitLength);
        nodeStartDate = _nodeStartDate;
        nodeConfig.scheduleTime = _scheduleTime;
        nodeConfig.authorMappingLimit = _authorMappingLimit.mul(unitLength);
    }

    //分配当前奖励
    function _assign(uint256 newReward) private {
        uint256 stakeReward = newReward.sub(
            newReward.mul(nodeConfig.techProportion).div(100)
        );
        for (uint256 i = 1; i < memberTotal; i++) {
            address ra = memberAddrs[i];
            if (memberStakes[ra] > 0) {
                uint256 reward = stakeReward.mul(memberStakes[ra]).div(
                    totalStake
                );
                memberRedeems[ra] = memberRedeems[ra].add(reward);
                memberRewards[ra] = memberRewards[ra].add(reward);
                newReward = newReward.sub(reward);
            }
        }
        address ta = memberAddrs[0];
        memberRedeems[ta] = memberRedeems[ta].add(newReward);
        memberRewards[ta] = memberRewards[ta].add(newReward);
    }

    //节点计划解散
    function scheduleLeaveStake() public isOwner {
        //从收集节点计划赎回抵押
        require(governanceFlag, "Node not started!");
        governanceFlag = false;
        leaveTime = block.timestamp;
        staking.schedule_leave_candidates(staking.candidate_count());
    }

    //节点执行解散
    function executeLeaveStake() public {
        require(
            leaveTime > 0 &&
                (leaveTime + nodeConfig.scheduleTime) < block.timestamp,
            "LeaveTime is not up!"
        );
        //从收集节点赎回抵押
        staking.execute_leave_candidates(
            address(this),
            staking.candidate_delegation_count(address(this))
        );
        leaveTime = 0;
        redeemConfig.bondLess = 0;
        redeemConfig.bondLessAddr = address(0);
        redeemConfig.bondLessTime = 0;
        //存在未分配奖励
        if ((address(this).balance) - pendingReward > totalStake) {
            uint256 newReward = (address(this).balance).sub(pendingReward).sub(
                totalStake
            );
            totalReward = totalReward.add(newReward);
            _assign(newReward);
        }
        pendingReward = address(this).balance;
        //抵押转入赎回
        for (uint256 i = 1; i < memberTotal; i++) {
            address ra = memberAddrs[i];
            if (memberStakes[ra] > 0) {
                memberRedeems[ra] = memberRedeems[ra].add(memberStakes[ra]);
                memberStakes[ra] = 0;
            }
        }
        memberTotal = 1;
        totalReward = 0;
        memberReal = 0;
        nodeStartDate = 0;
        totalStake = 0;
    }

    //节点抵押
    function addStake() external payable {
        require(msg.sender != memberAddrs[0], "StakeAddr is tech!");
        require(block.timestamp < nodeStartDate, "StakeTime is expired!");
        require(
            msg.value >= nodeConfig.perInvestDownLimit,
            "Less than perInvestDownLimit!"
        );
        if (!hasRole(MEMBER, msg.sender)) {
            memberAddrs[memberTotal] = msg.sender;
            memberTotal = memberTotal.add(1);
            memberReal = memberReal.add(1);
            _setupRole(MEMBER, msg.sender);
        }
        memberStakes[msg.sender] = memberStakes[msg.sender].add(msg.value);
        totalStake = totalStake.add(msg.value);
    }

    //增加节点抵押
    function addMoreStake() external payable onlyRole(MEMBER) {
        require(msg.sender != memberAddrs[0], "StakeAddr is tech!");
        require(governanceFlag, "Node not started!");
        memberStakes[msg.sender] = memberStakes[msg.sender].add(msg.value);
        totalStake = totalStake.add(msg.value);
        staking.candidate_bond_more(msg.value);
    }

    //计划赎回节点抵押，同一时间段只能赎回一次,amount默认为wei
    function scheduleRedeemStake(uint256 amount) public onlyRole(MEMBER) {
        require(governanceFlag, "Node not started!");
        require(
            amount > 0 && amount <= memberStakes[msg.sender],
            "Amount is illegal!"
        );
        require(
            totalStake - amount >= nodeConfig.fundsDownLimit,
            "Less than fundsDownLimit!"
        );
        require(redeemConfig.bondLessAddr == address(0), "Scheduling!");
        //从提名节点赎回抵押
        redeemConfig.bondLess = amount;
        redeemConfig.bondLessAddr = msg.sender;
        redeemConfig.bondLessTime = block.timestamp;
        staking.schedule_candidate_bond_less(amount);
    }

    //赎回节点抵押
    function executeRedeemStake() public {
        require(
            redeemConfig.bondLessTime > 0 &&
                (redeemConfig.bondLessTime + nodeConfig.scheduleTime) <
                block.timestamp,
            "BondLessTime is not up!"
        );
        staking.execute_candidate_bond_less(address(this));
        pendingReward = pendingReward.add(redeemConfig.bondLess);
        memberStakes[redeemConfig.bondLessAddr] = memberStakes[
            redeemConfig.bondLessAddr
        ].sub(redeemConfig.bondLess);
        if (memberStakes[redeemConfig.bondLessAddr] == 0) {
            memberReal = memberReal.sub(1);
        }
        memberRedeems[redeemConfig.bondLessAddr] = memberRedeems[
            redeemConfig.bondLessAddr
        ].add(redeemConfig.bondLess);
        totalStake = totalStake.sub(redeemConfig.bondLess);
        redeemConfig.bondLess = 0;
        redeemConfig.bondLessAddr = address(0);
        redeemConfig.bondLessTime = 0;
    }

    //节点开启（关闭抵押）500个才可用此事件
    function start() public {
        require(!governanceFlag, "Node started!");
        require(
            block.timestamp >= nodeStartDate && nodeStartDate > 0,
            "Node not started!"
        );
        require(
            address(this).balance >= totalStake &&
                totalStake >= nodeConfig.fundsDownLimit,
            "TotalStake is illegal!"
        );
        //开始进行收集人抵押
        staking.join_candidates(totalStake, staking.candidate_count());
        governanceFlag = true;
    }

    //添加NimbusId，用于绑定钱包奖励
    function addAssociation(bytes32 nimbusId) external payable isOwner {
        require(governanceFlag, "Node not started!");
        require(
            msg.value == nodeConfig.authorMappingLimit,
            "authorMappingLimit is illegal"
        );
        authorMapping.add_association(nimbusId);
        associationFlag = true;
    }

    //更新NimbusId
    function updateAssociation(bytes32 oldNimbusId, bytes32 newNimbusId)
        public
        isOwner
    {
        require(associationFlag, "Association not binded!");
        authorMapping.update_association(oldNimbusId, newNimbusId);
    }

    //清除NimbusId
    function clearAssociation(bytes32 nimbusId) public isOwner {
        require(associationFlag, "Association not binded!");
        require(!governanceFlag, "Node started!");
        require(leaveTime == 0, "Node disbanding!");
        authorMapping.clear_association(nimbusId);
        associationFlag = false;
    }

    //赎回authorid映射绑定
    function redemmAssociation(address payable account) public isOwner {
        require(!associationFlag, "Association binded!");
        require(
            address(this).balance - pendingReward >=
                nodeConfig.authorMappingLimit,
            "balance not enough!"
        );
        Address.sendValue(account, nodeConfig.authorMappingLimit);
    }

    //节点众贷失败解散 节点没启动成功退回用这个事件
    function failBackStake() public {
        require(!governanceFlag, "Node started!");
        require(leaveTime == 0, "Node disbanding!");
        require(memberTotal > 1, "memberTotal is illegal!");
        require(
            block.timestamp >= nodeStartDate && nodeStartDate > 0,
            "Node not started!"
        );
        require(
            totalStake < nodeConfig.fundsDownLimit,
            "TotalStake is illegal!"
        );
        for (uint256 i = 1; i < memberTotal; i++) {
            address ra = memberAddrs[i];
            if (memberStakes[ra] > 0) {
                memberRedeems[ra] = memberRedeems[ra].add(memberStakes[ra]);
                memberStakes[ra] = 0;
            }
        }
        pendingReward = address(this).balance;
        memberTotal = 1;
        totalReward = 0;
        memberReal = 0;
        nodeStartDate = 0;
        totalStake = 0;
    }

    //申领奖励
    function claimRedeem(address payable account) public onlyRole(MEMBER) {
        require(account != address(0), "Account is illegal!");
        require(memberRedeems[msg.sender] > 0, "MemberRedeems is illegal!");
        require(
            pendingReward <= address(this).balance,
            "PendingReward is illegal!"
        );
        uint256 reddeem = memberRedeems[msg.sender];
        require(pendingReward - reddeem >= 0, "PendingReward not enough!");
        pendingReward = pendingReward.sub(reddeem);
        memberRedeems[msg.sender] = 0;
        if (memberStakes[msg.sender] == 0) {
            _revokeRole(MEMBER, msg.sender);
        }
        Address.sendValue(account, reddeem);
    }

    //奖励分配
    function assignRewards() public {
        require(associationFlag, "Association not binded!");
        // require(redeemConfig.bondLessAddr == address(0),'Scheduling!');
        require(
            (address(this).balance) - pendingReward >=
                nodeConfig.rewardDownLimit,
            "Balance not enough!"
        );
        uint256 newReward = (address(this).balance).sub(pendingReward);
        pendingReward = address(this).balance;
        totalReward = totalReward.add(newReward);
        _assign(newReward);
    }

    //抵押转让
    function fundsTransfer(address account) public onlyRole(MEMBER) {
        require(
            account != memberAddrs[0] &&
                msg.sender != account &&
                account != address(0),
            "Account is illegal!"
        );
        require(memberStakes[msg.sender] > 0, "No stake!");
        if (!hasRole(MEMBER, account)) {
            memberAddrs[memberTotal] = account;
            memberTotal = memberTotal.add(1);
            memberReal = memberReal.add(1);
            _setupRole(MEMBER, account);
        }
        memberStakes[account] = memberStakes[account].add(
            memberStakes[msg.sender]
        );
        memberStakes[msg.sender] = 0;
        memberReal = memberReal.sub(1);
        if (memberRedeems[msg.sender] == 0) {
            _revokeRole(MEMBER, msg.sender);
        }
    }

    //获取节点当前余额
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    //查看奖励
    function getReward() public view returns (uint256) {
        return memberRewards[msg.sender];
    }

    //查看赎回
    function getRedeem() public view returns (uint256) {
        return memberRedeems[msg.sender];
    }

    //查看抵押
    function getStake() public view returns (uint256) {
        return memberStakes[msg.sender];
    }

    //查看节点总抵押
    function getTotalStake() public view returns (uint256) {
        return totalStake;
    }

    //查看抵押所占比例
    function getStakeProportion() public view returns (uint256) {
        if (totalStake <= 0) {
            return 0;
        }
        return memberStakes[msg.sender].mul(100).div(totalStake);
    }

    //查看节点总奖励
    function getTotalReward() public view returns (uint256) {
        return totalReward;
    }

    //查看节点待领取奖励
    function getPendingReward() public view returns (uint256) {
        return pendingReward;
    }

    //查看年化奖励
    function getAnnualReward() public view returns (uint256) {
        if (totalStake <= 0 || block.timestamp < nodeStartDate) {
            return 0;
        }
        uint256 day = ((block.timestamp).sub(nodeStartDate)).div(60 * 60 * 24);
        if (day <= 0) {
            return 0;
        }
        return totalReward.mul(365 * 100).div(totalStake).div(day);
    }

    //查看节点成员人数
    function getMemberReal() public view returns (uint256) {
        return memberReal;
    }

    //查看节点历史成员总人数
    function getMemberTotal() public view returns (uint256) {
        return memberTotal;
    }

    //根据索引查看节点成员地址
    function getMemberByIndex(uint256 _index) public view returns (address) {
        return memberAddrs[_index];
    }

    //查看节点开启日期
    function getNodeStartDate() public view returns (uint256) {
        return nodeStartDate;
    }

    //查看计划解散时间
    function getLeaveTime() public view returns (uint256) {
        return leaveTime;
    }

    //查看节点状态 0未开启 1开启 2解散中 3已解散
    function getNodeState() public view returns (uint256) {
        uint256 state = 0;
        if (governanceFlag) {
            state = 1;
        } else if (leaveTime > 0) {
            state = 2;
        } else if (nodeStartDate == 0) {
            state = 3;
        }
        return state;
    }

    //查看节点配置信息
    function getNodeConfig() public view returns (NodeConfig memory) {
        return nodeConfig;
    }

    //查看赎回信息
    function getRedeemConfig() public view returns (RedeemConfig memory) {
        return redeemConfig;
    }
}
