# Demos for Multichain Interoperation

This `repo` provides demos showing common message communication and contracts invocation between multi-chains.  
This is a "Nightly" branch for development. New features will be published here as soon as we make progresses.  
The test network is planned to be online in early Q3(2022).

# Current Work flow
We provide two situations:
- **Greetings**
  * User α sends a greeting message to the greeting contract on chain A.
  * Greeting contract call cross-chain contract of DANTE on chain A.
  * DANTE cross-chain service sync message from chain A to chain B.
  * User β query greeting message on chain B.

- **Computation**
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

### Prepare private key
The private key is used to sign transations which will be sent to Rinkeby and Moonbeam.  
You can use the default private key file `.secret`. If the amount is not enough to pay gas fee, you can get token from faucet listed below.  

**If you do not want to use default private key file, you can create it yourself**
- Create a evm-compatible account(private key is neccessary), MetaMask will be ok
- Paste private key into the file `.secret`
- Get token for test, faucets are shown below
  - Moonbeam: https://docs.moonbeam.network/learn/platform/networks/moonbase/#moonbase-alpha-faucet
  - Rinkeby: https://rinkebyfaucet.com/

### Test script

**Interoperation between Polkadot parachain and EVM compatible chains**

**Prepare**
- Open Polkadot Apps - Contracts on Rococo: [https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-contracts-rpc.polkadot.io#/contracts](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-contracts-rpc.polkadot.io#/contracts)
- We have deployed these smart contracts on `Contracts on Rococo`:
    - `cross_chain.contract`: 
        - Address: `5FyenLDubA4si9vyCGtW3VJkTW16i7thxAXNsoyVSCq59uTD`
        - Related [metadata](../../src/ink!/core-contract/bin/)
    - `greeting.contract`:          
        - Address: `5CqHgtxcuqhng95pxXvS25hBCPXNv9wKhvSktK7SgtDPjBTd`
        - Related [metadata](../../src/ink!/usage-contract/greeting/bin/)
    - `oscomputing.contract`:
        - Address: `5D6gvY4fsUsjkQcPnHtxRTy72CxC12RzFzXHknaZDts2sX2T`
        - Related [metadata](../../src/ink!/usage-contract/oscomputing/bin/)
- Prepare an test account:
    - Click `Add account` on `Accounts` page, and finish creating an account
    - Get token from faucet in `Element`, channel link is [https://matrix.to/#/#rococo-faucet:matrix.org](https://matrix.to/#/#rococo-faucet:matrix.org)
    - Input !drip (Address):1002. Replace (Address) with the created account address.
    - Test with this account

![image](https://user-images.githubusercontent.com/83757490/174969528-b880803b-1e27-47d0-80cb-d4bed375cf1d.png)

#### **Interoperation between `Contracts on Rococo` and `Rinkeby`**

- Send greeting from `Rinkeby` to `Contracts on Rococo`. We replaced the `Testnet of AStar(Shibuya)` with `Rococo Contracts` as `Shibuya` is unavailable currently. But the following script still works.
```
node rinkebyToAstar.js --greet
```

- Query result from **Greeting** contract on `Contracts on Rococo`

![image](https://user-images.githubusercontent.com/83757490/174969839-f4733c11-02b7-4c82-942c-5cecbff87e51.png)

- Send greeting from **Greeting** contract  on `Contracts on Rococo` to `Rinkeby`

![image](https://user-images.githubusercontent.com/83757490/174970370-b6cc7bf5-dc77-45c6-b377-7316b2c88529.png)

After the transaction has been executed successfully, query the id of the message from **Cross Chain** contract on `Contracts on Rococo`, the id is the same as the number of all sent messages.

![image](https://user-images.githubusercontent.com/83757490/175046819-1c4adfca-ea46-466d-a0bb-0bb75d68bfd4.png)

- Query result on `Rinkeby`. 
```
node rinkebyToAstar.js --query <ID>
```
- Check related transaction in [Rinkeby Scan](https://rinkeby.etherscan.io/)

`<ID>` is the id queryed above. 

- Send computing task from **OSComputing** contract on `Contracts on Rococo` to `Rinkeby`

Here, we have registered the destination chain contract and address to the **OSComputing** contract with the method `multiDestContracts::registerDestContract`, so the method `sendComputingTask` just needs the destination chain name and numbers to be computed as parameters.

You can query the destination contract and method name with the method `multiDestContracts::getDestContractInfo`.

![image](https://user-images.githubusercontent.com/83757490/175050523-834eefc0-f742-4cec-9e3d-ff23a1a24482.png)

The prefix "X" is added because the hex string will be handled specially.

Send computing task

![image](https://user-images.githubusercontent.com/83757490/174970600-bb4855ff-5a7f-4b1f-b744-193d97c297fe.png)

You can query the message sent to Rinkeby on ["https://rinkeby.etherscan.io/address/0x359d5510405093f7Ea15408a0A3F52c52730A77e"](https://rinkeby.etherscan.io/address/0x359d5510405093f7Ea15408a0A3F52c52730A77e)

- Query result from **OSComputing** contract on `Contracts on Rococo`, it may take 1 minute after the computing task was sent.

![image](https://user-images.githubusercontent.com/83757490/174970671-81320a68-4d66-407f-8998-a85aee26fdb9.png)

#### **Interoperation between `Moonbeam` and `NEAR`**  

**Check related transaction in [Moonbeam Scan](https://moonbase.moonscan.io/)**  
**Check related transaction in [Near Scan](https://explorer.testnet.near.org/)**

- Send greeting from Moonbeam to NEAR
```
node moonbeamToNear.js --greet
```

- Send outsourcing computing task from Moonbeam to NEAR
```
node moonbeamToNear.js --compute 9,9,8
```

- Send greeting from NEAR to Moonbeam
```
node nearToMoonbeam.js --greet
```

- Send outsourcing computing task from NEAR to Moonbeam 
```
node nearToMoonbeam.js --compute 9,9,8
```

### Other Demos
* Check more demo shows based on Dante protocol stack [here](https://github.com/dantenetwork/Demo-Show)
