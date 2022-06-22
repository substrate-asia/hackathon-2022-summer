<template>
  <div class="sub">
    <div class="stit" style="padding: 50px 0px">
      GOVERNANCE
      <div class="but">
        <a href="#" @click="outerVisible = true">PROPOSAL</a>
      </div>
    </div>
    <div class="scot" style="height: 569.594px">
      <div class="ctit">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <th width="200" valign="top">id</th>
            <th width="270" valign="top">creator</th>
            <th width="160" valign="top">number</th>
            <th width="180" valign="top">governType</th>
            <th width="180" valign="top">startDate</th>
            <th width="180" valign="top">endDate</th>
            <th width="180" valign="top">uintValue</th>
            <th width="180" valign="top">totalVoter</th>
            <th width="280" valign="top">Status</th>
            <th width="120"></th>
          </tr>
        </table>
      </div>
      <div v-if="!listData.length" class="EMPTY">LIST EMPTY</div>
      <div v-else>
        <table
          width="100%"
          border="0"
          cellspacing="0"
          cellpadding="0"
          v-for="(item, index) in listData.slice(0, 5)"
          :key="index"
        >
          <tr>
            <td width="180">
              {{ item.id.slice(0, 5) + "..." }}
            </td>
            <title>{{ item.id }}</title>
            <td width="270">{{ item.creator.slice(0, 5) + "..." }}</td>
            <td width="220">{{ item.number }}</td>
            <td width="250">{{ typeGovern[item.governType] }}</td>
            <td width="210">{{ moment(item.startDate * 1000) }}</td>
            <td width="380">{{ moment(item.endDate * 1000) }}</td>
            <td width="180">
              {{
                item.uintValue.length >= 18
                  ? web3.utils.fromWei(item.uintValue)
                  : item.uintValue
              }}
            </td>
            <td width="180">
              {{ $toFixedDigit(web3.utils.fromWei(item.totalVoter), 4) }}
            </td>
            <td width="180">in progress</td>
            <td width="120">
              <a href="#" @click="goDetails(item.number, item)">Details</a>
              <a href="#"
                >Vote
                <div class="vote">
                  <div
                    class="li"
                    @click="
                      setVote_(item.governType, true, item.number, item.creator)
                    "
                  >
                    Favor
                  </div>
                  <div
                    class="li"
                    @click="
                      setVote_(
                        item.governType,
                        false,
                        item.number,
                        item.creator
                      )
                    "
                  >
                    Oppose
                  </div>
                </div>
              </a>
            </td>
          </tr>
        </table>
      </div>
    </div>
    <!-- 分页 -->
    <!-- <div class="page">
      <a href="#">&lt;</a>
      <a class="on" href="#">1</a>
      <a href="#">2</a>
      <a href="#">3</a>
      <a href="#">4</a>
      <a href="#">&gt;</a>
    </div> -->
    <!-- 弹窗 -->
    <el-dialog
      title="CHOICE GOVERN"
      :visible.sync="outerVisible"
      class="dialog"
    >
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <th width="200" valign="top">gover Name</th>
          <th width="180" valign="top">govern value</th>
          <th width="160" valign="top">start</th>
        </tr>
      </table>
      <table
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="text-aglin: center"
        class="table"
      >
        <tr style="text-agin" class="tr">
          <td width="200">DAO technology fee</td>
          <td width="180">{{ governParams.daoTechFee }}</td>
          <td width="170" @click="inlay(0)" class="td" id="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Collator technology fee</td>
          <td width="150">{{ governParams.collatorTechFee }}</td>
          <td width="170" @click="inlay(1)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Funds down limit</td>
          <td width="150">{{ governParams.fundsDownLimit }}</td>
          <td width="170" @click="inlay(2)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Funds up limit</td>
          <td width="150">{{ governParams.fundsUpLimit }}</td>
          <td width="170" @click="inlay(3)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">PerInvest down limit</td>
          <td width="150">{{ governParams.perInvestDownLimit }}</td>
          <td width="170" @click="inlay(6)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Vote proportion RDGovern</td>
          <td width="150">{{ governParams.voterProportion }}</td>
          <td width="170" @click="inlay(7)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Reward distribution down limit</td>
          <td width="150">{{ governParams.rewardDownLimit }}</td>
          <td width="170" @click="inlay(8)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Earnings and Airdrop calculation timeframe</td>
          <td width="150">{{ governParams.calTime }}</td>
          <td width="170" @click="inlay(9)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Redeem time limit</td>
          <td width="150">{{ governParams.redeemTimeLimit }}</td>
          <td width="170" @click="inlay(11)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Node zero profit time limit</td>
          <td width="150">{{ governParams.zeroTimeLimit }}</td>
          <td width="170" @click="inlay(12)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Rental deposit proportion</td>
          <td width="150">{{ governParams.marginProportion }}</td>
          <td width="170" @click="inlay(13)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">Proposal initiate pledge down limit</td>
          <td width="150">{{ governParams.proposalDownLimit }}</td>
          <td width="170" @click="inlay(14)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
        <tr style="text-agin">
          <td width="130">External Governance</td>
          <td width="150">0</td>
          <td width="170" @click="inlay(15)" class="td">
            <el-button>start</el-button>
          </td>
        </tr>
      </table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="outerVisible = false">CLOSE</el-button>
      </div>
    </el-dialog>
    <el-dialog title="" :visible.sync="dialogVisible" width="30%">
      <div>
        govern value：<el-input
          style="width: 50%"
          v-model.trim="params.num"
          placeholder="govern value"
        ></el-input>
      </div>

      <div class="block">
        <span class="demonstration">start Date：</span>
        <el-date-picker
          v-model="params.startDate"
          type="datetime"
          @focus="pickerFocus"
          value-format="timestamp"
          :picker-options="pickerOptionsBegin"
          placeholder="choice date"
        >
        </el-date-picker>
      </div>
      <div class="block">
        <span class="demonstration">end Date：</span>
        <el-date-picker
          v-model="params.endDate"
          type="datetime"
          @focus="pickerFocus"
          value-format="timestamp"
          :picker-options="pickerOptionsBegin"
          placeholder="choice date"
        >
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">CLOSE</el-button>
        <el-button type="primary" @click="startGovern_">SUBMIT</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Web3 from "../../methods/web3.min.js";
