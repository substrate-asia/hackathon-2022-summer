pragma solidity ^0.4.26;

interface IPool{
    function getMemberAddrs() external view returns (address[] memory);
    function getAllDelegators() external view returns(address[] memory);
    function getAllCollators() external view returns(address[] memory);
    function totalSupply() external view returns (uint256);
}

interface IFaucet{
    function leaveNumber() external view returns (uint256);
    function bstate() external view returns (bool);
    function balance() external view returns(uint256);
    function punishCount() external view returns(uint256);
    function getRecordRewardDate() external view returns(uint);
    function getPendingRedeemDate() external view returns(uint);
}

interface IGovernance{
    function blockHeight() external  view returns(uint);
    function getZeroTimeLimit() external  view returns(uint);
    function getRewardDownLimit() external  view returns(uint);
    function stkTokenAddr() external view returns (address);
    function getCalTime() external view returns(uint);
    function getFundsDownLimit() external  view returns(uint);
}

interface IReward{
    function balance() external view returns(uint256);
}

interface IAirdrop{
    function dropLastTime() external view returns(uint256);
}

contract Search{
    IGovernance public Igovern;
    IPool public Ipool;
    IReward public Ireward;
    IAirdrop public Iairdrop;

    constructor() public{
    }

    //克隆合约初始化调用
    function initialize (
        address _governAddr,
        address _poolAddr,
        address _rewardAddr,
        address _airdropAddr
    ) external{
        require(address(Igovern) == address(0),'Igovern seted!');
        Igovern = IGovernance(_governAddr);
        Ipool = IPool(_poolAddr);
        Ireward = IReward(_rewardAddr);
        Iairdrop = IAirdrop(_airdropAddr);
    }

    function getAllDelegators() public view returns(address[] memory){
        return Ipool.getAllDelegators();
    }

    function getAllCollators() public view returns(address[] memory){
        return Ipool.getAllCollators();
    }

    function isScheduleRedeemStake(address _faucetAddr) public view returns(bool){
        return IFaucet(_faucetAddr).bstate()
        && IFaucet(_faucetAddr).leaveNumber() == 0
        && IFaucet(_faucetAddr).getPendingRedeemDate() > 0;
    }

    function isExecuteRedeemStake(address _faucetAddr) public view returns(bool){
        return IFaucet(_faucetAddr).leaveNumber() > 0
        && IFaucet(_faucetAddr).leaveNumber()+Igovern.blockHeight() <= block.number;
    }

    function isZeroIncomePunish(address _faucetAddr) public view returns(bool){
        return IFaucet(_faucetAddr).bstate()
        && IFaucet(_faucetAddr).leaveNumber() == 0
        && IFaucet(_faucetAddr).punishCount() >= Igovern.getZeroTimeLimit();
    }

    function isRecordRewardInfo(address _faucetAddr) public view returns(bool){
        return IFaucet(_faucetAddr).bstate()
        && IFaucet(_faucetAddr).getRecordRewardDate() < block.timestamp / (24 * 60 * 60);
    }

    function isSendReward(address _faucetAddr) public view returns(bool){
        return IFaucet(_faucetAddr).bstate()
        && IFaucet(_faucetAddr).leaveNumber() == 0
        && IFaucet(_faucetAddr).balance() >= Igovern.getRewardDownLimit();
    }

    function isAssignReward() public view returns(bool){
        return Igovern.stkTokenAddr() != address(0)
        && Igovern.getCalTime() > 0
        && Ireward.balance() > 0;
    }

    function startDrop() public view returns(bool){
        return Igovern.stkTokenAddr() != address(0)
        && (block.timestamp - Iairdrop.dropLastTime()) / (60 * 60 *24) > 0
        && Igovern.getCalTime() > 0
        && Ipool.totalSupply() >= Igovern.getFundsDownLimit()
        && Ipool.getMemberAddrs().length > 0;
    }
}