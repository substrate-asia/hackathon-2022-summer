## 基本资料

项目名称：Dante Network

项目立项日期：2022.2

## 项目整体简介

(logo image)

Dante Network 是Web3多生态协作的中间件。在 Dante Network 中，我们定义并实现Web3互联互操作的协议栈，这将为Web3带来颠覆性的体验，就像“Internet协议”之于当前的互联网一样。基于 Dante Network 所实现的协议栈实例，未来，多链生态之间不仅可以实现通证的流通，还将实现信息的全面感知以及智能合约的无障碍互操作。

总的来说，Dante Network将帮助Polkadot拓展其应用边界。

Polkadot/Kusama是一个非常有趣的创作，即其生态系统中具有不同能力的各种链条可以连接和合作。我们非常认可这个理念。web3的未来将是一个多生态的世界，目前，除了Polkadot生态系统，也已经有很多具有特殊能力的链，其中一些非常有名并取得了巨大的成功（如Ethereum，Solana，Avalanche，Near等），其中一些具备某种特殊属性（如Flow，Arweave，Platon等）。

Dante Network与Polkadot/Kusama的理念一致，我们将实现Polkadot/Kusama与web3世界的其他链的互联与互操作。与目前从Polkadot到其他生态系统的Token桥梁不同，我们将提供的是一个通用的消息分发和合约调用协议栈。有了Dante Network，Polkadot的每个参与者都可以享受到整个web3世界提供的更广泛的服务，同时，更多当前Polkadot生态以外的用户也可以在他们熟悉的环境下访问Polkadot生态系统内的服务和资源。

我们将同时提供`ink！`和`solidity`版本的协议栈实现。

以下是我们项目的一些更详细的信息：
* [Github Organization](https://github.com/dantenetwork)
* [Pitch deck  & white paper](https://github.com/dantenetwork/Pitch-Deck)
* [Video](https://www.youtube.com/watch?v=CYXx4O8Xgcs)

## 黑客松期间计划完成的事项

**区块链端**

- `Smart contracts`
  - [] 多生态交互底层消息协议（对用户透明）；
  - [] 消息分发、接收、验证基础功能智能合约簇；
  - [] SQoS基本项：身份溯源、收发隔离；
- `off-chain routers` 
  - [] `ink`与`solidity`技术栈间的消息编解码；
  - [] `ink`与`NEAR Rust`技术栈间的消息编解码；
  - [] `solidity`与`NEAR Rust`技术栈间的消息编解码；
  - [] 多生态消息路由；
- `Omnichain dApp SDK for Polkadot`
  - [] 多生态dApp开发SDK，`ink`智能合约技术栈；
  - [] 多生态dApp开发SDK，`solidity`智能合约技术栈；
- `Demos`
  - [] Polkadot上`ink`智能合约平台上的应用智能合约与BNB/Rinkeby上应用智能合约之间的通用消息传输；
  - [] Polkadot上`ink`智能合约平台上的应用智能合约与BNB/Rinkeby上应用智能合约之间的跨生态合约调用；
  - [] Polkadot上`solidity`智能合约平台上的应用智能合约与BNB/Rinkeby上应用智能合约之间的通用消息传输；
  - [] Polkadot上`solidity`智能合约平台上的应用智能合约与BNB/Rinkeby上应用智能合约之间的跨生态合约调用；

## 黑客松期间所完成的事项 (7月5日初审前提交)

- 7月5日前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间打完成的开发工作/功能点。我们将对这些目录/档案作重点技术评审。
- 放一段不长于 **5 分钟** 的产品 DEMO 展示视频, 命名为 `团队目录/docs/demo.mp4`。初审时这视频是可选，demo day 这是计分项。

## 队员信息

- 参赛队员名称：Shawn 
- github账号：shanellyy@126.com
- 邮箱：nika@dantechain.com, xiyuzheng1984@gmail.com
