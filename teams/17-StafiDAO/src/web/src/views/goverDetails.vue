<template>
  <div>
    <div @click="goBack" class="goBack">< <u>back</u></div>

    <!-- <div>治理详情</div>  -->
    <div class="scot" style="height: 569.594px">
      <div class="ctit">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <th width="200" valign="top">id</th>
            <th width="270" valign="top">creator</th>
            <th width="200" valign="top">number</th>

            <th width="270" valign="top">governType</th>
            <th width="270" valign="top">startDate</th>
            <th width="230" valign="top">endDate</th>
            <th width="200" valign="top">uintValue</th>
            <th width="280" valign="top">totalVoter</th>
            <th width="280" valign="top">Status</th>
            <th width="120"></th>
          </tr>
        </table>
      </div>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr style="text-agin">
          <td width="110">
            {{ voteList.id.slice(0, 5) + "..." }}
          </td>
          <td width="160">{{ voteList.creator.slice(0, 5) + "..." }}</td>
          <td width="100">{{ voteList.number }}</td>
          <td width="180">{{ typeGovern[voteList.governType] }}</td>
          <td width="180">{{ moment(voteList.startDate * 1000) }}</td>
          <td width="180">{{ moment(voteList.endDate * 1000) }}</td>
          <td width="100">
            {{
              voteList.uintValue.length >= 18
                ? web3.utils.fromWei(voteList.uintValue)
                : voteList.uintValue
            }}
          </td>
          <td width="180">
            {{ $toFixedDigit(web3.utils.fromWei(voteList.totalVoter), 4) }}
          </td>
          <td width="180">{{ GovernStatus[res.governState] }}</td>
        </tr>
      </table>
      <div v-if="voteList.voteList.length">
        <div class="gover_">gover details</div>
        <div class="ctit">
          <table width="100%" border="0" cellspacing="0" cellpadding="0">
            <tr style="text-align: center">
              <th width="200" valign="top">ID</th>
              <th width="200" valign="top">VOTOR</th>
              <th width="250" valign="top">NUMBER</th>
              <th width="120" valign="top">GOVERNTYPE</th>
              <th width="120"></th>
            </tr>
          </table>
          <table
            width="100%"
            border="0"
            cellspacing="0"
            cellpadding="0"
            v-for="(item, index) in voteList.voteList.slice(0, 5)"
            :key="index"
          >
            <tr>
              <td width="130">{{ item.id.slice(0, 14) + "..." }}</td>
              <td width="150">{{ item.votor.slice(0, 14) + "..." }}</td>
              <td width="170">{{ item.number }}</td>
              <td width="120">{{ typeGovern[item.governType] }}</td>
              <!-- <td width="100">{{ res.totalVoter }}</td>
            <td width="80">{{ res.approveVoter }}</td>
            <td width="100">{{ res.opposeVoter }}</td>
            <td width="180">in progress</td> -->
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from "moment";
import Web3 from "../../methods/web3.min.js";
import { getGovernanceInfo } from "../../methods/Governance";
export default {
  data() {
    return {
      res: "",
      voteList: [],
      GovernStatus: ["Not Commenced", "On Going", "Succeed", "Fail", "Orver"],
      typeGovern: [
        "DAO technology fee",
        "Collator technology fee",
        "Funds down limit",
        "Funds up limit",
        "4",
        "5",
        "PerInvest down limit",
        "Vote proportion",
        "Reward distribution down limit",
        " Earnings and Airdrop calculation timeframe",
        "10",
        "Redeem time limit",
        "Node zero profit time limit",
        "Rental deposit proportion",
        "Proposal initiate pledge down limit",
        "External Governance Proposal",
      ],
    };
  },
  methods: {
    moment(item) {
      let date = moment(item).format("YYYY-MM-DD");
      return date;
    },
    goBack() {
      this.$router.go(-2);
    },
    async getGovernanceInfo_(num) {
      try {
        let res = await getGovernanceInfo(num);
        console.log(res);
        this.res = res;
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {
    this.web3 = new Web3(window.ethereum);

    this.getGovernanceInfo_(this.$route.query.num);
  },
  created() {
    this.web3 = new Web3(window.ethereum);

    this.voteList = JSON.parse(this.$route.query.item);
    console.log(this.voteList);
  },
};
</script>

<style scoped>
.gover_ {
  text-align: center;
  font-size: 30px;
  margin: 10px 0;
}
.goBack {
  margin: 20px;
  font-size: 24px;
  color: #fff;
}
</style>