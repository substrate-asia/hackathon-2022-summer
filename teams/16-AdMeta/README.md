## 基本资料

项目名称：AdMeta

项目立项日期 (哪年哪月)：2021.12

## 项目整体简介

### Overview

AdMeta is a Metaverse advertisement platform that focuses on privacy-preserving. AdMeta uses a TEE-based DID service to identify target groups for advertisers, and with the usage of TEE, AdMeta guarantees not to collect any user data. AdMeta builds multiple forms of ad assets (e.g. billboards, wall paintings) in Metaverse platforms like Decentraland, Bit.Country, to allow land holders to integrate our products easily. Qualified conversions let both users and publishers get rewards from advertisers. 

Unlike traditional ad platforms, who collect users sensitive data(e.g. location, browsing history) for advertising, AdMeta does not collect or store any user data per se. Instead, users voluntarily decide and control what data can be stored in TEE, and the stored data in TEE cannot be accessed by anyone except users themselves.

### Architecture

![AdMeta Architecture](https://raw.githubusercontent.com/h4n0/gists/master/admeta/admeta_architecture.svg)

**Advertisers** can propose an ad with certain acceptance rule, e.g. link clicking, and also advertiser provides how many times the ads are displayed and converted, and how much they pay for each conversion. They need to pay the total price (the number of conversions * price per conversion) while proposing the ad. Each ad display has a unique ID, which is generated while creating the proposal. A Merkle tree are built with all these unique IDs, and the root of Merkle tree will be stored in on-chain storage. A qualified conversion gives the participated user this UID, with which the user can claim for rewards.

**Councils** shall approve or reject ad proposals according to the content of ads. Also, advertisers are evaluated on their behavior democratically.

**Users** can switch on the "Ad Display" option on AdMeta, so that users can get rewards by viewing and interacting with ads. By default, this option is off, which means users who haven't set up their AdMeta won't see any ads. Users can also provide their data for a better ad matching, by means of this they will get more rewards.

**Publishers** can simply utilize our Ad Assets on any Metaverse platform and place it on their lands. Users also get rewards by a qualified display conversion.



## 黑客松期间计划完成的事项


**区块链端**

- `pallet-ad`
  - [ ] 广告商创建广告 (`fn propose_ad()`)
  - [ ] 议会审核通过广告 (`fn approve_ad()`)
  - [ ] 议会审核否决广告 (`fn reject_ad()`)
  - [ ] 为用户匹配广告 (`fn match_ad_for_user()`)
  - [ ] 用户申请获得广告收益 (`fn claim_reward_for_user()`)

- `pallet-user-mock`
  - [ ] 添加用户个人信息 (`fn add_profile()`)
  - [ ] 设置广告显示开关 (`fn set_ad_display()`)
  - [ ] 申请获得广告收益 (`fn claim_reward()`)
  - [ ] 匹配广告 (`fn do_matching()`)


**客户端**

- web 端
  - [ ] 连接钱包
  - [ ] 广告展示
  - [ ] 广告交互
  - [ ] 申请获得收益
  - [ ] 添加用户信息


## 黑客松期间所完成的事项 (6月22日初审前提交)

- 6月22日前，在本栏列出黑客松期间最终完成的功能点。
- 把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间打完成的开发工作/功能点。我们将对这些目录/档案作重点技术评审。
- 放一段不长于 **5 分钟** 的产品 DEMO 展示视频, 命名为 `团队目录/docs/demo.mp4`。初审时这视频是可选，demo day 这是计分项。

## 队员信息

Han - Team Lead & Substrate Dev
Will - Backend Dev
Kmy - Frontend Dev
