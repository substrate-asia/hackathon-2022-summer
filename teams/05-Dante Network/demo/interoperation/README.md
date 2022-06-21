# Demos for Multichain Interoperation

This `repo` provides demos showing common message communication and contracts invocation between multi-chains. 
This is a "Nightly" branch for development. New features will be published here as soon as we make progresses.

## Introduction
The demo smart contract to test basic communication between different chains, including cross-chain message delivering and cross-chain contract invocations. 

## Coming soon
The test network is planning to be online in early Q3(2022).

# Current Work flow

**This chapter will be updated as the project progresses.**

**Greetings**
* User α sends a greeting message to the greeting contract on chain A.
* Greeting contract call cross-chain contract of DANTE on chain A.
* DANTE cross-chain service sync message from chain A to chain B.
* User β query greeting message on chain B.


**Computation**
* User α sends a transaction for a simple computation to the calculation contract on chain A.
* Calculation contract on chain A call cross-chain contract of DANTE on chain A.
* DANTE cross-chain service sync the calling information from chain A to chain B.
* Calculation contract on chain B make the real computation with its own mode(maybe it's a special mode like VC based on zk-snark).
* Calculation contract on chain B call cross-chain contract of DANTE to return the result of the computation to chain A.
* DANTE cross-chain service sync the result information from chain B to chain A.
* User α query the result on chain A.

## Usage

### Install
```
npm install -d
```

### Test script

#### Interoperation between Polkadot parachain and EVM compatible chains

**Prepare**
- Open Polkadot Apps: https://polkadot.js.org/apps
- Load deployed contracts with (contract address and metadata.json)

Prepare related ink! smart contracts:
- [ink! cross-chain contract]()
- [ink! demo contracts]() including `greeting.contract` and `oscomputing.contract`
![image](https://user-images.githubusercontent.com/83757490/174795732-3c83f06d-938c-4510-915c-1d0642af4009.png)

- We have deployed these smart contracts on `AStar Testnet`
    - `cross_chain.contract`: 
    - `greeting.contract`: 
    - `oscomputing.contract`: 

**Note: if the testnet of `Astar(Shibuya)` doesn't work, the ink! related demo may not work. Check it in [Demo vedios](). But you still can try the [Moonbeam](#interoperation-between-moonbeam-and-near) demo manually.**

##### **Interoperation between ink! and Rinkeby**

- Send greeting from `Rinkeby` to `Astar Testnet`
```
node rinkebyToAstar.js --greet
```

- Query result on `Astar Testnet`

![b8d1d5cf5ec4bd3bf647c95a2fc3be0f_](https://user-images.githubusercontent.com/83757490/174796925-a974c507-5637-472d-af15-4f3c445e7169.jpg)

- Send greeting from `AStar Testnet` to `Rinkeby`

<img width="894" alt="d64abeea609b7ef20fa29ecbe22f4e75_" src="https://user-images.githubusercontent.com/83757490/174797223-ccde17ab-cd0d-437f-b47b-8ca371b4b0b3.png">

- Query result on `Rinkeby`
```
node rinkebyToAstar.js --query <ID>
```

`<ID>` is the id of the message sent from `Astar Testnet`

- Send computing task from `AStar Testnet` to `Rinkeby`

![4ca97ecdafe83429a74d653a369ce07](https://user-images.githubusercontent.com/83757490/174798862-b8a90758-5013-492f-aa36-588887d3ee4e.jpg)

- Query result on `Astar Testnet`

![59c7213e1cdd7535e3d43c8779231a8d_](https://user-images.githubusercontent.com/83757490/174797727-982feea8-89cd-4020-9d47-496a55b31706.jpg)

##### **Interoperation between `Moonbeam` and `NEAR`**

- Send greeting from Moonbeam to NEAR
```
node MoonbeamToNear.js --greet
```

- Send outsourcing computing task from Moonbeam to NEAR
```
node MoonbeamToNear.js --compute 9,9,8
```

- Send greeting from NEAR to Moonbeam
```
node NearToMoonbeam.js --greet
```

- Send outsourcing computing task from NEAR to Moonbeam 
```
node NearToMoonbeam.js --compute 9,9,8
```

### Other Demos
* Check more demo shows based on Dante protocol stack [here](https://github.com/dantenetwork/Demo-Show)
