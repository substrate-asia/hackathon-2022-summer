![image](https://user-images.githubusercontent.com/39883171/174940633-a2bed1b1-337b-4903-a204-7d4d34d61098.png)

# SubStake Team - OneBlock+ Hackathon 2022
> We Build One-stop Staking Curation Platform for DotSama Ecosystem. 


# 1. Introduction to SubStake	
SubStake App (expo-request) is desktop/mobile application for controlling staked-weights throughout the Relaychain & Parachain ecosystem based on curation, supporting any stakable assets and voting with an optimized & user-friendly interface.

We are a team of Polkadot Head/Regional Ambassadors from East Asia, running collator nodes in various parachains & building tools to find the best collators/validators from Polkadot & Kusama ecosystem, and SubStake App is our first product to showcase the overall results of our up-to-date analysis, which will encourage staking activities to become easier and smoother in terms of UX/UI perspectives. 

Our goal for SubStake App is to build open source, community oriented mobile applications which will be unbiased to any networks, provide as many staking features as possible to the user, without having to know any technical aspects of extrinsics or chain-state to stake their assets.
## To Summarize, SubStake is:
```
- Non-custodial & decentralized, communicates directly with the blockchain nodes
- an app with top-notch UX/UI, performance & security
- An one-stop platform for all stakable networks with their stakable assets
- Most profitable nodes are curated & optimized individually to each delegator based on the user’s preferences and stakable amount
```

# 2. Problem Statements:
## 2.1 New Extrinsics
Parachains are launching rapidly and evolving dynamically thanks to the forless nature of Substrate Blockchain, as well as the new extrinsics.

**Problem 1:** In many cases, users have to get education to learn the new features with the new extrinsics along with the new runtime upgrade, it is recurring and tiring for users.

**Problem 2:** In Relaychains, especially in Kusama and Westend, there are lots of experimental changes being made almost on a monthly basis, making it almost impossible for new users to catch up with the new functions without fully understanding the key mechanisms.

**Solution:** Frankly speaking, non-tech based users do not need to know all the details behind the extrinsics, so SubStake App will pre-sort and curate the methods on behalf of them, and provide the optimized service for the users.

## 2.2 Thousands of Networks TBA
Currently there are only 15-30 parachain networks on each relaychain, but it will get harder if users have to choose a network from the list including testnets and livenets.

**Problem:** Stakers hold tokens for staking. But if they have to manually switch into the network that he/she wants to stake on, and even have to pick one validator/collator out of hundreds, it will end up the user picking randomly and stake their valuable assets unwisely.

**Solution:** Stakers hold tokens for staking. So SubStake tracks stakers’ holding assets and only shows the matching networks to the native tokens. For example, if you only have DOT, you can’t see other stakable networks other than Polkadot when you press the STAKE+ button. And then we will curate the list of validators/collators based on your preferences settings in advance to the final extrinsics.

## 2.3 Thousands of Validator and Collators
Relaychains have over thousands of Validators, and Parachains have a maximum over 74 collators on each network, which is a huge number for a single staker to choose from.

**Problem:** Each validator and collator has its own unique performance and stats, and it is highly difficult for users to compare even 1:1, especially when it comes to comparing the potential maximum APR/APY each node operator can generate for the delegator/nominator.

**Solution:** Users now on SubStake, simply tells the backend their preferences of standard selecting their most preferred conditions of each node operator, SubStake will recommend the set of validators/collators in accordance to the prior settings. No more measurement, not hesitations.

> _Note:_ Although staking modules are slightly or completely different from one another, SubStake will try to bring the uniform interface for different networks by using a dialogue format of interface. As for legal dispute, our team is willing to develop and maintain SubStake apps and libraries for the open source community, and we will follow Apache 2.0 license statements so that anyone in the ecosystem would be able to fork and/or use SubStake materials (code, labels, UI elements, icons) to build their own app(s).


# 3. User-flow
![image](https://user-images.githubusercontent.com/39883171/174954006-90dc59bc-47cb-43aa-ab59-62050d918806.png)

1. Users import their pre-existed wallet using Mnemonic or json file.
2. Choose stakable networks based on your stakable assets in possession. (For Hackathon demo, we are planning to use "WestEnd" "MoonbaseAlpha")
3. User enter stake amount to show bonding intent.
4. If user's stake amount is not satisfied with minimum-bond, the system auto-recommends 'nomination pool'
5. Stakers are recommended to nominate their votes to the curated validators by SubStake. 
6. User press 'confirm' button, done.


# 4. The feature set of SubStake App: 
## 4.1 Validator Nomination (Limited to Relaychains)
| Feature | Description |
| --- | --- |
| Staking guide | Basic staking guide is provided & pinned on top of the staking interface. |
| Auto-filtering the list of Validators  | Based on the intent of the staking amount && Based on the preferences of 1) One validator per operator 2) Commission rate under 10% 3) Number of nominators under 256 4) Rewards payout with regular basis 5) Currently elected at least in 3 days 6) With an onchain-identity 7) No slashing historical record 8) Average block rate above 4. |
| Auto-compound | Users may choose between 1) auto-compound or 2) receive reward as transferrable |
| Validator Stats | Users may check the performance status for each curated validator. |
| Switching to new validator set | Users may switch the curated validator list into a new list from a pop-up interface. |

