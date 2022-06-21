## About

Project Name: AdMeta

Started in 12.2021

## Project Details

### Overview

AdMeta is a Metaverse advertisement platform that focuses on privacy-preserving. AdMeta uses a TEE-based DID service to identify target groups for advertisers, and with the usage of TEE, AdMeta guarantees not to collect any user data. AdMeta builds multiple forms of ad assets (e.g. billboards, wall paintings) in Metaverse platforms like Decentraland, Bit.Country, to allow land holders to integrate our products easily. Qualified conversions let both users and publishers get rewards from advertisers.

Unlike traditional ad platforms, who collect users sensitive data(e.g. location, browsing history) for advertising, AdMeta does not collect or store any user data per se. Instead, users voluntarily decide and control what data can be stored in TEE, and the stored data in TEE cannot be accessed by anyone except users themselves.

### Architecture

![AdMeta Architecture](https://raw.githubusercontent.com/h4n0/gists/master/admeta/admeta_architecture.svg)

**Advertisers** can propose an ad with certain acceptance rule, e.g. link clicking, and also advertiser provides how many times the ads are displayed and converted, and how much they pay for each conversion. They need to pay the total price (the number of conversions \* price per conversion) while proposing the ad. Each ad display has a unique ID, which is generated while creating the proposal. A Merkle tree are built with all these unique IDs, and the root of Merkle tree will be stored in on-chain storage. A qualified conversion gives the participated user this UID, with which the user can claim for rewards.

**Councils** shall approve or reject ad proposals according to the content of ads. Also, advertisers are evaluated on their behavior democratically.

**Users** can switch on the "Ad Display" option on AdMeta, so that users can get rewards by viewing and interacting with ads. By default, this option is off, which means users who haven't set up their AdMeta won't see any ads. Users can also provide their data for a better ad matching, by means of this they will get more rewards.

**Publishers** can simply utilize our Ad Assets on any Metaverse platform and place it on their lands. Users also get rewards by a qualified display conversion.

### Logo

![AdMeta Logo](https://raw.githubusercontent.com/AdMetaNetwork/hackathon-2022-summer/main/teams/16-AdMeta/docs/logo_square_whitebg.png)

## Code Structure

**Blockchain**

- `pallet-ad`

  - [x] Propose ads (`fn propose_ad()`)
  - [x] Approve ads by council (`fn approve_ad()`)
  - [x] Reject ads by council (`fn reject_ad()`)
  - [x] Match ads for users (`fn match_ad_for_user()`)
  - [x] Claim rewards (`fn claim_reward_for_user()`)

- `pallet-user-mock`
  - [x] Add/Update user profile (`fn add_profile()`)
  - [x] Set/Update ad display option (`fn set_ad_display()`)
  - [x] Claim rewards by user (`fn claim_reward()`)
  - [x] Do ads and users matching (`fn do_matching()`)

**Client**

- Web application
  - [x] Connecting to Polkadot JS extension
  - [x] Update/Add user profile
  - [x] Ads display
  - [x] Ads interaction (clicking and tracking)
  - [x] Claim ad rewards

## Tasks done during Hackathon

### Implementation

- Blockchain
  - Code refactoring for hackathon
  - Add cargo doc in CI for documentation
  - Add clippy check & amendments
- Web application
  - Connecting to Polkadot JS extension
  - Update/Add user profile
  - Ads display
  - Ads interaction (clicking and tracking)
  - Claim ad rewards
- DevOps
  - Deploy Blockchain testnet
  - Deploy Web app testnet and connect with the blockchain testnet
  - Misc. debugging and refinements

## Members

Han - Team Lead & Substrate Dev\
Will - Backend Dev\
Kmy - Frontend Dev
