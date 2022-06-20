// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ContractBase.sol";

contract ContractAdvanced is ContractBase {
    mapping(bytes32 => string) public callbackAbis;

    /**
     * Callback ABI used to decode data responded by other chain
     * @param _destnChainName - destination chain name
     * @param _destnContractName - destination contract name
     * @param _funcName - destination contract function name
     * @param _callbackAbi - data abi
     */
    function registerCallbackAbi(
        string calldata _destnChainName,
        string calldata _destnContractName,
        string calldata _funcName,
        string calldata _callbackAbi
    ) external onlyOwner {
        bytes32 hash = keccak256(abi.encodePacked(_destnChainName, _destnContractName, _funcName));
        callbackAbis[hash] = _callbackAbi;
    }

    ///////////////////////////////////////////////
    /////  Cross-chain call to other chains  //////
    ///////////////////////////////////////////////

    /**
     * Cross chain call
     * @param _destnChainName - destination chain name
     * @param _destnContractName - destination contract name
     * @param _funcName - destination contract function name
     * @param _sqos - security parameters
     * @param _data - cross chain data
     */
    function crossChainCall(string memory _destnChainName, string memory _destnContractName,
        string memory _funcName, SQOS memory _sqos, bytes memory _data) internal returns (uint256) {
        return crossChainContract.sendMessage(_destnChainName, _destnContractName, _funcName, _sqos, _data, Session(1, 0));
    }

    ///////////////////////////////////////////////
    ///// Cross-chain respond to other chains//////
    ///////////////////////////////////////////////

    /**
     * Cross chain respond
     * @param _funcName - destination contract function name
     * @param _sqos - security parameters
     * @param _data - cross chain data
     */
    function crossChainRespond(string memory _funcName, SQOS memory _sqos, bytes memory _data) internal returns (uint256) {
        SimplifiedMessage memory context = getContext();
        return crossChainContract.sendMessage(context.fromChain, context.sender, _funcName, _sqos, _data, Session(2, context.id));
    }
}
