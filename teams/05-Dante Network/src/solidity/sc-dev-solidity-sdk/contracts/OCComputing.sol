// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./CrossChain/ContractAdvanced.sol";
import "./IOCComputing.sol";

// `OCComputing` is an example of multi-chain services with necessary implementations in `ContractAdvanced`, which provides basic cross-chain call interfaces.
contract OCComputing is ContractAdvanced, IOCComputing {
    // Destination contract info
    struct DestnContract {
        string contractAddress; // destination contract address
        string funcName; // destination contract action name
        bool used;
    }

    struct OCResult {
        bool used;
        uint256 result;
    }

    // Cross-chain destination contract map
    mapping(string => mapping(string => DestnContract)) public destnContractMap;

    // Cross-chain permitted contract map
    mapping(string => mapping(string => string)) public permittedContractMap;

    // Outsourcing computing data cache
    mapping(uint256 => uint256[]) cachedData;
    // Outsourcing computing result
    mapping(uint256 => OCResult) public ocResult;
    // Current id
    uint256 public currentId;
    
    /**
     * Send outsourcing computing task to other chain
     * @param _toChain - to chain name
     * @param _nums - nums to be accumulated
     */
    function sendComputeTask(string calldata _toChain, uint[] calldata _nums) external {
        mapping(string => DestnContract) storage map = destnContractMap[_toChain];
        DestnContract storage destnContract = map["receiveComputeTask"];
        require(destnContract.used, "action not registered");

        bytes memory data = abi.encode(_nums);
        SQOS memory sqos = SQOS(0);
        uint id = crossChainCall(
            _toChain,
            destnContract.contractAddress,
            destnContract.funcName,
            sqos,
            data
        );
        cachedData[id] = _nums;
        currentId = id;
    }

    /**
     * Receives outsourcing computing task from other chain
     * @param _nums - nums to be accumulated
     */
    function receiveComputeTask(uint[] calldata _nums) external {
        require(
            msg.sender == address(crossChainContract),
            "Locker: caller is not CrossChain"
        );
        
        // compute
        uint ret = 0;
        for (uint i = 0; i < _nums.length; i++) {
            ret += _nums[i];
        }

        // send result back
        SimplifiedMessage memory context = getContext();
        mapping(string => DestnContract) storage map = destnContractMap[context.fromChain];
        DestnContract storage destnContract = map["receiveComputeTaskCallback"];
        require(destnContract.used, "action not registered");

        bytes memory data = abi.encode(ret);
        SQOS memory sqos = SQOS(0);
        crossChainRespond(destnContract.funcName, sqos, data);
    }

    /**
     * See IOCComputing
     */
    function receiveComputeTaskCallback(uint _result) external override {
        SimplifiedMessage memory context = getContext();
        OCResult storage result = ocResult[context.session.id];
        result.used = true;
        result.result = _result;
    }

    ///////////////////////////////////////////////
    /////    Send messages to other chains   //////
    ///////////////////////////////////////////////

    /**
     * Register destination contract info
     * @param _funcName - function name to be called
     * @param _toChain - destination chain name
     * @param _contractAddress - destination contract address
     * @param _contractFuncName - contract function name
     */
    function registerDestnContract(
        string calldata _funcName,
        string calldata _toChain,
        string calldata _contractAddress,
        string calldata _contractFuncName
    ) external onlyOwner {
        mapping(string => DestnContract) storage map = destnContractMap[_toChain];
        DestnContract storage destnContract = map[_funcName];
        destnContract.contractAddress = _contractAddress;
        destnContract.funcName = _contractFuncName;
        destnContract.used = true;
    }

    ///////////////////////////////////////////////
    ///    Receive messages from other chains   ///
    ///////////////////////////////////////////////

    /**
     * Authorize contracts of other chains to call the functions of this contract
     * @param _chainName - from chain name
     * @param _sender - sender of cross chain message
     * @param _funcName - action name which allowed to be invoked
     */
    function registerPermittedContract(
        string calldata _chainName,
        string calldata _sender,
        string calldata _funcName
    ) external onlyOwner {
        mapping(string => string) storage map = permittedContractMap[
            _chainName
        ];
        map[_funcName] = _sender;
    }

    /**
     * This verify method will be invoked by the CrossChain contract automatically, ensure that only registered contract(registerSourceContract) calls are allowed
     * @param _chainName - chain name of cross chain message
     * @param _funcName - contract action name of cross chain message
     * @param _sender - cross chain message sender
     */
    //  Will be deprecated soon
    function verify(
        string calldata _chainName,
        string calldata _funcName,
        string calldata _sender
    ) public view virtual returns (bool) {
        mapping(string => string) storage map = permittedContractMap[
            _chainName
        ];
        string storage sender = map[_funcName];
        require(
            keccak256(bytes(sender)) == keccak256(bytes(_sender)),
            "Sender does not match"
        );
        return true;
    }
}
