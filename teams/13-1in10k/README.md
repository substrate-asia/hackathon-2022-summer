## Basic information

project name: 1in10k

Project initiation date (year and month): 2022-03

## Project overall introduction

![](./docs/logo.png)

The project 1in10k is a dapp that has deployed on the moonbase alpha testnet ( chainID:1287,rpc:https://rpc.api.moonbase.moonbeam.network ): https://moonbase.moonscan.io/address/0x27002439bed6cfea6ebd4fa6d5512cf1ec5e975b. You can play the dapp at http://moonbase.1in10k.com. There are 10,000 blocks(or you can say grids) on the UI of the dapp. People can create or buy any of the blocks. So the name 1in10k means pick one block in the 10,000 blocks.

People can use those blocks to create something interesting, like some pixel images. If the dapp can get some popularity in the future, it can also be a good poster board, if someone owns an interesting pixel image that consist of the blocks, she/he can put some information on the image, like some words she/he want to say, or a url link she/he want people to click. There's something else creative about the dapp, but to avoid other project use the creativity before the dapp, I think It's necessary to keep it a secret now.

The front-end of the dapp is made by Vue, Element-UI and ethers.js. The smart contract of the dapp is made by Solidity, but it has interaction with moonbase Native Token ERC-20 Precompile, so I think it's qualified to try to join this hackthon. It's not 100% opensourced, but I uploaded a part of the smart contract at "./src/abridgedCodes.sol" and the artifacts folder at "./src/artifacts". I also uploaded a simple intro video at "./doc/demo.mp4" You can also watch a more detailed video at: https://www.youtube.com/watch?v=o7V0vkARtB4 (My English is not good, so I speak in Chinese in this video).

## What to do during the hackathon

**Blockchain Side**

Code and depoly the solidity contract to fufill the demand of the dapp. And use the moonbase Native Token ERC-20 Precompile to achive the transfer function of the dapp.

**Client Side**

Use Vue, Element-UI, and ethers.js to implement a front end that interacts with the smart contract, and make the UI as polished as possible.

## What was accomplished during the hackathon

Most of the project code has been completed, but the UI needs to be more polished.

The code is not 100% opensourced, but part of the contract code has been uploaded at ".src/contract/abridgedCodes.sol", and the compiled files have been uploaded at "./src/artifacts".

A short introduction video has been uploaded at "./doc/demo.mp4", another more detailed one has been uploaded at https://www.youtube.com/watch?v=o7V0vkARtB4 .

Deployed the dapp frontend at http://moonbase.1in10k.com

## Player information

It's a soloteam, so all the work is done by myself. I'm not a professional coder, just have some passion in coding and blockchain so I learn to code and try to do some works in the cryptoworld.

Name：peilin；

Github：1in10k-com;

Wechat：peilin567；
