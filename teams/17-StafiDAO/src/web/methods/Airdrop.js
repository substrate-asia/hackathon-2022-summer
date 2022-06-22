import Web3 from "./web3.min.js";
import $store from "@/store/index";
import Web3_, { providers } from "web3";
import airdrop from "../contracts/Airdrop.json";
let web3;
let web3_ = new Web3(
  new providers.HttpProvider("https://rpc.testnet.moonbeam.network")
);
let myContract = new web3_.eth.Contract(
  airdrop.abi,
  $store.state.airdropAddress
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
    airdrop.abi,
    $store.state.airdropAddress
  );
  return contract;
}

//查看治理信息,根据提案编号
export async function totalSupply(num) {
  let res = await myContract.methods.totalSupply().call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}

export async function balanceOfAirdrop() {
  let res = await myContract.methods.balanceOf($store.state.accs).call({
    from: $store.state.accs,
    gas: 3141592,
  });
  return web3_.utils.fromWei(res);
}
