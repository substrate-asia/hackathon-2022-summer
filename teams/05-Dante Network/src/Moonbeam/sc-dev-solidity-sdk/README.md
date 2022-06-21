# solidity-contract-template

## Currently
**This is a high level SDK for solidity developers!**
* A high level SDK to make your dApps Omnichain accessible.
* The API which makes Omnichain contract invocations very easy is at `./contracts/CrossChain/ContractAdvanced.sol`
* The contract example for a simple message communication is at `contracts/Greetings.sol`, and the related user defined example are:
  * init some user-defined information: `./register/registerGreeting.js`
* The contract example for a cross-chain contract invocation is at .`/contracts/OCComputing.sol`, and the related user defined example are: 
  * init some user-defined information `./register/registerOCComputing.js`

## Coming soon
- A cleaner version with a build-in message `Payload`, which will be make APIs more briefly.

## Usage

Dependencies:
* @dante-contracts
* [@openzeppelin-contracts v4.4.2](https://github.com/OpenZeppelin/openzeppelin-contracts)
* [@truffle/hdwallet-provider v2.0.0](https://www.npmjs.com/package/@truffle/hdwallet-provider)

### Install
```
npm install -g truffle
npm install -d
```

### Compile smart contract
```
truffle compile
```

### Deploy smart contract to Avalanche FUJI testnet
```
truffle migrate --network avalancheFuji --reset --skip-dry-run
```
