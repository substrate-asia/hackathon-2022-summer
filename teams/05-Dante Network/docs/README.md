# Demo Show

## Video

* [Video: Introduction and Demos](https://youtu.be/_JYxEMSPkpM)

## Demo to try

### Simple scenarios
* We provide some simple scenarios to demonstrate how dApps can access to multi-ecosystems with the help of Dante protocol stack. [Try it manually](./interoperation-demo/).

### Algorithm prototype
* To make users more intuitively to understand how the underly algorithms work, we provide this on-chain prototype smart contract to show the effects of the underlying mechanisms implemented in ink!. [Try it manually](../src/ink!/algorithm-prototype/).

## Smart contract deploy information
- [ink! smart contracts](https://polkadot.js.org/apps/?rpc=wss%3A%2F%2Frococo-contracts-rpc.polkadot.io#/contracts): 
    - `cross_chain.contract`: 
        - Address: `5FyenLDubA4si9vyCGtW3VJkTW16i7thxAXNsoyVSCq59uTD`
        - Related [metadata.json](../src/ink!/core-contract/bin/cross_chain_metadata.json)
    - `algorithm_prototype.contract`:
        - Address: `5GMZtFKF1r2mfSrDg4QF7sdQr9bY8wyLC571VPV9dhYLAufY`
        - Related [metadata.json](../src/ink!/algorithm-prototype/bin/metadata.json)
    - `greeting.contract`:          
        - Address: `5CqHgtxcuqhng95pxXvS25hBCPXNv9wKhvSktK7SgtDPjBTd`
        - Related [metadata.json](../src/ink!/usage-contract/greeting/bin/greeting_metadata.json)
    - `oscomputing.contract`:
        - Address: `5D6gvY4fsUsjkQcPnHtxRTy72CxC12RzFzXHknaZDts2sX2T`
        - Related [metadata.json](../src/ink!/usage-contract/oscomputing/bin/os_computing_metadata.json)

- [Moonbeam smart contracts](https://moonbase.moonscan.io/)
    - `cross_chain.contract`: 
        - Address: `0x63819128fFb3F84BB2C7B2e41875332ec9D66376`
    - `greeting.contract`:          
        - Address: `0x4744A2bD04ED29CCf5A3747e3516595fa33330ae`
    - `oscomputing.contract`:
        - Address: `0xA2f022E9777fa9c413f1c48312C2fF9A36Cf4940`