import moment from "moment";
import HelloWorld from "@/components/HelloWorld.vue";
import {
  startGovern,
  setVote,
  getGovernanceInfo,
  ajaxHttpRequestFunc,
  getDaoTechFee, //技术方手术费
  getCollatorTechFee, //收集人服务费
  getFundsDownLimit, //节点投资抵押最低下限
  getFundsUpLimit, //投资抵押上限
  getPerInvestDownLimit, //每人次投资抵押下限
  getVoterProportion, //查看投票参与票数有效比例
  getRewardDownLimit, //查看最低分配奖励额度
  getCalTime, //查看租赁收益和空投起始计算时限
  getReserveProportion, //查看Pool准备金比例
  getRedeemTimeLimit, //查看Pool最低赎回时限
  getZeroTimeLimit, //查看收集人和委托人零受益时限
  getMarginProportion, //查看收集人和委托人租赁保证金比例（retToken）
  getProposalDownLimit, //查看发起提案最低数量
  getGovernanceVote, //查看治理投票状态,根据提案编号和地址
} from "../../methods/Governance";
import { balanceOf, memberTimes } from "../../methods/Pool.js";
import { getGovernanceList } from "../../request/governance";
export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  data() {
    return {
      balance: "",
      outerVisible: false,
      dialogVisible: false,
      params: {
        num: "",
        startDate: "",
        endDate: "",
      },
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
      governParams: {
        daoTechFee: "", //技术方手续费
        collatorTechFee: "", //收集人服务费
        fundsDownLimit: "", //节点投资抵押最低下限
        fundsUpLimit: "", //投资抵押上限
        perInvestDownLimit: "", //每人次投资抵押下限
        voterProportion: "", //投票参与票数有效比例
        rewardDownLimit: "", //最低分配奖励额度
        calTime: "", //租赁收益和空投起始计算时限
        reserveProportion: "", //Pool准备金比例
        redeemTimeLimit: "", //Pool最低赎回时限
        zeroTimeLimit: "", //收集人和委托人零受益时限
        marginProportion: "", //收集人和委托人租赁保证金比例（retToken）
        proposalDownLimit: "", //发起提案最低数量
      },
      nodes: {
        id: "",
        creator: "",
        number: "",
        governType: "",
      },
      tableData: [],
      listData: [],
      pickerOptionsBegin: {
        disabledDate(time) {
          return time.getTime() <= Date.now() - 8.64e6;
        },
      },
    };
  },
  async beforeCreate() {
    (await ethereum.chainId) != "0x507" && this.$cutNetwork(); //切换网络
    await this.$getAccounts();
    console.log("beforeCreate");
  },

  methods: {
    pickerFocus() {
      this.$nextTick(() => {
        document
          .getElementsByClassName("el-button--text")[0]
          .setAttribute("style", "display:none"); // 隐藏此刻按钮
      });
    },
    async balanceOf_() {
      //我的stkToken
      try {
        let res = await balanceOf();
        console.log("my stkToken", res);
        this.balance = res;
      } catch (error) {
        console.log(error);
      }
    },
    moment(item) {
      let date = moment(item).format("YYYY-MM-DD");
      return date;
    },
    async getDaoTechFee_() {
      //技术方手续费
      try {
        this.governParams.daoTechFee = await getDaoTechFee();
      } catch (e) {
        console.log(e);
      }
    },
    async getCollatorTechFee_() {
      //收集人服务费
      try {
        this.governParams.collatorTechFee = await getCollatorTechFee();
      } catch (e) {
        console.log(e);
      }
    },
    async getFundsDownLimit_() {
      //节点投资抵押最低下限
      try {
        this.governParams.fundsDownLimit = await getFundsDownLimit();
      } catch (e) {
        console.log(e);
      }
    },
    async getFundsUpLimit_() {
      //投资抵押上限
      try {
        this.governParams.fundsUpLimit = await getFundsUpLimit();
      } catch (e) {
        console.log(e);
      }
    },
    async getPerInvestDownLimit_() {
      //每人次投资抵押下限
      try {
        this.governParams.perInvestDownLimit = await getPerInvestDownLimit();
      } catch (e) {
        console.log(e);
      }
    },
    async getVoterProportion_() {
      //投票参与票数有效比例
      try {
        this.governParams.voterProportion = await getVoterProportion();
      } catch (e) {
        console.log(e);
      }
    },
    async getRewardDownLimit_() {
      //最低分配奖励额度
      try {
        this.governParams.rewardDownLimit = await getRewardDownLimit();
      } catch (e) {
        console.log(e);
      }
    },
    async getCalTime_() {
      //租赁收益和空投起始计算时限
      try {
        this.governParams.calTime = await getCalTime();
      } catch (e) {
        console.log(e);
      }
    },
    async getRedeemTimeLimit_() {
      //Pool最低赎回时限
      try {
        this.governParams.redeemTimeLimit = await getRedeemTimeLimit();
      } catch (e) {
        console.log(e);
      }
    },
    async getZeroTimeLimit_() {
      //收集人和委托人零受益时限
      try {
        this.governParams.zeroTimeLimit = await getZeroTimeLimit();
      } catch (e) {
        console.log(e);
      }
    },
    async getMarginProportion_() {
      //收集人和委托人租赁保证金比例（retToken）
      try {
        this.governParams.marginProportion = await getMarginProportion();
      } catch (e) {
        console.log(e);
      }
    },
    async getProposalDownLimit_() {
      //发起提案最低数量
      try {
        this.governParams.proposalDownLimit = await getProposalDownLimit();
      } catch (e) {
        console.log(e);
      }
    },

    async setVote_(num, bool, goverNum, id) {
      try {
        //判断是否有效
        let arr = ["Not Commenced", "On Going", "Succeed", "Fail", "Orver"];
        let res = await getGovernanceInfo(num);
        console.log(res);
        if (res.governState != 1) {
          this.$message.error(`The vote has ${arr[res.governState]}！`);
          return;
        }
      } catch (error) {
        console.log(error);
      }

      if (!parseFloat(this.balance)) {
        //判断stkToken是否有值
        this.$message.error("You don't have stkToken！");
        return;
      }

      try {
        //判断是否已投
        let res = await getGovernanceVote(num, id);
        if (parseInt(res)) {
          this.$message.error("You have to vote");
          return;
        }
        console.log(res);
      } catch (error) {
        console.log(error);
      }
      try {
        //投票
        let res = await setVote(num, bool, goverNum);
      } catch (error) {
        console.log(error);
      }
    },
    async startGovern_() {
      if (
        parseFloat(this.balance) <
        parseFloat(this.governParams.proposalDownLimit)
      ) {
        this.$message.error(
          "Your stkToken is less than the minimum number of proposals!"
        );
        return;
      }
      if (!this.params.num) {
        this.$message.error("Please complete!");
        return;
      }
      if (this.params.startDate && this.params.endDate) {
        if (this.params.startDate >= this.params.endDate) {
          this.$message.error(
            "The end time must be longer than the start time"
          );

          return;
        }
      }
      try {
        //对比质押时长 小于则不允许开启
        let res = await memberTimes();
        console.log(res);
        if (parseFloat(res) < parseFloat(this.governParams.calTime)) {
          this.$message.error("stakeTime less than calTime!");

          return;
        }
      } catch (error) {
        console.log(error);
      }

      try {
        console.log(this.val);
        let res = await startGovern(this.val, this.params);
        this.dialogVisible = this.outerVisible = false;
      } catch (error) {
        console.log(error);
      }
    },
    async inlay(val) {
      this.dialogVisible = true;
      this.params.num = "";
      this.params.startDate = "";
      this.params.endDate = "";
      // this.params.inVal = "";
      this.val = val;
    },
    async getlist() {
      try {
        let res = await getGovernanceList();
        for (let i = 0; i < res.startGoverns.nodes.length; i++) {
          res.startGoverns.nodes[i].voteList = [];
          for (let j = 0; j < res.voteByNumbers.nodes.length; j++) {
            if (
              res.startGoverns.nodes[i].number ===
              res.voteByNumbers.nodes[j].number
            ) {
              res.startGoverns.nodes[i].voteList.push(
                res.voteByNumbers.nodes[j]
              );
            }
          }
        }
        this.listData = res.startGoverns.nodes;
        console.log(this.listData);
      } catch (e) {
        console.log(e);
      }
    },
    goDetails(num, item) {
      var arr = JSON.stringify(item);
      this.$router.push({
        path: "/goverDetails",
        query: { num, item: arr },
      });
    },
  },
  mounted() {
    this.web3 = new Web3(window.ethereum);
    // this.getGovernanceInfo_(); // this.getlistData();
    this.getlist();
    Promise.all([
      this.getDaoTechFee_(), //技术方手续费
      this.getCollatorTechFee_(), //收集人服务费
      this.getFundsDownLimit_(), //节点投资抵押最低下限
      this.getFundsUpLimit_(), //投资抵押上限
      this.getPerInvestDownLimit_(), //每人次投资抵押下限
      this.getVoterProportion_(), //投票参与票数有效比例
      this.getRewardDownLimit_(), //最低分配奖励额度
      this.getCalTime_(), //租赁收益和空投起始计算时限
      this.getRedeemTimeLimit_(), //Pool最低赎回时限
      this.getZeroTimeLimit_(), //收集人和委托人零受益时限
      this.getMarginProportion_(), //收集人和委托人租赁保证金比例（retToken）
      this.getProposalDownLimit_(), //发起提案最低数量
      this.balanceOf_(),
    ]);
  },
};
</script>
<style >
.simple {
  width: 260px;
  margin-left: 10px;
  margin-right: 30px;
  margin-bottom: 15px;
}
.block {
  margin: 30px 0;
}
.block span {
  margin-right: 15px;
}
.EMPTY {
  text-align: center;
  font-size: 30px;
  margin: 50px 0;
}
.table > tr > td {
  text-align: center;
}
.tr {
  margin: 120px;
}
</style>