const Web3 = require('web3');
const fs = require('fs');
const ethereum = require('./ethereum');

// const web3 = new Web3('https://api.avax-test.network/ext/bc/C/rpc');
const web3 = new Web3('wss://devnetopenapi2.platon.network/ws');
// const web3 = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
const crossChainContractAddress = '0xE52426FF0FD5f80bFC2B71Db1cf6354d68dB0f4c';
const nearOCContractAddress = 'a7d1736372266477e0d0295d34ae47622ba50d007031a009976348f954e681fe';
const CHAIN_ID = 2203181;

// Test account
let testAccountPrivateKey = fs.readFileSync('.secret').toString();

// OC smart contract address
const address = fs.readFileSync('./build/oc.json');
const contractAddress = JSON.parse(address).OCContractAddress;

// Load contract abi, and init oc contract object
const ocRawData = fs.readFileSync('./build/contracts/OCComputing.json');
const ocAbi = JSON.parse(ocRawData).abi;
const ocContract = new web3.eth.Contract(ocAbi, contractAddress);

(async function init() {
  // destination chain name
  const destinationChainName = 'NEAR';

  // OCComputing contract action name
  const receiveTaskActionName = 'receiveComputeTask';
  const receiveResultActionName = 'receiveComputeTaskCallback';

  // OCComputing contract destination action name
  const destReceiveTaskActionName = 'receive_compute_task';
  const destReceiveResultActionName = 'receive_compute_result';

  // OCComputing action each param type
  const receiveTaskParamsType = 'uint256[]';
  const receiveResultParamsType = 'uint256';

  // OCComputing action each param name
  const receiveTaskParamsName = 'nums';
  const receiveResultParamsName = 'result';

  // OCComputing action abi
  const receiveTaskABI = '{"inputs":[{"internalType":"uint256[]","name":"_nums","type":"uint256[]"}],"name":"receiveComputeTask","outputs":[],"stateMutability":"nonpayable","type":"function"}';

  // OCComputing callback abi
  const receiveResultABI = '{"inputs":[{"internalType":"uint256","name":"_result","type":"uint256"}],"name":"receiveComputeTaskCallback","outputs":[],"stateMutability":"nonpayable","type":"function"}';

  // Set cross chain contract address
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'setCrossChainContract', testAccountPrivateKey, [crossChainContractAddress]);
  // Register contract info for sending messages to other chains
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'registerDestnContract', testAccountPrivateKey, [receiveTaskActionName, destinationChainName, nearOCContractAddress, destReceiveTaskActionName]);
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'registerDestnContract', testAccountPrivateKey, [receiveResultActionName, destinationChainName, nearOCContractAddress, destReceiveResultActionName]);
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'registerMessageABI', testAccountPrivateKey, [destinationChainName, nearOCContractAddress, destReceiveTaskActionName, receiveTaskParamsType, receiveTaskParamsName]);
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'registerMessageABI', testAccountPrivateKey, [destinationChainName, nearOCContractAddress, destReceiveResultActionName, receiveResultParamsType, receiveResultParamsName]);

  // Register contract info for receiving messages from other chains.
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'registerPermittedContract', testAccountPrivateKey, [destinationChainName, nearOCContractAddress, receiveTaskActionName]);
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'registerPermittedContract', testAccountPrivateKey, [destinationChainName, nearOCContractAddress, receiveResultActionName]);
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'registerContractABI', testAccountPrivateKey, [receiveTaskActionName, receiveTaskABI]);
  await ethereum.sendTransaction(web3, CHAIN_ID, ocContract, 'registerCallbackAbi', testAccountPrivateKey, [destinationChainName, nearOCContractAddress, destReceiveTaskActionName, receiveResultABI]);
}());
