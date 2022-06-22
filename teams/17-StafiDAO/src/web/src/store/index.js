import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    contractAddress: "0x60F2375e985C819c809B53d36eba3C4f83c22415", //合约地址
    //、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、、

    accs: "" || localStorage.getItem("accs"), //第一位账户1
    pool: "0x97DfA8aaAb1e3E85d35bED3F6D4f2Bb92B02e668",
    reward: "0x2b23F152ef681845C3c23563626E8a84F9F4Bc32",
    airdrop: "0xee742Fe1BA019BAdeB285d4241Aa3ea44b512F98",
    governance: "0x72252797937721c3A56e02dF360CCeC343972067",
    faucet: "0x88C007834CCf093280c8e6328C5544dDD639a5c3",
    factory: "0x82F0750ed3aBDE5A78523e6A5eF8a9A016faB293",

    /////////////////////////////////////////////////////////////////////////

    factoryAddress: "", //创建DAO合约地址  调合约最后使用此地址
    poolAddress: "0x4D12765100c0a4D3C6361521ea21f009499136eC", //水龙头合约地址      调合约最后使用此地址
    rewardAddress: "0x827bB2d4Eb60C3CCF47f8c4Ac36487aac9a86782", //奖励池合约地址    调合约最后使用此地址
    airdropAddress: "0x9aB76857F3bB2bfc03925FA79450BdDC0891fEac", //空投合约地址     调合约最后使用此地址
    governanceAddress: "0x3F8bc5F0D5c92820d8aF60D98e63efDef55804D3", //治理合约地址  调合约最后使用此地址
    faucetAddress: "0xeD9a3ec72E8dA40b960E12AAb5c99464D33D328E", //水龙头合约地址    调合约最后使用此地址
  },
  mutations: {
    updateAccs(state, val) {
      //accs赋值
      state.accs = val;
      localStorage.setItem("accs", val);
      console.log(val);
    },
    setGovernan(state, val) {
      state.governanceAddress = val;
    },
    setPool(state, val) {
      state.poolAddress = val;
    },
    setAirdrop(state, val) {
      state.airdropAddress = val;
    },
    setReward(state, val) {
      state.rewardAddress = val;
    },
  },
  actions: {},
  getters: {},
});
