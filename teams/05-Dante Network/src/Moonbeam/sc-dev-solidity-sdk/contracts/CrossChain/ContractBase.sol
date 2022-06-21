// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@hthuang/contracts/interfaces/ICrossChain.sol";

contract ContractBase is Ownable {
    // Message ABI used to encode/decode messages sent from this contract
    struct MessageABI {
        string parametertypes; // action params' type
        string parameterNames; // action params' name
    }

    // desination contract action mapping
    mapping(bytes => MessageABI) public messageABIMap;

    // source contract action mapping
    mapping(string => string) public contractABIMap;

    // Dante cross chain contract
    ICrossChain public crossChainContract;

    /**
     * Set cross chain contract
     * @param _address - cross chain contract address
     */
    function setCrossChainContract(address _address) public onlyOwner {
        crossChainContract = ICrossChain(_address);
    }

    ///////////////////////////////////////////////
    /////    Send messages to other chains   //////
    ///////////////////////////////////////////////

    /**
     * message ABI used to encode/decode messages sent from this contract
     * @param _destnChainName - destination chain name
     * @param _destnContractName - destination contract name
     * @param _funcName - destination contract function name
     * @param _paramType - action param types
     * @param _paramName - action param name
     */
    function registerMessageABI(
        string calldata _destnChainName,
        string calldata _destnContractName,
        string calldata _funcName,
        string calldata _paramType,
        string calldata _paramName
    ) external onlyOwner {
        MessageABI memory info = MessageABI(_paramType, _paramName);
        messageABIMap[
            abi.encodePacked(_destnChainName, _destnContractName, _funcName)
        ] = info;
    }

    /**
     * Get Registered message ABI to encode/decode message
     * @param _destnChainName - destination chain name
     * @param _destnContractName - destination contract name
     * @param _funcName - destination contract function name
     */
    function getMessageABI(
        string calldata _destnChainName,
        string calldata _destnContractName,
        string calldata _funcName
    ) external view returns (MessageABI memory) {
        return
            messageABIMap[
                abi.encodePacked(_destnChainName, _destnContractName, _funcName)
            ];
    }

    ///////////////////////////////////////////////
    ///    Receive messages from other chains   ///
    ///////////////////////////////////////////////

    /**
     * contract ABI used to encode/decode messages sent to this contract
     * @param _funcName - contract action name
     * @param _contractABI - contract action abi
     */
    function registerContractABI(
        string calldata _funcName,
        string calldata _contractABI
    ) external virtual onlyOwner {
        crossChainContract.registerInterface(_funcName, _contractABI);
    }

    // return context info
    function getContext() public view returns (SimplifiedMessage memory) {
        return crossChainContract.getCurrentMessage();
    }
}
