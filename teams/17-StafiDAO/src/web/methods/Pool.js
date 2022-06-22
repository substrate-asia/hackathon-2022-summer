import Web3 from "./web3.min.js";
import $store from "@/store/index";
import Web3_, { providers } from "web3";
import pool from "../contracts/Pool.json";
import { Promise } from "core-js";
let web3;
let web3_ = new Web3(
  new providers.HttpProvider("https://rpc.testnet.moonbeam.network")
);
let myContract = new web3_.eth.Contract(pool.abi, $store.state.poolAddress);

function sendEtherFrom(receipt) {
  return receipt;
}

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
  const contract = new web3.eth.Contract(pool.abi, $store.state.poolAddress);
  return contract;
}

export async function createCollator({
  collatorAddr,
  period, //1三十天 2六十天
  stkAmount,
}) {
  console.log(collatorAddr, period, stkAmount);
  let contract = web3_new();
  let transferData = contract.methods
    .createCollator(collatorAddr, period, web3.utils.toWei(stkAmount))
    .encodeABI();
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.poolAddress);
  console.log(gasPrice, nonce, transferData);
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.poolAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    // gas: estimateGasRes * 2,
    gas: 3000000 * 2,
    value: "0x0",
    data: transferData,
    chainId: 1287,
  };
  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      return hash;
    })
    .on("error", console.error);
}

export async function createDelegator({
  collatorAddr,
  period, //1三十天 2六十天
  stkAmount,
}) {
  let contract = web3_new();
  let chainId = await web3.eth.getChainId();
  let transferData = contract.methods
    .createDelegator(collatorAddr, period, web3.utils.toWei(stkAmount))
    .encodeABI();
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.poolAddress);
  console.log(gasPrice, nonce, transferData);
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.poolAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    // gas: estimateGasRes * 2,
    gas: 3000000 * 2,
    value: "0x0",
    data: transferData,
    chainId: 1287,
  };
  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      return hash;
    })
    .on("error", console.error);
}

// 增加收集人选票
export async function addCollator({
  collatorAddr,
  period, //1三十天 2六十天
  stkAmount,
}) {
  let contract = web3_new();
  let chainId = await web3.eth.getChainId();
  let transferData = contract.methods
    .addCollator(collatorAddr, period, web3.utils.toWei(stkAmount))
    .encodeABI();
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.poolAddress);
  console.log(gasPrice, nonce, transferData);
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.poolAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    // gas: estimateGasRes * 2,
    gas: 3000000 * 2,
    value: "0x0",
    data: transferData,
    chainId: 1287,
  };
  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      return hash;
    })
    .on("error", console.error);
}

// 增加委托人选票
export async function addDelegator({
  collatorAddr,
  period, //1三十天 2六十天
  stkAmount,
}) {
  let contract = web3_new();
  let chainId = await web3.eth.getChainId();
  let transferData = contract.methods
    .addDelegator(collatorAddr, period, web3.utils.toWei(stkAmount))
    .encodeABI();
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.poolAddress);
  console.log(gasPrice, nonce, transferData);
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.poolAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    // gas: estimateGasRes * 2,
    gas: 3000000 * 2,
    value: "0x0",
    data: transferData,
    chainId: 1287,
  };
  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      return hash;
    })
    .on("error", console.error);
}

export async function addStake(val) {
  let contract = web3_new();
  web3.eth.getBalance($store.state.accs).then(console.log);
  let chainId = await web3.eth.getChainId();
  let amount = val + "";
  let transferData = contract.methods.addStake().encodeABI();
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.poolAddress);
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.poolAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    // gas: estimateGasRes * 2,
    gas: 2000000 * 2,
    value: web3.utils.toWei(amount),
    data: transferData,
    // chainId: 1287
  };

  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      console.log(hash);
    })
    .on("receipt", function (receipt) {
      console.log(receipt);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      console.log(receipt);
    })
    .on("error", console.error);

  // getHash().then((res) => {
  //   console.log(res);
  //   if (res) {
  //     let receipt = web3_.eth.getTransactionReceipt(res);
  //     console.log(receipt);
  //     console.log("已return");
  //     return receipt;
  //   } else {
  //     return Promise.reject();
  //   }
  // });

  console.log("5");
}

//计划赎回
export async function scheduleRedeemStake(val) {
  let contract = web3_new();
  web3.eth.getBalance($store.state.accs).then(console.log);
  console.log("1");
  let amount = val + "";
  let transferData = contract.methods
    .scheduleRedeemStake(web3.utils.toWei(amount))
    .encodeABI();
  console.log("2");
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.poolAddress);
  console.log("3");
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.poolAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    gas: 2000000 * 2,
    value: "0x0",
    data: transferData,
  };
  console.log("4");
  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      console.log(hash);
    })
    .on("receipt", function (receipt) {
      console.log(receipt);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      console.log(receipt);
    })
    .on("error", console.error); // 如果是 out of gas 错误, 第二个参数为交易收据;

  console.log("5");
}

// 确认赎回
export async function executeRedeemStake(val) {
  let contract = web3_new();
  web3.eth.getBalance($store.state.accs).then(console.log);
  console.log("1");
  let amount = val + "";
  let transferData = contract.methods.executeRedeemStake().encodeABI();
  console.log("2");
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.poolAddress);
  console.log("3");
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.poolAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    gas: 2000000 * 2,
    value: "0x0",
    data: transferData,
  };
  console.log("4");
  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      console.log(hash);
    })
    .on("receipt", function (receipt) {
      console.log(receipt);
    })
    .on("confirmation", function (confirmationNumber, receipt) {
      console.log(confirmationNumber);
      console.log(receipt);
    })
    .on("error", console.error); // 如果是 out of gas 错误, 第二个参数为交易收据;

  console.log("5");
}

export async function getDelegatorAddrs() {
  //获取收集人地址集
  let res = await myContract.methods.getDelegatorAddrs($store.state.accs).call({
    gas: 3141592,
  });
  return res;
}

export async function getCollatorAddrs() {
  //获取委托人地址集
  let res = await myContract.methods.getCollatorAddrs($store.state.accs).call({
    gas: 3141592,
  });
  return res;
}

export async function balance() {
  //原生质押token余额
  let res = await myContract.methods.balance().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function getRetToken(val) {
  //从faucet获取token所需rettoken数量
  let res = await myContract.methods
    .getRetToken(web3_.utils.toWei(val + ""))
    .call({
      from: $store.state.accs,
      gas: 3141592,
    });
  return web3_.utils.fromWei(res);
}

export async function balanceOf() {
  //我的
  //从faucet获取token所需rettoken数量
  let res = await myContract.methods.balanceOf($store.state.accs).call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function totalSupplyPool() {
  //总池子
  let res = await myContract.methods.totalSupply().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function memberTimes() {
  //总池子
  console.log(myContract.methods);
  let times = await myContract.methods.memberTimes($store.state.accs).call({
    from: $store.state.accs,
    gas: 3141592,
  });

  let day = await myContract.methods.getDays().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return day - times / (24 * 60 * 60);
}

//我的赎回
export async function redeemInfos() {
  //总池子
  let res = await myContract.methods.redeemInfos($store.state.accs).call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return res;
}

// 赎回租赁总量
export async function getAllPendingRedeem() {
  let res = await myContract.methods.getAllPendingRedeem().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

//带赎回质押总量
export async function pendingRedeem() {
  let res = await myContract.methods.pendingRedeem().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}
