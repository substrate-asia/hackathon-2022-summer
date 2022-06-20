## Introduction

To make users more intuitively to understand how the underly algorithms work, we provide this on-chain prototype smart contract to show the effects of the underlying mechanisms implemented in ink!.

## Index
* [Router selection mechanism](#router-selection)
* [Message verification mechanism](#message-verification)

## Demos

### Router selection

#### Effects
A statistic result of this algorithm is as below:

![1655383046092](https://user-images.githubusercontent.com/83746881/174071425-78fbea88-2f20-41c8-b874-fec4d61208c5.png)

* The `Credibility Ratio` is the probability distribution of the routers to be selected as working nodes according to their credibilities. In product implementation, this probability will be calculated considering both credibility(reflecting history work) and staking(reflecting economics incentives).
* The `selected results` is the result by calling `selection_statistic`.

We can see in the picture above, that the theoretical value of probability distribution is nearly the same as the real result of the selection algorithm.

#### Usage
##### Deploy
Try the following operations with [polkadot,js/app](https://polkadot.js.org/apps/#/explorer). On the `Shibuya Testnet` or deploy the smart contract *`./bin/algorithm_prototype.contract`* on a local substrate node.

* You can launch a [local substrate node](https://github.com/paritytech/substrate-contracts-node) and deploy the `algorithm_prototype.contract` on it to try. 
* Or use the deployed `algorithm_prototype.contract` on the Testnet of AStar, that is `Shibuya Testnet`. The address is *`aX8aZK9Pt9HTgywWYBdskDSdJ9yq6TzLJMDah7vZxfBsYko`*, and the related *`./bin/metadata.json`*.

##### Operation
* Call `randomRegisterRouters` to register simulation off-chain routers. To make this test simple, you can register enough at a time with any credibilities you want in the parameter vector. The id of the routers will be dynamically created. The registered routers can be checked by calling `getRegisteredRouters `. The result will be something like this:

![1655712763672](https://user-images.githubusercontent.com/83746881/174556149-c6ed625d-b3fa-49fa-b914-bc7b2642a9c9.png)

* Call `selectionTest` to randomly choose `n` routers according to their credibility. Note that the result will be the same if operates in the same block. The result will be like this:

![1655714656855](https://user-images.githubusercontent.com/83746881/174563243-46a3ae26-5fb0-47c7-b7c1-57aee72177cd.png)

* Call `selection_statistic` to provide an intuitive validation of the 'Probability distribution' results of the router selection algorithm. Parameter `n` is the number of sampling times. The result will be like this:

![1655715182550](https://user-images.githubusercontent.com/83746881/174564024-8b11d9c2-b15a-4bb7-9b34-e11971e3fa6a.png)

### Message verification
In message verification algorithm prototype, we descide the limitation number of message copies to verify a message by a system paremeter `self.msg_copy_count`. When enough copies have been delivered, `simu_message_verification` will be called dynamically.

And the number determines how many routers one message needs to be delivered parallelly, which will be configured by users through SQoS settings in the product implementation. 

#### Usage
* Call `setSysinfo` to set message-verification related system paremeters and `getSysinfo` to check the value.

* Call `simuSubmitMessage` to submite message copies manually. Note that message copies belong to the same message only if they have the same `IReceivedMessage::id` and `IReceivedMessage::from_chain`. 

*  When enough message copies are submitted, `simu_message_verification` will be called internally. The result will be cached in order to be checked manually and an event `VerifiedMessage` will be emitted to show the result, but the result event need to be decoded by `Polkadot.js`. 

* Check the cached verification result by `getVerifiedResults`.