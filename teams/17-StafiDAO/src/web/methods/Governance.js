import Web3 from "./web3.min.js";
import $store from "@/store/index";
import Web3_, { providers } from "web3";
import governance from "../contracts/Governance.json";
let web3;
let web3_ = new Web3(
  new providers.HttpProvider("https://rpc.testnet.moonbeam.network")
);
let myContract = new web3_.eth.Contract(
  governance.abi,
  $store.state.governanceAddress
);

function web3_new() {
  if (window.ethereum) {
    try {
      window.ethereum.enable();
    } catch (error) {
      console.error("User denied account access");
    }
    web3 = new Web3(window.ethereum);
  } else if (window.web3) {
    web3 = new Web3(window.ethereum);
  } else {
    alert("Please install wallet");
  }
  const contract = new web3.eth.Contract(
    governance.abi,
    $store.state.governanceAddress
  );
  return contract;
}

export async function setVote(val, bool, num) {
  //治理同意or不同意
  console.log(val, bool, num);

  let transferData;
  let contract = web3_new();
  switch (val) {
    case 0: //技术方手续费治理投票
      console.log("0", val);
      transferData = contract.methods.voteTPByNumber(num, bool).encodeABI();
      break;
    case 1: //收集人服务费治理投票;
      console.log("1", val);
      transferData = contract.methods.voteCTByNumber(num, bool).encodeABI();
      break;
    case 2: //节点投资抵押最低下限治理投票
      console.log("2", val);
      transferData = contract.methods.voteFDLByNumber(num, bool).encodeABI();
      break;
    case 3: //投资抵押上限治理投票
      console.log("3", val);
      transferData = contract.methods.voteFULByNumber(num, bool).encodeABI();
      break;
    case 6: //每人次投资抵押下限治理投票
      console.log("6", val);
      transferData = contract.methods.votePIDLByNumber(num, bool).encodeABI();
      break;
    case 7: //        //投票参与票数比例治理投票
      console.log("7", val);
      transferData = contract.methods.voteVPByNumber(num, bool).encodeABI();
      break;
    case 8: //    最低分配奖励额度治理投票
      console.log("8", val);
      transferData = contract.methods.voteRDByNumber(num, bool).encodeABI();
      break;
    case 9: //    租赁收益和空投起始计算时限治理投票
      console.log("9", val);
      transferData = contract.methods.voteCATByNumber(num, bool).encodeABI();
      break;
    case 10: //    Pool准备金比例治理投票
      console.log("10", val);
      transferData = contract.methods.voteRPByNumber(num, bool).encodeABI();
      break;
    case 11: //    Pool最低赎回时限治理投票
      console.log("11", val);
      transferData = contract.methods.voteRTLByNumber(num, bool).encodeABI();
      break;
    case 12: //    收集人和委托人零受益时限治理投票
      console.log("12", val);
      transferData = contract.methods.voteZTLByNumber(num, bool).encodeABI();
      break;
    case 13: //    收集人和委托人租赁保证金比例治理投票
      console.log("13", val);
      transferData = contract.methods.voteMPByNumber(num, bool).encodeABI();
      break;
    case 14: //    发起提案最低数量治理投票
      console.log("14", val);
      transferData = contract.methods.votePDLByNumber(num, bool).encodeABI();
      break;
    case 15: //    外部治理投票
      console.log("15", val);
      transferData = contract.methods.voteURLByNumber(num, bool).encodeABI();
      break;
  }
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount(
    $store.state.governanceAddress
  );
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.governanceAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    // gas: estimateGasRes * 2,
    gas: 2000000 * 2,
    value: "0x0",
    data: transferData,
  };

  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      return hash;
    })
    .on("error", console.error);
}

