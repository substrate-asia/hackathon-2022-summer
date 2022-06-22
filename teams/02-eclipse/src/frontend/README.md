# difttt-front
Polkadot's blockchain applications are becoming more and more complex, and I am wondering what applications can use a common interface to make it easier for ordinary people to use blockchain applications.

The project core topic is web3-based automatic triggers. You may have heard of IFTTT. The power-on point solved is greatly improve convenience, and reduce the threshold for users to enter the blockchain, and ensure the stability of execution and the privacy of trigger publishers and executors.serve as one of the infrastructures of web3. The targeted areas include life services, smart home, cross-chain operations, and Defi.

DIFTTT has partnerships with different service providers that supply event notifications to DIFTTT and execute commands that implement the responses. Some event and command interfaces are simply public APIs, Some Action May be a blockchain opration, or Docker Task.


the difttt-frontend had these feature:
- 1 create triger/action/recipe
- 2 get triger/action/recipe list
- 3 delete/enable/disable recipe

## Usage

```shell
pnpm install
pnpm run dev

pnpm run build
```
