// SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

interface IGovernance{
    function initialize(
        uint256 _authorAmount,
        uint _blockHeight,
        address _owner
    ) external;
    function setStkTokenAddr(address _stkTokenAddr) external;
    function setRetTokenAddr(address _retTokenAddr) external;
    function setRewardAddr(address _rewardAddr) external;
    function setSearchAddr(address _searchAddr) external;
    function stkTokenAddr() external view returns (address);
    function retTokenAddr() external view returns (address);
    function rewardAddr() external view returns (address);
    function searchAddr() external view returns (address);
}

interface IPool{
    function initialize (
        address _governAddr,
        address _owner,
        string memory name_,
        string memory symbol_,
        address _faucetModelAddr
    ) external;
    function faucetModelAddr() external view returns (address);
}

interface IAirdrop{
    function initialize (
        address _governAddr,
        string memory name_,
        string memory symbol_,
        address _account,
        uint _amount,
        address _owner
    ) external;
}

interface IReward{
    function initialize (address _governAddr, address _owner) external;
}

interface ISearch{
    function initialize (
        address _governAddr,
        address _poolAddr,
        address _rewardAddr,
        address _airdropAddr
    ) external;
}

contract Factory is Ownable{
    mapping(uint => address) private daoAddrs;
    uint public len = 0;
    //governance模板地址
    address  public governModelAddr;
    //pool模板地址
    address  public poolModelAddr;
    //airdrop模板地址
    address  public airdropModelAddr;
    //reward模板地址
    address  public rewardModelAddr;
    //faucet模板地址
    address public faucetModelAddr;
    //search模板地址
    address public searchModelAddr;

    function createClone(address target) internal returns (address result) {
        bytes20 targetBytes = bytes20(target);
        assembly {
            let clone := mload(0x40)
            mstore(clone, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(clone, 0x14), targetBytes)
            mstore(add(clone, 0x28), 0x5af43d82803e903d91602b57fd5bf30000000000000000000000000000000000)
            result := create(0, clone, 0x37)
        }
    }

    function createDAO(
        uint256 _authorAmount, //100000000000000000000
        uint _blockHeight,//1200 部署时根据实际网络调整
        string memory _stkName,//stkToken票据所有权
        string memory _stkSymbol,//stkToken
        string memory _retName,//retToken票据使用权
        string memory _retSymbol,//retToken
        uint _retAmount//10000000000000000000000
    ) public onlyOwner(){
        require(governModelAddr != address(0)
        && poolModelAddr != address(0)
        && airdropModelAddr != address(0)
        && rewardModelAddr != address(0)
        && faucetModelAddr != address(0)
            && searchModelAddr != address(0),'ModelAddress not seted!');
        IGovernance Igovern = IGovernance(createClone(governModelAddr));
        Igovern.initialize(_authorAmount,_blockHeight,msg.sender);

        IPool Ipool = IPool(createClone(poolModelAddr));
        Ipool.initialize(address(Igovern),msg.sender,_stkName,_stkSymbol,faucetModelAddr);

        //设置Government的stkToken地址
        Igovern.setStkTokenAddr(address(Ipool));

        IAirdrop Iairdrop = IAirdrop(createClone(airdropModelAddr));
        Iairdrop.initialize(address(Igovern),_retName,_retSymbol,msg.sender,_retAmount,msg.sender);

        //设置Government的retToken地址
        Igovern.setRetTokenAddr(address(Iairdrop));

        IReward Ireward = IReward(createClone(rewardModelAddr));
        Ireward.initialize(address(Igovern),msg.sender);

        //设置Government的奖励地址
        Igovern.setRewardAddr(address(Ireward));

        ISearch Isearch = ISearch(createClone(searchModelAddr));
        Isearch.initialize(address(Igovern),address(Ipool),address(Ireward),address(Iairdrop));

        //设置Government的查询地址
        Igovern.setSearchAddr(address(Isearch));

        daoAddrs[len] = address(Igovern);
        len += 1;
    }

    function setGovernModelAddr(address _modelAddr) public onlyOwner(){
        governModelAddr = _modelAddr;
    }

    function setPoolModelAddr(address _modelAddr) public onlyOwner(){
        poolModelAddr = _modelAddr;
    }

    function setAirdropModelAddr(address _modelAddr) public onlyOwner(){
        airdropModelAddr = _modelAddr;
    }

    function setRewardModelAddr(address _modelAddr) public onlyOwner(){
        rewardModelAddr = _modelAddr;
    }

    function setFaucetModelAddr(address _modelAddr) public onlyOwner(){
        faucetModelAddr = _modelAddr;
    }

    function setSearchModelAddr(address _modelAddr) public onlyOwner(){
        searchModelAddr = _modelAddr;
    }

    function getDaoAddrs(uint _index) public view returns(address[] memory){
        address[] memory addrs = new address[](6);
        if(daoAddrs[_index] != address(0)){
            IGovernance Igovern = IGovernance(daoAddrs[_index]);
            addrs[0] = daoAddrs[_index];
            addrs[1] = Igovern.stkTokenAddr();
            addrs[2] = Igovern.retTokenAddr();
            addrs[3] = Igovern.rewardAddr();
            addrs[4] = Igovern.searchAddr();
            IPool Ipool = IPool(Igovern.stkTokenAddr());
            addrs[5] = Ipool.faucetModelAddr();
        }
        return addrs;
    }
}