## 4.2 Nomination Pool (Limited to Westend/Kusama)
| Feature | Description |
| --- | --- |
| Auto-joining SubStake Pool | SubStake App auto-redirect users’ funds to our natively created pool. |
| Switching to new nomination pool | If users prefer to manually select a pool, they may switch to a new one from a pop-up interface. |

## 4.3 Validator Account Control(Limited to Relaychain)
| Feature | Description |
| --- | --- |
| Bonding Management | Validators may change their self-bonded amount through the app, while other operational features (including the session key management) will be updated in the next upgrade. |

## 4.4 Staking Status
| Feature | Description |
| --- | --- |
| Home UI shows: | 1) Scheduled Unbonding / 2) Scheduled bonding / 3) Recent Payout within 24hours |
| Control Page UI shows: | 1) All staking status including the information from Home UI / 2) Selectable list of staking status |
| From the Control Page, users can: | 1) Check all the selected validator set / 2) Change the currently selected validator set / 3) Check the preferences to the validator performance conditions / 4) Check the staking option: either “auto-restake” or “direct-transfer” / 5) Change the staking option / 6) Bond more the stakable asset / 7) Bond less the stakable asset / 8) Claim the unbonded fund |


# 5. Team Members:
## Sang-hyun Rhee - Project Lead
- Polkadot Head Ambassador of [East Asia](https://www.notion.so/98d8bd01c6614f6f992d040d37684d13?v=0e58b8287d0b4566a4092f13a08635bb)
- Phala Network Community Lead
- Astar Network SpaceLabs Advocate
- Bachelor Degree, Business Administration at SKKU(Sungkyunkwan University)

## Kye-yoon Lee - Tech Lead
- Polkadot Regional Ambassador of South Korea
- Phala Network Tech Support Lead
- VMWare Korea Head of Tech-sales
- Bachelor Degree, Business Administration at Yonsei University

## So-yoon Jung - Substrate Engineer
- Polkadot Regional Ambassador of South Korea
- Rust Developer, [Polkadot DevCamp Alumni 2022](https://medium.com/polkadot-network/polkadot-devcamp-1489a1f8eef2)
- Bachelor Degree, Computer Science at UNIST(Ulsan National Institute of Science and Technology)

## Dong-chang Lee - Frontend Engineer & QA
- Solana Dev-tool developer at [VegaX](https://vegaxholdings.com/)
- Core Crypto-contributor at [SKKRYPTO](https://github.com/SKKU-SKKRYPTO)
- Bachelor Degree, System Management Engineering at SKKU(Sungkyunkwan University)


# 6. Stacks
## Front-End
- React Native

## Back-End
- Substrate Python
- Web3.py


# 7. Appendix: additional information
![image](https://user-images.githubusercontent.com/39883171/174960925-65aaa045-b961-452a-8c13-b8320e8ac751.png)
- SubStake Hackathon DEMO:
- Figma Design: https://www.figma.com/file/zFoJuZk5n48hsXHJv4qY1I/SubStake-new-UI?node-id=0%3A1
- Telegram Group: https://t.me/substake_support
- Twitter: https://twitter.com/substake_app 
- GitHub: https://github.com/SubStake-App

