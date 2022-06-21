const Web3 = require('web3');
const fs = require('fs');
const near = require('./near');
const ethereum = require('./ethereum');
const utils = require('./utils');

const ethereumWeb3 = new Web3('https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161');
const moonbeamWeb3 = new Web3('https://moonbase-alpha.public.blastapi.io');

let evmGreetingContracts = {};
let evmComputeContracts = {};
let evmProviders = {};

evmProviders['RINKEBY'] = [ethereumWeb3, 4];
evmProviders['MOONBEAM'] = [moonbeamWeb3, 1287];

// Test account
let testAccountPrivateKey = fs.readFileSync('.secret').toString();

// Load smart contract abi
let greetingRawData = fs.readFileSync('./res/Greetings.json');
let greetingAbi = JSON.parse(greetingRawData).abi;

let ocComputeRawData = fs.readFileSync('./res/OCComputing.json');
let ocComputeAbi = JSON.parse(ocComputeRawData).abi;

// Load advanced smart contract abi
let greetingRawDataAdvanced = fs.readFileSync('./res/GreetingsAdvanced.json');
let greetingAbiAdvanced = JSON.parse(greetingRawDataAdvanced).abi;

// Moonbeam contracts
let moonbeamGreetingContractAddress = '0x4744A2bD04ED29CCf5A3747e3516595fa33330ae';
let moonbeamGreetingContract = new moonbeamWeb3.eth.Contract(greetingAbi, moonbeamGreetingContractAddress);
evmGreetingContracts['MOONBEAM'] = moonbeamGreetingContract;

let moonbeamComputeContractAddress = '0xA2f022E9777fa9c413f1c48312C2fF9A36Cf4940';
let moonbeamComputeContract = new moonbeamWeb3.eth.Contract(ocComputeAbi, moonbeamComputeContractAddress);
evmComputeContracts['MOONBEAM'] = moonbeamComputeContract;

// Rinkeby contracts
let rinkebyGreetingContractAddress = '0x32272DA543c8B7f394B2c0d578bc76A0e7F25Ffe';
let rinkebyGreetingContract = new ethereumWeb3.eth.Contract(greetingAbiAdvanced, rinkebyGreetingContractAddress);
evmGreetingContracts['RINKEBY'] = rinkebyGreetingContract;

// NEAR contract
let nearContractId = '9f9350eb575cae7aac7f85a8c62b08d94dcac70a84e3c765464ff87c669fa4e5';
let nearSumContractId = "a7d1736372266477e0d0295d34ae47622ba50d007031a009976348f954e681fe";
let nearSender = "shanks.testnet";
let nearNetworkId = "testnet";
// const keyFilePath = path.resolve(
//   homedir,
//   `./.near-credentials/${nearNetworkId}/${nearSender}.json`
// );
// const keyFile = require(keyFilePath);
const callGreetingPrivateKey = "ed25519:2ujXoT1SktY2tspiAMimY5ZEji1MNdP1fRCUPqzrpdzkkQ7JkPVDg9nS5BV5Yefb2GgHqaE8anC1KfhGLJmmU3Af";
const callSumPrivateKey = "ed25519:4RPNB4FkrqtEMAm6obq184R5dPrkjRqHBRNuzm1qM1qHMcaxNgbfMcuHyvSVx3HWjxF2hwkrqaGVKMVV5hYj1jV3";
// Get current date
function getCurrentDate() {
  var today = new Date();
  let ret = JSON.stringify(today);
  console.log('date', ret);
  return ret;
}

module.exports = {  
  async sendMessageFromNearToEthereum(chainName) {
    return near.sendTransaction(nearContractId, nearSender, callGreetingPrivateKey, "send_greeting", {to_chain: chainName, title: 'Greetings', content: 'Greeting from NEAR', date: getCurrentDate()})
  },

  async sendOCTaskFromNearToEthereum(chainName, nums) {
    return near.sendTransaction(nearSumContractId, nearSender, callSumPrivateKey, 'send_compute_task', {to_chain: chainName, nums: nums});
  },
  
  async queryMessageFromNear(chainName) {
    const message = await near.contractCall(nearContractId, "get_greeting", { "from_chain": chainName });
    return message;
  },
  
  async queryOCResultFromNear(id) {
    const message = await near.contractCall(nearSumContractId, 'get_compute_task', {id: id});
    return message;
  },

  async sendMessageFromEthereum(fromChain, toChain) {
    await ethereum.sendTransaction(evmProviders[fromChain][0], evmProviders[fromChain][1], evmGreetingContracts[fromChain], 'sendGreeting', testAccountPrivateKey, [toChain, [fromChain, 'Greetings', 'Greeting from ' + fromChain, getCurrentDate()]]);
  },

  async sendOCTaskFromEthereum(fromChain, toChain, nums) {
    await ethereum.sendTransaction(evmProviders[fromChain][0], evmProviders[fromChain][1], evmComputeContracts[fromChain], 'sendComputeTask', testAccountPrivateKey, [toChain, nums]);
    await utils.sleep(5);
    let id = await ethereum.contractCall(evmComputeContracts[fromChain], 'currentId', []);
    return id;
  },
  
  async queryMessageFromEthereum(chainName, id) {
    const message = await ethereum.contractCall(evmGreetingContracts[chainName], 'greetings', [id]);
    return message;
  },
  
  async queryOCResultFromEthereum(chainName, id) {
    const message = await ethereum.contractCall(evmComputeContracts[chainName], 'ocResult', [id]);
    return message;
  },
}