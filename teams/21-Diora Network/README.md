## About

Project Name: Diora Network

Started in 5.2022

### Logo


![dioralogo](https://user-images.githubusercontent.com/49777543/174741354-fdf784bf-1b38-4d33-bd8e-dca0bf1e7d7f.png)


## Project Details

### Overview

Diora Network is a incentivized smart contract parachain, utilizing advanced PoSM with Double Validation & Randomization for security guarantees.

The main goal of Diora Network is to foster an array of diverse and sustainable cross-chain applications by empowering and rewarding developers that build on the network with baked in incentives and rewards. More specifically, we are constructing an efficient and fully decentralized consensus protocol. 

Baked into the network itself, Diora rewards developers based on the value and impact of their dapp, rather than their close association or connections to capital. Unlike existing versions of older blockchain's, where tokens are mostly concentrated in the hands of the first few early participants, Diora is designed to be shared across all contributors, users and stakeholders.

Diora Network proposes the Proof of Stake Masternode (PoSM) consensus, which is a PoS/PoW hybrid consensus protocol with a fair voting mechanism, rigorous security guarantees, and uniform probability eventually. we apply PoSM with voting and Double Validation to create, verify and vote for blocks smoothly and efficiently.


### Official Links

Website
https://diora.network/

 Github 
https://github.com/diora-network

Docs
https://diora.network/docs

 Faucet 
https://diorafaucet.netlify.app/

 Block Explorer 
https://dioraexplorer.net/

RPC Node 
https://testnet.diora.network/

Web socket 
https://dev.diora.network/

Chain ID 
- 201 



### Architecture

**Novel technology includes** 

- Proof of Stake Masternode consensus
- On-chain governance and Forkless upgrades
- Double Validation and Randomization
- Dapp Staking Rewards
- Gas Rebates
- Sharding based on a stable masternode architecture

**This enables Diora to achieve**

- Cheap transactions: approx. 1/100 of that of Ethereum
- 2000 TPS to handle a robust dapp and token ecosystem; TPS will be dramatically higher once our sharding solution is enabled (20k-30k TPS)
- 6 second block time for fast transactions
- EVM compatibility allows for interoperability with Ethereum ecosystem.

Diora’s native token is not just a fee and staking token. Rather, it will be the one the first tokens on an EVM that drives governance outcomes for the EVM. But it also serves as a vehicle to determine future economic outcomes that align the three main actors (Developers, Users, and Validators).


**Masternodes (Validators)** A Diora masternode is a server which uses its computing power to contribute to the network. Its job is to create and sign blocks. For this contribution to the network, masternodes receive rewards in the form of DIR. Masternodes are elected using the PoSM consensus via our governance Dapp 

**Developers** Can earn via various different methods that are baked into the network such as - Staking (Masternode Votiing), Dapp Staking Rewards, Gas Rebates and other on chain revenue methods like hackathons etc.

**Users** Can interact with the Diora Network by Staking via the Masternode election system, Making proposals for upgrades via on On-chain Governance, Voting for there favorite dapps and earning a % for dapp staking.



## Tasks done during Hackathon


- `Stage 1`

  - [x] Complete All Substrate Developer Tutorials
  - [x] Build Proof of Authority chain using Substrate node template
  - [x] Upgrade to EVM compatible using Frontier Framework
  - [x] Turn PoS using Nominated Proof Of Stake consensus
  - [x] Add Democracy & Treasury Pallets to frame for on-chain governance

After stage 1, We moved onto upgrading our chain into a parachain, since we are using the Nimbus consensus framework upgrade for - we had to completely rebuild our blockchain which cost us some time.


- `Stage 2`

  - [x] Launch Parachain Using Cumulus extension framework Nimbus
  - [x] Mix Frontier with Nimbus for a EVM compatible Parachain
  - [x] Add Purestake's DPoS Pallet for Parachain Staking
  - [] Add Democracy & Treasury Pallets to frame for on-chain governance
  - [] Add Dapp Staking Pallet

  Please Note - We are currently waiting for our parachain application to be accepted on the rococo testnet so we can connect our stage 2 parachain to our public facing RPC's

**Dapps & Tools**

  - [x] Connecting to Polkadot JS extension & MetaMask
  - [x] Block Explorer 
  - [x] Native Web Wallet
  - [x] Faucet for Testnet DIR
  - [x] Dex example

## Code Structure

**Blockchain Frame**

Nimbus/Cumulus

- `cumulus-pallet-parachain-system`
- `cumulus-pallet-xcm`
- `cumulus-pallet-dmp-queue`
- `parachain-info:`
- `nimbus-primitives:`
- `pallet-author-inherent:`
- `pallet-author-slot-filter:`

Substrate

- `pallet-balances`
- `pallet-collective:`
- `pallet-democracy:`
- `pallet-randomness-collective-flip`
- `pallet-session:`
- `pallet-treasury:`
- `pallet-timestamp:`
- `pallet-transaction-payment:`


Frontier (EVM)

- `pallet-ethereum-chain-id:`
- `pallet-evm:`
- `pallet-ethereum:`
- `pallet-dynamic-fee:` 
- `pallet-evm-precompile-simple:`
- `fc-db:`
- `fc-rpc:`


Others 

- `pallet-parachain-staking`
- `pallet-dapp-staking`
- `orml-xcm-support:`
- `orml-xtokens:`
- `pallet-xcm:`


## Demo Video

- Coming Soon

## Members

Jay - Team Lead & Solidity Dev
hqwang - Substrate Runtime Dev
Feng - Substrate Runtime Dev
Adam - Frontend Dev

We would also like to thank the amazing work done by purestake & omrl. otherwise our chain would not be possible.
