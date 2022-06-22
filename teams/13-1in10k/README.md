## 基本资料

项目名称：1in10k

项目立项日期：2022 年 3 月

## 项目整体简介

![](./docs/logo.png)

The project 1in10k is a dapp that has deployed on the moonbase alpha testnet ( chainID:1287,rpc:https://rpc.api.moonbase.moonbeam.network ): https://moonbase.moonscan.io/address/0x27002439bed6cfea6ebd4fa6d5512cf1ec5e975b. You can play the dapp at http://moonbase.1in10k.com. There are 10,000 blocks(or you can say grids) on the UI of the dapp. People can create or buy any of the blocks. So the name 1in10k means pick one block in the 10,000 blocks.

People can use those blocks to create something interesting, like some pixel images. If the dapp can get some popularity in the future, it can also be a good poster board, if someone owns an interesting pixel image that consist of the blocks, she/he can put some information on the image, like some words she/he want to say, or a url link she/he want people to click. There's something else creative about the dapp, but to avoid other project use the creativity before the dapp, I think It's necessary to keep it a secret now.

The front-end of the dapp is made by Vue, Element-UI and ethers.js. The smart contract of the dapp is made by Solidity, but it has interaction with moonbase Native Token ERC-20 Precompile, so I think it's qualified to try to join this hackthon. It's not 100% opensourced, but I uploaded a part of the smart contract at "./src/abridgedCodes.sol" and the artifacts folder at "./src/artifacts". I also uploaded a simple intro video at "./doc/demo.mp4" You can also watch a more detailed video at: https://www.youtube.com/watch?v=o7V0vkARtB4 (My English is not good, so I speak in Chinese in this video).

## 黑客松期间计划完成的事项

**区块链端**

编写并部署 solidity 智能合约，实现 dapp 所需需求，并使用了 moonbeam alpha testnet 的 Token ERC-20 预编译来进行转账操作。

**客户端**

使用 Vue，Element-UI，ethers.js 来实现可与智能合约交互的前端。并尽量美化 UI。

## 黑客松期间所完成的事项

目前已完成绝大部份项目代码，但是 UI 还需要更美化。  
并没有完全开源代码，但部分合约源码已存放在"./src/contract/abridgedCodes.sol"，源码编译后的得到的 artifacts 文件夹也已存放在"./src/artifacts"。  
一个五分钟内的介绍视频上传到了"./doc/demo.mp4"，另外一个更详细的介绍视频上传到了：https://www.youtube.com/watch?v=o7V0vkARtB4 。  
部署了 dapp 的前端在：http://moonbase.1in10k.com ，需连接到 moonbase alpha testnet ( chainID:1287,rpc:https://rpc.api.moonbase.moonbeam.network )。

## 队员信息

姓名：peilin；  
Github：1in10k-com;  
微信：peilin567；  
此项目为单人参赛
