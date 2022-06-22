import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import Web3_, { providers } from "web3";
import $store from "@/store/index";
import "element-ui/lib/theme-chalk/index.css";
// 导入全局样式表
import "./assets/css/global.css";

Vue.config.productionTip = false;

Vue.use(ElementUI);

let web3;
let web3_ = new Web3_(
  new providers.HttpProvider("https://rpc.testnet.moonbeam.network")
);

Vue.prototype.$web3_ = web3_;
Vue.prototype.$accountsChanged = async function () {
  ethereum.on("accountsChanged", function (accounts) {
    $store.commit("updateAccs", accounts[0]); //第一位账户
    console.log(accounts[0]); //一旦切换账号这里就会执行
  });
};
Vue.prototype.$toFixedDigit = function (num, decimal) {
  if (typeof num == "number") {
    num = num.toString();
  }
  var index = num.indexOf(".");
  if (index !== -1) {
    num = num.substring(0, decimal + index + 1);
    return parseFloat(num).toFixed(decimal);
  } else {
    return num; // num = num.substring(0);
  }
  // return parseFloat(num).toFixed(decimal);
};

Vue.prototype.$cutNetwork = async function () {
  window.ethereum.request({
    //更换网络
    method: "wallet_addEthereumChain", // Metamask的api名称
    params: [
      {
        chainId: "0x507", // 网络id，16进制的字符串
        chainName: "1287", // 添加到钱包后显示的网络名称
        rpcUrls: [
          "https://rpc.testnet.moonbeam.network", // rpc地址
        ],
        blockExplorerUrls: [
          "https://rpc.testnet.moonbeam.network", // 网络对应的区块浏览器
        ],
        nativeCurrency: {
          // 网络主币的信息
          name: "HT",
          symbol: "HT",
          decimals: 18,
        },
      },
    ],
  });
};

Vue.prototype.$getAccounts = async function () {
  console.log("getAccounts");
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
  if (typeof web3 !== "undefined") {
    console.warn(
      "Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask"
    );
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn(
      "No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask"
    );
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc.testnet.moonbeam.network5")
    );
  }
  //web3获取账户
  web3.eth.getAccounts(function (err, accs) {
    if (err != null) {
      alert("There was an error fetching your accounts.");
      return;
    }
    if (accs.length == 0) {
      alert(
        "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
      );
      return;
    }
    // accounts = accs;
    console.log(accs);
    $store.commit("updateAccs", accs[0]); //第一位账户
  });
};

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