export async function startGovern(val, { num, startDate, endDate }) {
  let contract = web3_new();
  let chainId = await web3.eth.getChainId();
  let transferData;
  startDate = startDate * 0.001;
  endDate = endDate * 0.001;
  switch (val) {
    case 0: //开启技术方手续费治理
      console.log("0", val);
      transferData = contract.methods
        .startDTGovern(num, startDate, endDate)
        .encodeABI();
      break;
    case 1: //开启收集人服务费治理;
      console.log("1", val);
      transferData = contract.methods
        .startCTGovern(num, startDate, endDate)
        .encodeABI();
      break;
    case 2: //开启投资抵押最低下限治理,_fundsDownLimit单位为Wei
      console.log("2", val);
      transferData = contract.methods
        .startFDLGovern(web3.utils.toWei(num), startDate, endDate)
        .encodeABI();
      break;
    case 3: //开启投资抵押上限治理,_fundsUpLimit单位为Wei
      console.log("3", val);
      transferData = contract.methods
        .startFULGovern(web3.utils.toWei(num), startDate, endDate)
        .encodeABI();
      break;
    case 6: //开启每人次投资抵押下限治理,_perInvestDownLimit单位为Wei
      console.log("6", val);
      transferData = contract.methods
        .startPIDLGovern(web3.utils.toWei(num), startDate, endDate)
        .encodeABI();
      break;
    case 7: //    //开启投票参与票数比例治理
      console.log("7", val);
      transferData = contract.methods
        .startVPGovern(web3.utils.toWei(num), startDate, endDate)
        .encodeABI();
      break;
    case 8: //    开启最低分配奖励额度治理,_rewardDownLimit单位为Wei
      console.log("8", val);
      transferData = contract.methods
        .startRDGovern(web3.utils.toWei(num), startDate, endDate)
        .encodeABI();
      break;
    case 9: //    开启租赁收益和空投起始计算时限治理
      console.log("9", val);
      transferData = contract.methods
        .startCATGovern(num, startDate, endDate)
        .encodeABI();
      break;
    case 10: //    开启Pool准备金比例治理
      console.log("10", val);
      transferData = contract.methods
        .startRPGovern(num, startDate, endDate)
        .encodeABI();
      break;
    case 11: //    开启Pool最低赎回时限治理
      console.log("11", val);
      transferData = contract.methods
        .startRTLGovern(num, startDate, endDate)
        .encodeABI();
      break;
    case 12: //    开启收集人和委托人零受益时限治理
      console.log("12", val);
      transferData = contract.methods
        .startZTLGovern(num, startDate, endDate)
        .encodeABI();
      break;
    case 13: //    开启收集人和委托人租赁保证金比例治理
      console.log("13", val);
      transferData = contract.methods
        .startMPGovern(num, startDate, endDate)
        .encodeABI();
      break;
    case 14: //    开启发起提案最低数量治理,_proposalDownLimit单位为Wei
      console.log("14", val);
      transferData = contract.methods
        .startPDLGovern(web3.utils.toWei(num), startDate, endDate)
        .encodeABI();
      break;
    case 15: //    开启外部治理
      console.log("15", val);
      transferData = contract.methods
        .startUrlGovern(web3.utils.toWei(num), startDate, endDate)
        .encodeABI();
      break;
  }
  console.log("2", transferData, $store.state.accs);
  let gasPrice = await web3.eth.getGasPrice();
  console.log("3");
  let nonce = await web3.eth.getTransactionCount(
    $store.state.governanceAddress
  );
  console.log("3", gasPrice, nonce, transferData);
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.governanceAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    // gas: estimateGasRes * 2,
    gas: 2000000 * 2,
    value: "0x0",
    data: transferData,
  };
  console.log("4");

  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      return hash;
    })
    .on("error", console.error);
  console.log("5");
}

export async function getDaoTechFee() {
  //技术方手续费
  let res = await myContract.methods.getDaoTechFee().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getCollatorTechFee() {
  //收集人服务费
  let res = await myContract.methods.getCollatorTechFee().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getFundsDownLimit() {
  //节点投资抵押最低下限
  let res = await myContract.methods.getFundsDownLimit().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function getFundsUpLimit() {
  //投资抵押上限
  let res = await myContract.methods.getFundsUpLimit().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function getPerInvestDownLimit() {
  //每人次投资抵押下限
  let res = await myContract.methods.getPerInvestDownLimit().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function getVoterProportion() {
  //查看投票参与票数有效比例
  let res = await myContract.methods.getVoterProportion().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getRewardDownLimit() {
  //查看最低分配奖励额度
  let res = await myContract.methods.getRewardDownLimit().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function getCalTime() {
  //查看租赁收益和空投起始计算时限
  let res = await myContract.methods.getCalTime().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getReserveProportion() {
  //查看Pool准备金比例
  let res = await myContract.methods.getReserveProportion().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getRedeemTimeLimit() {
  //查看Pool最低赎回时限
  let res = await myContract.methods.getRedeemTimeLimit().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getZeroTimeLimit() {
  //查看收集人和委托人零受益时限
  let res = await myContract.methods.getZeroTimeLimit().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getMarginProportion() {
  //查看收集人和委托人租赁保证金比例（retToken）
  let res = await myContract.methods.getMarginProportion().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

export async function getProposalDownLimit() {
  //查看发起提案最低数量
  let res = await myContract.methods.getProposalDownLimit().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function getGovernanceVote(num, add) {
  //查看治理投票状态,根据提案编号和地址
  return new Promise(function (resolve) {
    myContract.methods
      .getGovernanceVote(num, add)
      .call({ from: $store.state.accs })
      .then(function (res) {
        console.log(res);
        resolve(res);
      });
  });
}

//查看治理信息,根据提案编号
export async function getGovernanceInfo(num) {
  let res = await myContract.methods
    .getGovernanceInfo(web3_.utils.toWei(num + ""))
    .call({
      from: $store.state.accs,
      gas: 3141592,
    });
  return res;
}

export async function dayLen() {
  let res = await myContract.methods.dayLen().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}
