
# hackathon-2022-summer

## 时间点

- 活动报名开启：2022 5月5日 开始
- 线上Coding初赛：5月5日 - 6月22日
- 线上直播组队：5月20日
- 开幕式：5月21日
- 赛前线上直播指导 Workshop&OfficeHour：5月28日-6月18日
- 活动报名截止&代码初审提交截止：6月22日23:59
- 初选审核：6月23日-6月24日
- Demo Day入选团队公示：6月24日
- 线下Hacking决赛：6月29日-30日
- DemoDay&获奖队伍公示： 6月30日

## 地点

**杭州** - 待定

## 项目报名

1. 由即日起，fork 这个代码仓库，到你们团队成员 repo 里。

2. 先在 `teams` 内生成一个目录，以你们团队名称命名，里面先放个空档案，或 readme 简单介绍团队。提交一个 PR 进来。目的是预留一个目录作为你们团队空间。**注意我们会把目录改名，在团队名称前加个编号。请 pull 下来。**

3. 之后，所有参赛项目相关代码都放在你们的团队名称里的目录里进行。可以这种形式存放：

    ```
    teams
      L 00-团队模板/           // 团队目录名称
        L src/
          L substrate/       // substrate 相关代码
          L ui/              // 前端相关代码
          L 。。。            // 其他档案
        L docs/              // 这里放视频, ppt, pdf
        L README.md
    ```

4. 6月22日，提交 PR 进来本 repo，团队只可修改他们目录里的档案。

5. 6月24日晚上，在本 repo 给出初选名单, 选出 12 支团队进入 Demo Day。

## 提交到本 github 重要日期

- 团队在报名那一周 git clone 这个代码库并创建团队目录，在 readme 里列出黑客松期间内打算完成的代码功能点 (不多于 1,000 字)。并提交 PR 到本代码库。

- 6月22日 23:59：团队最后提交 PR 项目代码到自己目录。提交 PR 到本 repo。

## 评分制度 及 评委

### 初选:

- 最终初选截止日前提交代码，把相关代码放在 `src` 目录里，并在本栏列出在黑客松期间已完成的开发工作/功能点。我们将对这些目录/档案作重点技术评审。

技术评审 (30%)

- 开发进度 (**10%**)
  - 着重：链 runtime / 智能合约开发
  - 其他：前/后端开发

- 技术难度及优雅度 (**10%**)
  - 项目技术架构
  - 算法实现优雅程度
  - 具备自动单元测试

- 用户体验 (**10%**)
  - 包括提交的方案对潜在用户来说的直观性和可理解程度

### Demo Day:

商业评审 (40%)
  - 商业价值 (**30%**)
  - 创新性 (**10%**)

现场表现 (30%)
  - 产品展示(可视频录播) (**20%**)
  - 演说技巧 (**10%**)

**最终每队分数： 技术评审 (30%) + 商业评审 (40%) + 现场表现 (30%)**

## 奖金

- 一等奖：2,100 DOT
- 二等奖：1,300 DOT
- 三等奖：660 DOT
- 最佳潜力高校奖: 160 DOT
- 最受社区喜爱奖: 160 DOT
- PolkaHacker奖金池: 520 DOT

## 额外报名资料

- 未组队的可与工作人员协商与其他单独报名者组队
- 已有成熟项目的开发团队报名时，请简要说明现在的项目代码基础，及说明在黑客松期间打算完成的开发范畴。评委会根据黑客松期间的项目开发进度来打分。

## Workshop 及 Office Hour 时间表

5次线上 Workshop & office hours 每周五 workshop + office hours (OH)

- **5月21日 20:00 - 21:00**: 黑客松开场/规则/注意 (Helena + Jimmy) + OH (Jimmy)
- **5月28日 15:00 - 17:00**: Substrate 4.0 介绍 (Kaichao + Roy + Sean) + OH (Kaichao)
- **6月4日 15:00 - 18:00**: 智能合约概述 (Henry + Shelven + Shooter)
- **6月11日 15:00 - 16:30**: 如何基于XCM构建资产桥 (Maggie + Wenfeng)
- **6月18日 15:00 - 17:00**: Web3.0时代投资新方向：NFT,元宇宙 (TangYi + Ashley + Thomas)

回看录播：https://space.bilibili.com/67358318

## 联络

对黑客松有任何疑问，可以下方法联系我们:

* [Github 讨论区](https://github.com/ParityAsia/hackathon-2022-summer/discussions)

* email: hackathon.asia@parity.io

* wechat: Yuan1229 (15810880107)

* [黑客松比赛 Discord](https://discord.gg/KsCEKvqU4p)

   加入我们的「Discord服务器」后，你可以在：

  【community-🤝｜introduce-yourself 频道】与社区成员打招呼！

  【PolkadotHackathon频道】参与活动、社区聊天和了解最新公告！

  【hacker-chat频道】随意交流讨论！

  【🤝｜team-up 频道】做文字版自我介绍

## 其他

- [参赛项目](./docs/categories.md)
- [技术资源](./docs/technical-resources.md)

### 合法合规性

本次黑客松为符合国内法规，我们不会触碰以下任何有关题目

- 和发币 (Initial Coin Offering) 相关。
- 和数字资产交易相关
- 任何币价的讨论 (Decentralized Exchange 主题可讨论技术，不涉及币价)
- 和博彩相关和有博彩成分的游戏
