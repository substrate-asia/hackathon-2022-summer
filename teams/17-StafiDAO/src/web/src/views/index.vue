<template>
  <div>
    <div class="main">
      <div class="ads">
        Staking your GMLR or MOVR<br />
        <span>In addition to obtaining pledge income</span><br />
        <span>At the same time, you can also get rettoken reward</span>
      </div>
      <div class="statistics" style="boder: 1px solid #000">
        <div class="li" style="boder: 1px solid #000; display: flex">
          <div class="sli">
            {{ $toFixedDigit(total.stkTokenNum, 4) || 0 }}
            <span>Total staking</span>
          </div>
          <div class="sli">
            {{ $toFixedDigit(total.retTokenNum, 4) || 0 }}
            <span>Total awards</span>
          </div>
          <div class="sli">
            {{ $toFixedDigit(total.rent, 4) || 0 }}
            <!-- GLMR -->
            <span>Leasable quota </span>
          </div>
          <div class="sli">
            {{ $toFixedDigit(total.redeem, 4) || 0 }}
            <span>Pledge redemption </span>
          </div>
          <div class="sli">
            {{ $toFixedDigit(total.pendingRedeem, 4) || 0 }}
            <span>Lease redemption </span>
          </div>
        </div>
      </div>
      <div class="buts">
        <div class="but-staking" @click="btnClick('popup_staking')">
          <a href="javascript:;">START STAKING</a>
        </div>
        <div class="but-collator" @click="creation('popup_collator', 1)">
          <a href="javascript:;">CREATE COLLATOR </a>
        </div>
        <div class="but-collator" @click="creation('popup_collator', 0)">
          <a href="javascript:;">I AM COLLATOR</a>
        </div>
      </div>
    </div>

    <div class="balance">
      <div class="cot">
        <div class="btit">
          <div class="icon">
            <img
              src="../assets/image/icon_balance.png"
              width="25"
              height="26"
              alt="Balance"
            />
          </div>
          <div class="txt">Balance</div>
          <div class="user">
            <div class="headimg">
              <img
                src="../assets/image/headimg.png"
                width="35"
                height="35"
                alt="Headimg"
              />
            </div>
            <div class="address">{{ $store.state.accs }}</div>
          </div>
        </div>
        <div class="bcot">
          <div class="li">
            <div class="txt">
              {{ $toFixedDigit(mianNum.stkTokenNum, 4) || 0 }}
              <span>stkToken</span>
            </div>
            <div class="redeemBtn">
              <div style="color: red">Return within 7 days</div>

              <div style="display: flex">
                <div
                  class="but"
                  @click="btnClick('popup_claim')"
                  style="margin-right: 20px"
                >
                  <a href="#">Plan</a>
                </div>
                <div
                  class="but"
                  @click="ConfirmRedeem"
                  v-show="RedeemInfo.bflag"
                >
                  <a href="#">Confirm</a>
                </div>
                <!-- <div class="but" @click="Myredemption">
                  <a href="#">My redeem</a>
                </div> -->
              </div>
            </div>
          </div>
          <div class="li" style="">
            <div class="txt">
              {{ $toFixedDigit(mianNum.retTokenNum, 4) || 0 }}
              <span>retToken</span>
            </div>
          </div>
          <div class="li">
            <div class="txt">
              {{
                total.stkTokenNum
                  ? ((mianNum.stkTokenNum / total.stkTokenNum) * 100).toFixed(2)
                  : 0
              }}
              <span>Proportion of staking</span>
            </div>
          </div>
          <div class="li" style="">
            <div class="txt" v-show="RedeemInfo.bflag">
              {{ web3.utils.fromWei(RedeemInfo.redeemAmount) || 0 }}
              <span>Redeem amount</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="latest">
      <div class="li">
        <div class="ltit">
          <div class="icon">
            <img
              src="../assets/image/icon_rewards.png"
              width="25"
              height="26"
              alt="Latest rewards"
            />
          </div>
          <div class="txt">Latest rewards</div>
        </div>
        <div class="lcot" v-if="RewardList.length">
          <div class="cli" v-for="(item, index) of RewardList" :key="index">
            {{
              item.contractAddress.substr(0, 12) +
              "...." +
              item.contractAddress.substr(30)
            }}
            <span>{{ $toFixedDigit(web3.utils.fromWei(item.amount), 6) }}</span>
          </div>
          <!-- <div class="more"><a href="#">MORE>></a></div> -->
        </div>
        <div v-else class="EMPTY">LIST EMPTY</div>
      </div>
      <div class="li li2">
        <div class="ltit">
          <div class="icon">
            <img
              src="../assets/image/icon_rewards.png"
              width="25"
              height="26"
              alt="Latest airdrop"
            />
          </div>
          <div class="txt">Latest airdrop</div>
        </div>
        <div class="lcot" v-if="AirdropList.length">
          <div class="cli" v-for="(item, index) of AirdropList" :key="index">
            {{
              item.contractAddress.substr(0, 12) +
              "...." +
              item.contractAddress.substr(30)
            }}
            <span>{{ web3.utils.fromWei(item.value) }} retToken</span>
          </div>

          <!-- <div class="more"><a href="#">MORE>></a></div> -->
        </div>
        <div v-else class="EMPTY">LIST EMPTY</div>
      </div>

      <!-- 收集人列表 -->
      <div class="li li-collator">
        <div class="ltit">
          <div class="icon">
            <img
              src="../assets/image/icon_collator.png"
              width="25"
              height="26"
              alt="Latest collator"
            />
          </div>
          <div class="addBtn_title">
            <div class="txt">Create list</div>
          </div>
        </div>
        <div v-if="!tableData.length" class="EMPTY">LIST EMPTY</div>

        <div class="lcot" v-else>
          <div
            class="cli"
            v-for="(item, index) in tableData.slice(0, 5)"
            :key="index"
          >
            <div class="headimg">
              <img
                src="../assets/image/headimg.png"
                width="35"
                height="35"
                alt="Headimg"
              />
            </div>
            <div class="address">
              {{ item.substr(0, 12) + "...." + item.substr(30) }}
            </div>
            <div class="operate">
              <div class="oli collator-bind" @click="dianji(item)">
                <img
                  src="../assets/image/icon_bind.png"
                  width="35"
                  height="35"
                  alt="Bind"
                />
              </div>
              <div class="oli" @click="showAddPop('popup_addPerson', 0, item)">
                <img
                  src="../assets/image/plus.png"
                  width="35"
                  height="35"
                  alt="Del"
                />
              </div>
            </div>
            <!-- <div class="wrong">No reward for 2 days</div> -->
          </div>

          <!-- <div class="more"><a href="#">MORE>></a></div> -->
        </div>
      </div>

      <!-- 委托人人列表 -->
      <div class="li li2 li-collator">
        <div class="ltit">
          <div class="icon">
            <img
              src="../assets/image/icon_collator.png"
              width="25"
              height="26"
              alt="Latest consigner"
            />
          </div>
          <div class="addBtn_title">
            <div class="txt">Lease list</div>
          </div>
        </div>
        <div v-if="!setData.length" class="EMPTY">LIST EMPTY</div>

        <div class="lcot" v-else>
          <div
            class="cli"
            v-for="(item, index) in setData.slice(0, 5)"
            :key="index"
          >
            <div class="headimg">
              <img
                src="../assets/image/headimg.png"
                width="35"
                height="35"
                alt="Headimg"
              />
            </div>
            <div class="address">
              {{ item.substr(0, 12) + "...." + item.substr(30) }}
            </div>
            <div class="operate">
              <div class="oli" @click="showAddPop('popup_addPerson', 1, item)">
                <img
                  src="../assets/image/plus.png"
                  width="35"
                  height="35"
                  alt="Del"
                />
              </div>
            </div>
          </div>

          <!-- <div class="more"><a href="#">MORE>></a></div> -->
        </div>
      </div>
    </div>
    <!-- 质押/ -->
    <div id="popup_staking" class="popup">
      <div class="cot staking">
        <div class="close" @click="closePop"></div>
        <div class="stit">STAKING GLMR</div>
        <div class="scot form">
          <form id="form_collator" name="form_collator" action="" method="post">
            <div class="li">
              <div class="input">
                <input
                  name="amount"
                  type="text"
                  placeholder="GLMR Amount"
                  v-model.trim="amount"
                />
              </div>
            </div>
            <div class="but" @click="addStake"><a href="#">SUBMIT</a></div>
          </form>
        </div>
      </div>
    </div>

    <!-- 赎回 -->
    <div id="popup_claim" class="popup">
      <div class="cot staking">
        <div class="close" @click="closePop"></div>
        <div class="stit">CLAIM GLMR</div>
        <div class="scot form">
          <form id="form_collator" name="form_collator" action="" method="post">
            <div class="li">
              <div class="input">
                <input
                  name="amount"
                  type="text"
                  placeholder="GLMR Amount"
                  v-model.trim="claimNum"
                />
              </div>
            </div>
            <div class="but" @click="scheduleRedeemStake_">
              <a href="#">SUBMIT</a>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 绑定收集人服务id -->
    <div id="popup_collator_bind" class="popup">
      <div class="cot staking bind">
        <div class="close" @click="closePop"></div>
        <div class="stit">COLLATOR BIND ID</div>
        <div class="scot form">
          <form
            id="form_collator_bind"
            name="form_collator_bind"
            action=""
            method="post"
          >
            <div class="li">
              <div class="input">
                <input
                  name="id"
                  type="text"
                  placeholder="ID value"
                  v-model="input"
                />
              </div>
            </div>
            <div class="but"><a href="#" @click="submit(res)">SUBMIT</a></div>
          </form>
        </div>
      </div>
    </div>
    <!-- 创建收集人 委托人框 共用 -->

    <div id="popup_collator" class="popup">
      <div class="cot staking">
        <div class="close" @click="closePop"></div>
        <div class="stit">OBTAIN GLMR</div>
        <div class="scot form">
          <form id="form_staking" name="form_staking" action="" method="post">
            <div class="li">
              <div class="input">
                <input
                  name="amount"
                  type="text"
                  placeholder="GLMR Amount"
                  v-model.trim="pamars.stkAmount"
                />
              </div>
            </div>
            <div class="explain" v-show="retNum && pamars.stkAmount">
              Require {{ retNum }} retToken!
            </div>
            <div class="li">
              <div class="input">
                <input
                  name="address"
                  type="text"
                  :placeholder="perType ? 'Tech Address' : 'Collator Address'"
                  v-model.trim="pamars.collatorAddr"
                />
              </div>
            </div>
            <div class="li">
              <div class="input">
                <input
                  name="datetime"
                  type="text"
                  placeholder="Period"
                  v-model.trim="pamars.period"
                />
              </div>
            </div>
            <div class="explain" v-show="day && pamars.period">
              Period {{ day }} day
            </div>
            <div class="but" @click="createPerson">
              <a href="#">SUBMIT</a>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 增加收集人 委托人选票共用 -->
    <div id="popup_addPerson" class="popup">
      <div class="cot staking">
        <div class="close" @click="closePop"></div>
        <div class="stit">OBTAIN GLMR</div>
        <div class="scot form">
          <form id="form_staking" name="form_staking" action="" method="post">
            <div class="li">
              <div class="input">
                <input
                  name="amount"
                  type="text"
                  placeholder="GLMR Amount"
                  v-model.trim="addPamars.stkAmount"
                />
              </div>
            </div>
            <div class="explain" v-show="retNum && addPamars.stkAmount">
              Require {{ retNum }} retToken!
            </div>
            <div class="li">
              <div class="input">
                <input
                  name="address"
                  type="text"
                  :placeholder="
                    addType ? 'Collator Address' : 'Delegator Address'
                  "
                  v-model.trim="addPamars.collatorAddr"
                />
              </div>
            </div>
            <div class="li">
              <div class="input">
                <input
                  name="datetime"
                  type="text"
                  placeholder="Staking Days"
                  v-model.trim="addPamars.period"
                />
              </div>
            </div>
            <div class="explain" v-show="day && addPamars.period">
              Period {{ day }} day
            </div>
            <div class="but" @click="addSubmit">
              <a href="#">SUBMIT</a>
            </div>
          </form>
        </div>
      </div>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="30%">
           
      <div class="li">
               
        <div class="input">
                   
          <input
            name="id"
            type="text"
            placeholder="ID value"
            v-model="sessIDValue"
          />
                 
        </div>
             
      </div>
           
      <span slot="footer" class="dialog-footer">
                <el-button @click="insert()">insert</el-button>        
        <el-button type="primary" @click="update()">update</el-button>      
      </span>
         
    </el-dialog>
  </div>
