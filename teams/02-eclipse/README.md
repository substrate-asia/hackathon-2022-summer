## basic information

project name: difttt

Project initiation date (year and month): 2022-05

## Project overall introduction

Polkadot's blockchain applications are becoming more and more complex, and I am wondering what applications can use a common interface to make it easier for ordinary people to use blockchain applications.

The project core topic is web3-based automatic triggers. You may have heard of IFTTT. The power-on point solved is greatly improve convenience, and reduce the threshold for users to enter the blockchain, and ensure the stability of execution and the privacy of trigger publishers and executors.serve as one of the infrastructures of web3. The targeted areas include life services, B-side office services, as well as the Internet of Things, smart home, cross-chain operations, and Defi.


![logo](./logo.png)


## What to do during the hackathon

**Blockchain side**
- `difttt-node`
  - [ ] Triger creation (`fn create_triger()`)
  - [ ] Action creation (`fn create_action()`)
  - [ ] Recipe creation (`fn create_recipe()`)
  - [ ] Delete Recipe (`fn del_recipe()`)
  - [ ] Enable recipe (`fn turn_on_recipe()`)
  - [ ] Disable recipe (`fn turn_off_recipe()`)
  - [ ] Check the triger condition, and run the action (`fn offchain_worker()`)
  
**Client**

- web side(react)
  - [ ] Triger/Action/Recipe create page
  - [ ] Triger/Action/Recipe list page

- evm-proxy(rust)
  - [ ] pass action to DEP(a Distributed Task System)

## What was accomplished during the hackathon (submitted before the June 22nd trial)
(todo)
- Before June 22, list the finalized feature points during the hackathon in this column.
- Put the relevant code in the `src` directory and list the development work/feature points completed during the hackathon in this column. We will conduct a focused technical review of these catalogs/archives.
- Put a product demo video no longer than **5 minutes**, named `team directory/docs/demo.mp4`. This video is optional during the first review, and demo day is a scoring item.

## Player information

Eclipse is a team from China, team members have many years of blockchain experience.
- Bin Guo, a Senior blockchain product manager, mastered blockchain development technology and theoretical knowledge, and led the completion of more than ten large-scale and super-large-scale projects.

- Li Smith, a blockchain developer,the hackathon team leader.Years of experience in substrate development, familiar with rust、c++. Developed block explorer, exchange gateway, avatar nft, domain name system, etc.(github: baidang201)

- Leon, a frontend developer,Familiar with frontend and node, recently learning rust and substrate.(github: walle233).

- Shiyivei, a blockchain developer, Familiar with blockchain development (go rust), familiar with solidity, and understand react.(github: shiyivei).