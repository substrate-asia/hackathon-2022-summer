## BASE INFO

PROJECT NAME: SAFEMINT

TEAM: WHALER

INITIATION DATE: 2022.4.15

FE Source code: [Link](https://github.com/safemint-org/fe)   
Contract Source code: [Code link](https://github.com/safemint-org/contracts)


## INTRODUCTION

* INSPIRATION
  NFT has attracted a high level of attention from blockchain users as the trading volume of NFT is getting higher and higher, and the trading volume of platforms like OPENSEA is rising exponentially. Countless funds and users who do not know much about NFT are eager to give it a try. This certainly creates endless room for scammers and thieves to exploit. Scam projects and contract vulnerabilities exploit again and again to stimulate the user's fragile nerves, it is foreseeable that with the growth of the market size such strange events will also appear more.

For such an exponentially growing emerging market, a standard, a certification system, or a decentralized platform is needed to audit the newly added NFT project contracts, so that everyone can safely and securely MINT their own NFT,  without worrying about the scams, smart contract exploits, and other malicious events. 

Introducing SAFEMINT!

* WHAT IT DOES
  The ultimate effect is to create a new decentralized contract auditing platform, where community members perform their own duties, relying on economic means, and positively encourage community members to audit contracts, thereby reducing all the system risk of Dapp, NFT project, and other projects that join the community.

* PROJECT LOGO

![logo1](https://user-images.githubusercontent.com/3646667/174471179-32c7e1f8-6e7d-4a7b-aef0-94aff15d5b76.png)

![logo2](https://user-images.githubusercontent.com/3646667/174471187-0e67a0eb-e42a-48ce-8220-8cdc6d05cc30.png)
![logo-small](https://user-images.githubusercontent.com/3646667/174471192-033ade1b-9155-44fe-bb65-5a442d81e5d6.png)

## Plan to accomplish during the hackathon

* The product delivered this time is v 0.1 MVP, which only covers the most basic core functions of this platform: project information is submitted to the platform (safemint), and the platform reviews the project information and verifies whether there are vulnerabilities or frauds in the NFT contract. If there is fraudulent behavior, it will not be displayed on the SAFEMINT platform. If the project is audited by the platform without contract vulnerabilities and fraudulent behavior, the project will be allowed to be listed on the platform, and get a separate display page.
* Users can view project information on the display page, which also provides buttons with functions such as one-click MINT (depending on the contract interface provided by the project party, the type and number of buttons may change). Therefore, in the v 0.1 version, the main core content is : (1) NFT display; (2) Submit; (3) Contract audit and launch

## technical framework
FRONT end: react+umi, hosted in github pages, using aws CDN
DB: all the data are stored in json format in ipfs using pinata, all pictures are stored in ipfs, index of the json file are stored in smart contract
CONTRACT: solidity 

  **Contract**

* `pallet-nft`
  *  function saveProject(string calldata name, string calldata ipfsAddress) external;
  *  function saveProject(string calldata name, string calldata ipfsAddress) external;
  *  function audit(string calldata name) external;
  *  function projectName(string calldata name) public view returns (bool);
  *  function projectIndex(bytes32 nameHash) public view returns(uint256);
     **Client**

* web 
  * NFT project submission page (including preview page)
  * NFT project review page
  * SAFE MINT Home page
  * NFT project display page (including direct mint button)
  * NFT project feed

## Team members

| No   | nickname   | github                                                       | mail address               | Personal profile                                             | responsibility         |
| :--- | :--------- | :----------------------------------------------------------- | :------------------------- | :----------------------------------------------------------- | :--------------------- |
| 1    | Master-Cui | [https://github.com/Fankouzu](https://github.com/Fankouzu)   | 1046166@qq.com             | youtuber, and a bilibili uploader, focused in blockchain education | Initiator              |
| 2    | Jodis      | [https://github.com/JodisW](https://github.com/JodisW)       | wjy8888840@163.com         | Web3 builder，cofunded a Content Social E-commercecompany worth 200 mill usd in Southeast Asia | PM/design              |
| 3    | Eric       | [https://github.com/bluesky0sky](https://github.com/bluesky0sky) | standingboy@qq.com         | web3er                                                       | backend                |
| 4    | ben        | [https://github.com/xiaofeizhang2020](https://github.com/xiaofeizhang2020) | xiaofeizhang2020@gmail.com | web3er                                                       | frontend               |
| 5    | chomper    | [https://github.com/zwq652997](https://github.com/zwq652997/) | oplejon7@gmail.com         | Web3er with the skill of react next typescript node.js       | frontend               |
| 6    | Andy       | [https://github.com/quicklearnpro](https://github.com/quicklearnpro) | abapalv@gmail.com          | web3er                                                       | contract auditor       |
| 7    | Panda      | [https://github.com/wujunze](https://github.com/wujunze)     | 14jzcom@gmail.com          | Solidity / Golang / System Architect                         | System Architect & PMO |
| 8    | heisenberg | [https://github.com/bingowrt](https://github.com/bingowrt)   | bingowrt@gmail.com         | ex petroleum engineer,menber of Conflux technical oversight committee | PM                     |

## Video of the Project
https://www.youtube.com/watch?v=13JLitPKD7A

