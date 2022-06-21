## 关于我们

项目名称: AdMeta

开始于 12.2021

## 项目详细介绍

### 总览

AdMeta 是一个专注于隐私保护的元宇宙广告平台。 AdMeta 使用基于 TEE 的 DID 服务来识别广告商的目标群体，并且使用 TEE，AdMeta 保证不收集任何用户数据。 AdMeta 在 Decentraland、Bit.Country 等 Metaverse 平台上构建多种形式的广告资产（例如广告牌、壁画），让土地所有者轻松整合我们的产品。 合格的转化让用户和发布商都能从广告商那里获得奖励。

与为广告收集用户敏感数据（例如位置、浏览历史）的传统广告平台不同，AdMeta 本身不收集或存储任何用户数据。 取而代之的是，用户自愿决定和控制哪些数据可以存储在 TEE 中，并且存储在 TEE 中的数据不能被除用户自己之外的任何人访问。

### 结构

![AdMeta Architecture](https://raw.githubusercontent.com/h4n0/gists/master/admeta/admeta_architecture.svg)

**广告商** 可以提出具有特定接受规则的广告，例如 链接点击，广告商还提供广告展示和转化的次数，以及他们为每次转化支付的费用。 他们需要在提出广告时支付总价（转化次数 \* 每次转化的价格）。 每个广告展示都有一个唯一的 ID，该 ID 在创建提案时生成。 Merkle 树由所有这些唯一 ID 构建而成，Merkle 树的根将存储在链上存储中。 合格的转换会为参与的用户提供此 UID，用户可以使用该 UID 索取奖励。

**理事会** 应根据广告内容批准或拒绝广告提案。 此外，对广告商的行为进行民主评估。

**用户** 可以在 AdMeta 上开启“广告展示”选项，让用户通过查看广告和与广告互动获得奖励。 默认情况下，此选项处于关闭状态，这意味着尚未设置 AdMeta 的用户将看不到任何广告。 用户还可以提供他们的数据以进行更好的广告匹配，从而获得更多奖励。

**出版商** 可以简单地在任何 Metaverse 平台上使用我们的广告资产并将其放置在他们的土地上。 用户还可以通过合格的展示转化获得奖励。

### Logo

![AdMeta Logo](https://raw.githubusercontent.com/AdMetaNetwork/hackathon-2022-summer/main/teams/16-AdMeta/docs/logo_square_whitebg.png)

## 代码结构

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

## 黑客松期间完成的任务

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

## 成员

Han - Team Lead & Substrate Dev\
Will - Backend Dev\
Kmy - Frontend Dev