</template>

<script>
import Web3 from "../../methods/web3.min.js";
import { totalSupply, balanceOfAirdrop } from "../../methods/Airdrop";
import { getRedeemTimeLimit } from "../../methods/Governance";
import { getAirdropList, getRewardList } from "../../request/governance";
import {
  getMarginProportion, //查看收集人和委托人租赁保证金比例（retToken）
  dayLen,
} from "../../methods/Governance";
import {
  addStake,
  balance,
  getCollatorAddrs,
  getDelegatorAddrs,
  createDelegator,
  createCollator,
  scheduleRedeemStake,
  balanceOf,
  totalSupplyPool,
  addDelegator,
  addCollator,
  executeRedeemStake,
  getAllPendingRedeem, //赎回租赁总量
  pendingRedeem, //带赎回质押总量
  redeemInfos, //我的赎回
} from "../../methods/Pool.js";
import {
  updateAssociation,
  addAssociation,
  getBalance,
} from "../../methods/Faucet.js";
import $store from "@/store/index";
export default {
  data() {
    return {
      RedeemInfo: {
        redeemNumber: "", //赎回区块高度
        redeemAmount: "", //赎回数量
        bflag: "", //是否有效
      },
      marPro: "", //收集人和委托人租赁保证金比例
      input: "",
      add: false,
      amount: "",
      tableData: [],
      AirdropList: [],
      RewardList: [],
      dialogVisible: false,
      setData: [],
      addType: "",
      retNum: "",
      sessIDValue: "",
      claimNum: "",
      day: "",
      myRedeemdialog: false,
      balanceVal: "",
      mianNum: {
        retTokenNum: "",
        stkTokenNum: "",
        rGLMR: "",
      },
      total: {
        retTokenNum: "",
        stkTokenNum: "",
        redeem: "", //带赎回质押总量
        pendingRedeem: "", //赎回租赁金
        rent: "", //可租用金
      },
      perType: "",
      pamars: {
        collatorAddr: "",
        period: "", //1三十天 2六十天
        stkAmount: "",
      },
      addPamars: {
        collatorAddr: "",
        period: "", //1三十天 2六十天
        stkAmount: "",
      },
    };
  },
  watch: {
    addPamars: {
      async handler(newObj) {
        if (newObj.stkAmount) {
          console.log("stkAmount");

          try {
            let retNum = await getMarginProportion();
            this.retNum = newObj.stkAmount + newObj.stkAmount * (retNum / 10);
            // console.log(retNum, this.retNum);
          } catch (error) {
            console.log(error);
          }
        }
        if (newObj.period) {
          console.log("day");
          try {
            let day = await dayLen();
            this.day = day * 10 * newObj.period;
          } catch (error) {
            console.log(error);
          }
        }
      },
      deep: true,
    },
    pamars: {
      async handler(newObj) {
        if (newObj.stkAmount) {
          console.log("stkAmount");
          try {
            let retNum = await getMarginProportion();
            this.retNum = newObj.stkAmount + newObj.stkAmount * (retNum / 10);
            // console.log(retNum, this.retNum);
          } catch (error) {
            console.log(error);
          }
        }
        if (newObj.period) {
          console.log("day");
          try {
            let day = await dayLen();
            this.day = day * 10 * newObj.period;
          } catch (error) {
            console.log(error);
          }
        }
      },
      deep: true,
    },
    accs(newVal, oldVal) {
      console.log(newVal, oldVal);

      if (newVal) {
        localStorage.setItem("accs", newVal);
        this.$accountsChanged();
        this.balanceOfPool_();
        this.balanceOfAirdrop_();
        this.getCollatorAddrs_();
        this.getDelegatorAddrs_();
        this.getAirdrop();
        this.getReward();
        this.Myredemption();
      }
    },
  },
  computed: {
    accs() {
      return this.$store.state.accs;
    },
  },
  methods: {
    handleClose(done) {
      //关闭我的赎回框
      this.$confirm("Confirm the shut down？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },
    async Myredemption() {
      try {
        let res = await redeemInfos();
        this.RedeemInfo.redeemNumber = res.redeemNumber;
        this.RedeemInfo.redeemAmount = res.redeemAmount;
        this.RedeemInfo.bflag = res.bflag;
      } catch (error) {
        console.log(error);
      }
    },
    async ConfirmRedeem() {
      //确认赎回
      try {
        let res = await executeRedeemStake();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    async getAllTotalVal() {
      //收集人和委托人租赁保证金比例（retToken）
      try {
        this.total.retTokenNum = await totalSupply();
        this.total.stkTokenNum = await totalSupplyPool();
        this.total.pendingRedeem = await getAllPendingRedeem();
        this.total.redeem = await pendingRedeem();
        let rGLMR = await balance();
        console.log(this.total.pendingRedeem, rGLMR);
        this.total.rent = rGLMR - this.total.redeem;
        this.balanceVal = rGLMR;
      } catch (e) {
        console.log(e);
      }
    },
    async getAirdrop() {
      try {
        let res = await getAirdropList();
        this.AirdropList.push(...res.transactions.nodes);
      } catch (error) {
        console.log(error);
      }
    },
    async getReward() {
      try {
        let res = await getRewardList();
        this.RewardList.push(...res.sendValues.nodes);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    async addSubmit() {
      console.log("增加租赁", this.mianNum.retTokenNum, this.retNum);
      if (parseFloat(this.mianNum.retTokenNum) < parseFloat(this.retNum)) {
        this.$message.error("RetToken is not enough!   ");
        return;
      }
      if (this.addType) {
        //创建委托人
        try {
          let res = await addDelegator(this.addPamars);
          for (let index in this.addPamars) {
            this.addPamars[index] = "";
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        //收集人
        try {
          let res = await addCollator(this.addPamars);
          for (let index in this.addPamars) {
            this.addPamars[index] = "";
          }
        } catch (error) {
          console.log(error);
        }
      }
      let popup = document.getElementsByClassName("popup");
      for (let i = 0; i < popup.length; i++) {
        popup[i].style.display = "none";
      }
      this.addType = null;
      this.retNum = this.day = "";
    },
    async dianji(res) {
      this.dialogVisible = true;
      console.log(res);
    },
    async balanceOfAirdrop_() {
      try {
        let res = await balanceOfAirdrop();
        this.mianNum.retTokenNum = res;
      } catch (error) {
        console.log(error);
      }
    },
    async balanceOfPool_() {
      try {
        let res = await balanceOf();
        this.mianNum.stkTokenNum = res;
      } catch (error) {
        console.log(error);
      }
    },

    async getRedeemTimeLimit_() {
      try {
        let res = await getRedeemTimeLimit();
        this.mianNum.rGLMR = res;
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    async createPerson() {
      console.log("创建租赁", this.mianNum.retTokenNum, this.retNum);

      if (parseFloat(this.mianNum.retTokenNum) < parseFloat(this.retNum)) {
        this.$message.error("RetToken is not enough!   ");
        return;
      }
      if (this.perType) {
        //创建收集人
        try {
          let res = await createCollator(this.pamars);
        } catch (error) {
          console.log(error);
        }
      } else {
        //创建合约委托人（水龙头
        try {
          let res = await createDelegator(this.pamars);
        } catch (error) {
          console.log(error);
        }
      }
      for (let index in this.pamars) {
        this.pamars[index] = "";
      }
      let popup = document.getElementsByClassName("popup");
      for (let i = 0; i < popup.length; i++) {
        popup[i].style.display = "none";
      }
      this.perType = this.retNum = this.day = null;
    },
    showAddPop(val, addType, item) {
      this.addType = addType; //0
      this.addPamars.collatorAddr = item;
      let popup_collator_bind = document.getElementById(val);
      popup_collator_bind.style.display = "block";
    },
    btnClick(val, perType) {
      //质押 赎回用
      let popup_collator_bind = document.getElementById(val);
      popup_collator_bind.style.display = "block";
    },
    creation(val, perType) {
      //创建委托人 收集人用
      this.perType = perType;
      let popup_collator_bind = document.getElementById(val);
      popup_collator_bind.style.display = "block";
    },
    closePop() {
      let popup = document.getElementsByClassName("popup");
      for (let i = 0; i < popup.length; i++) {
        popup[i].style.display = "none";
      }
      this.addType = this.perType = null;
      this.retNum = this.day = "";
      for (let index in this.pamars) {
        this.pamars[index] = "";
      }
      for (let index in this.addPamars) {
        this.addPamars[index] = "";
      }
    },
    async addStake() {
      try {
        let res = await addStake(this.amount);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
      let popup = document.getElementsByClassName("popup");
      for (let i = 0; i < popup.length; i++) {
        popup[i].style.display = "none";
      }
    },
    async scheduleRedeemStake_() {
      if (parseFloat(this.claimNum) > parseFloat(this.balanceVal)) {
        this.$message.error("Your amount exceeds pledge balance！");
        return;
      }
      try {
        let res = await scheduleRedeemStake(this.claimNum);
        console.log(res);
      } catch (error) {
        this.closePop();
        this.$message.error("Redeem error");
        console.log(error);
      }
      let popup = document.getElementsByClassName("popup");
      for (let i = 0; i < popup.length; i++) {
        popup[i].style.display = "none";
      }
      this.claimNum = "";
    },
    async getBalance() {
      try {
        let res = await getBalance();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    //委托人
    async getCollatorAddrs_() {
      try {
        let res = await getCollatorAddrs();
        this.tableData = res;
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    },
    //收集人
    async getDelegatorAddrs_() {
      try {
        let res = await getDelegatorAddrs();
        this.setData = res;
        console.log(this.tableData);
      } catch (error) {
        console.log(error);
      }
    },
    //更新NimbusId(收集人)
    //新增
    async insert() {
      let res = await addAssociation(this.sessIDValue);
      this.dialogVisible = false;
      this.getDelegatorAddrs();
      this.getCollatorAddrs();
    },
    //更新
    async update() {
      let res = await updateAssociation(this.sessIDValue);
      this.dialogVisible = false;
      this.getDelegatorAddrs();
      this.getCollatorAddrs();
    },
  },
  created() {
    this.web3 = new Web3(window.ethereum);
  },
  async mounted() {
    this.web3 = new Web3(window.ethereum);

    if (window.performance.navigation.type == 1) {
      //页面被刷新
      console.log("页面被刷新");
      localStorage.clear();
      this.$getAccounts();
      this.$accountsChanged();
      this.balanceOfPool_();
      this.balanceOfAirdrop_();
      this.getAllTotalVal();
      this.getCollatorAddrs_();
      this.getDelegatorAddrs_();
      this.Myredemption();
    }
    Promise.all([
      this.getRedeemTimeLimit_(),
      this.getAirdrop(),
      this.getReward(),
      this.getAllTotalVal(),
      this.Myredemption(),
    ]).then((res) => {
      console.log(res);
    });
  },
};
</script>

<style scoped>
.redeemBtn {
  /* width: 500px; */
}
.redeemBtn .but {
  width: auto;
  height: 37px;
  line-height: 37px;
  margin-top: 20px;
  clear: both;
  float: left;
  background: #063db4;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  font-size: 16px;
  color: #ffffff;
}
.but a {
  display: block;
  width: auto;
  height: 37px;
  padding: 0 20px;
  color: #ffffff;
  text-decoration: none;
}
.but a:hover {
  font-weight: bold;
}

.EMPTY {
  text-align: center;
  font-size: 30px;
  margin: 50px 0;
}
.addBtn_title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ltit > .addBtn_title > .txt_ {
  margin-right: 10px;
  height: 50px !important;
  line-height: 50px !important;
  text-align: center !important;
  background: url(../assets/image/but_bg.png) center no-repeat;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -webkit-border-radius: 5px;
  color: #fff !important;
}
</style>
