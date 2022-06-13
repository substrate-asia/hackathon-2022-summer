## 基本资料

项目名称：Dante Network

项目立项日期：2022.2

## 项目整体简介

![79065cb236bd6d0a18725bd864cc36a](https://user-images.githubusercontent.com/83746881/169981478-dd274207-a0ee-48a5-bdc1-94e46f938766.png)

Dante Network 是Web3多生态协作的中间件。在Dante Network中，我们定义并实现Web3互联互操作的协议栈，这将为Web3带来颠覆性的体验，就像“Internet协议”之于当前的互联网一样。基于Dante Network所提供的协议栈实例，未来，多链生态之间不仅可以实现通证的跨生态流通，还将实现信息的全面感知以及智能合约的无障碍协作。

Polkadot/Kusama开创了多链协作的生态范式，其生态系统中具有不同能力的各种公链可以相互连接与协作。我们非常认可这个理念，web3将是一个多元化协作的世界。当前的web3是一个多生态共存的世界，在Polkadot以外，有些生态已经非常有名（如Ethereum，BNB，Solana，Avalanche，Near等），有些生态则具备某种特殊的能力（如Flow，Arweave，Aleo，PlatON等）。

Dante Network与Polkadot/Kusama的理念非常一致，简言之，Dante Network将帮助Polkadot拓展其生态应用的边界。与跨生态的Token桥梁不同，Dante Network将提供的是一个通用的跨生态消息分发和合约调用协议栈。这将帮助Polkadot生态以外的用户也可以在他们熟悉的环境下访问Polkadot生态系统内的服务和资源，同时，Polkadot生态的每个参与者也可以借助Dante Network享受到整个web3世界所提供的更广泛的服务。

在本次黑客松中，本项目所参加的赛道如下：

* [类别 5：跨链，Bridge，Layer2，Layer0](https://github.com/xiyu1984/hackathon-2022-summer/blob/main/docs/categories.md#%E7%B1%BB%E5%88%AB-5%E8%B7%A8%E9%93%BEbridgelayer2layer0)
  
  * [Layer0](https://github.com/xiyu1984/hackathon-2022-summer/blob/main/docs/categories.md#layer0)

以下是我们项目的一些更详细的信息：
* [Github Organization](https://github.com/dantenetwork)
* [Pitch deck  & white paper](https://github.com/dantenetwork/Pitch-Deck)
* [Video](https://www.youtube.com/watch?v=CYXx4O8Xgcs)

## 黑客松期间计划完成的事项

**区块链端**
我们将在本次黑客松中完成协议栈最基本的功能，提供可供dApp开发者试用的多生态智能合约开发SDK，并在测试网部署相关能力展示的Demo。我们将同时完成`ink！`（支持未来大多数基于substrate的平行链）和`solidity`（支持拥有EVM智能合约平台的平行链）版本的协议栈实现。

- `Smart contracts`
  - [ ] 多生态交互底层消息协议（对用户透明）；
  - [ ] 消息分发、接收、验证基础功能智能合约簇；
  - [ ] SQoS基本项：身份溯源、收发隔离；
- `off-chain routers` 
  - [ ] `ink`与`solidity`技术栈间的消息编解码；
  - [ ] `ink`与`NEAR Rust`技术栈间的消息编解码；
  - [ ] `solidity`与`NEAR Rust`技术栈间的消息编解码；
  - [ ] 多生态消息路由；
- `Omnichain dApp SDK for Polkadot`
  - [ ] 多生态dApp开发SDK，`ink`智能合约技术栈；
  - [ ] 多生态dApp开发SDK，`solidity`智能合约技术栈；
- `Demos`(在测试网部署)
  - [ ] Polkadot上`ink`智能合约平台上的应用智能合约与BNB/Rinkeby上应用智能合约之间的通用消息传输；
  - [ ] Polkadot上`ink`智能合约平台上的应用智能合约与BNB/Rinkeby上应用智能合约之间的跨生态合约调用；
  - [ ] Polkadot上`solidity`智能合约平台上的应用智能合约与BNB/Rinkeby上应用智能合约之间的通用消息传输；
  - [ ] Polkadot上`solidity`智能合约平台上的应用智能合约与BNB/Rinkeby上应用智能合约之间的跨生态合约调用；

## 黑客松期间所完成的事项 (7月5日初审前提交)

- 7月5日前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间打完成的开发工作/功能点。我们将对这些目录/档案作重点技术评审。
- 放一段不长于 **5 分钟** 的产品 DEMO 展示视频, 命名为 `团队目录/docs/demo.mp4`。初审时这视频是可选，demo day 这是计分项。

## 队员信息

- 参赛队员名称：Shawn 
- github账号：shanellyy@126.com
- 邮箱：nika@dantechain.com, xiyuzheng1984@gmail.com
