import Web3 from "./web3.min.js";
import $store from "@/store/index";
import Web3_, { providers } from "web3";
import faucet from "../contracts/Faucet.json";
let web3;
let web3_ = new Web3(
  new providers.HttpProvider("https://rpc.testnet.moonbeam.network")
);
let myContract = new web3_.eth.Contract(faucet.abi, $store.state.faucetAddress);

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
    faucet.abi,
    $store.state.faucetAddress
  );
  return contract;
}

export async function getBalance() {
  //原生质押token余额
  let res = await myContract.methods.balance().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}
//添加NimbusId，用于绑定钱包奖励(收集人)
export async function addAssociation(val) {
  let contract = web3_new();
  web3.eth.getBalance($store.state.accs).then(console.log);
  let amount = val + "";
  let transferData = contract.methods.addAssociation().encodeABI();
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.faucetAddress);
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.faucetAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    gas: 2000000 * 2,
    value: web3.utils.toWei(amount),
    data: transferData,
  };
  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      if (hash) {
        web3.eth.getTransactionReceipt(hash).then(function (res) {
          console.log(res);
          if (res.status) {
            return { code: 1 };
          } else {
            new Error({ code: 0 });
          }
        });
      }
      console.log(hash);
    })
    .on("error", console.error);

  console.log("5");
}
//更新NimbusId(收集人)
export async function updateAssociation(val) {
  let contract = web3_new();
  web3.eth.getBalance($store.state.accs).then(console.log);
  let amount = val + "";
  let transferData = contract.methods.updateAssociation().encodeABI();
  let gasPrice = await web3.eth.getGasPrice();
  let nonce = await web3.eth.getTransactionCount($store.state.faucetAddress);
  let rawTransaction = {
    from: $store.state.accs,
    to: $store.state.faucetAddress,
    nonce: web3.utils.toHex(nonce),
    gasPrice: gasPrice,
    gas: 2000000 * 2,
    value: web3.utils.toWei(amount),
    data: transferData,
  };
  web3.eth
    .sendTransaction(rawTransaction)
    .on("transactionHash", function (hash) {
      if (hash) {
        web3.eth.getTransactionReceipt(hash).then(function (res) {
          console.log(res);
          if (res.status) {
            return { code: 1 };
          } else {
            new Error({ code: 0 });
          }
        });
      }
      console.log(hash);
    })
    .on("error", console.error);

  console.log("5");
}
