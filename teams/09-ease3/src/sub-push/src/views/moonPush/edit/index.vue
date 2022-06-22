<template>
  <div class="page">
    <div class="header">
      {{ $utils.formatTriggerType($route.query.trigger_type) }}
    </div>
    <TriggerParams
      ref="triggerParams"
      :form="form"
      :tokenList="tokenList"
      :pairData="pairData"
    />
    <Channels :switchList="switchList" :scriptTemplate="scriptTemplate" />
    <div class="footer">
      <Button class="cancel" @click="$router.back()">Return</Button>
      <Button class="save" v-if="canSave" @click="save">Save as Draft</Button>
      <Button class="alert" v-if="canSave" type="primary" @click="alert"
        >Start Alert</Button
      >
    </div>
    <a-modal
      modal-class="moon-push-edit-save-modal"
      v-model:visible="visible"
      simple
      :footer="false"
    >
      <div class="head">
        <div class="icon-wrap" @click="visible = false">
          <icon-close class="close" />
        </div>
      </div>
      <div class="title">
        {{ ifAlert ? "Name your Alert" : "Name your Draft" }}
      </div>
      <div class="input-wrap">
        <a-input
          v-model="form.alertName"
          :placeholder="
            ifAlert ? 'Wallet Monitor Alert' : 'Wallet Monitor Draft1'
          "
        />
      </div>
      <div class="btn-wrap">
        <Button class="cancel" @click="visible = false">Cancel</Button>
        <Button class="done" type="primary" @click="done">Done</Button>
      </div>
    </a-modal>
  </div>
</template>

<script>
import Channels from "./Channels";
import TriggerParams from "./TriggerParams";

import {
  getTriggerTypes,
  createTrigger,
  publishTrigger,
  getChains,
} from "@/api/moonPush";
export default {
  components: {
    Channels,
    TriggerParams,
  },
  data() {
    return {
      trigger_status: "Draft",

      trigger_type_data: {},

      chainList: [],
      tokenList: [],
      pairData: [],
      ifAlert: true,
      visible: false,
      preview: {},
      form: {
        dex: "SolarBeam",
        address: "",
        Predicate: ">=",
        mode: "",
        num: 0,
        token: "",
        alertName: "",
        chain: "",
        dex_pair_contract_address_name: "",
        watched_topic: "swap",
        watched_token_index: "",
      },
      switchList: [
        {
          name: "Email",
          icon: require("@/assets/images/Frame-63.png"),
          iconGray: require("@/assets/images/Frame-64.png"),
          iconRight: require("@/assets/images/green-icon1.svg"),
          checked: true,
          email: "",
          format_subject: "",
          format_content: "",
        },
        {
          name: "Telegram",
          icon: require("@/assets/images/Frame-69.png"),
          iconGray: require("@/assets/images/Frame-70.png"),
          iconRight: require("@/assets/images/green-icon4.svg"),
          checked: false,
          bot_token: "",
          chat_id: "",
          format_content: "",
        },
        {
          name: "Webhook",
          icon: require("@/assets/images/Frame-73.png"),
          iconGray: require("@/assets/images/Frame-74.png"),
          iconRight: require("@/assets/images/green-icon6.svg"),
          checked: false,
          webhookApi: "",
          format_content: "",
        },
        {
          name: "Twitter",
          icon: require("@/assets/images/Frame-65.png"),
          // iconGray: require("@/assets/images/Frame-66.png"),
          iconGray: require("@/assets/images/Frame-111.png"),
          iconRight: require("@/assets/images/green-icon2.svg"),
          checked: false,
          disabled: true,
          format_content: "",
        },
        {
          name: "Discord",
          icon: require("@/assets/images/Frame-67.png"),
          // iconGray: require("@/assets/images/Frame-68.png"),
          iconGray: require("@/assets/images/Frame-112.png"),
          iconRight: require("@/assets/images/green-icon3.svg"),
          checked: false,
          disabled: true,
          format_content: "",
        },

        {
          name: "Slack",
          icon: require("@/assets/images/Frame-71.png"),
          // iconGray: require("@/assets/images/Frame-72.png"),
          iconGray: require("@/assets/images/Frame-110.png"),
          iconRight: require("@/assets/images/green-icon5.svg"),
          checked: false,
          disabled: true,
          format_content: "",
        },
      ],
      initialSwitchList: [],
    };
  },
  created() {
    let self = this;
    this.initialSwitchList = JSON.parse(JSON.stringify(this.switchList));
    getTriggerTypes().then((d) => {
      const find = d.find(
        (v) => v.trigger_type == this.$route.query.trigger_type
      );
      self.trigger_type_data = find;
      if (this.$route.query.trigger_type !== "dex") {
        this.tokenList = find.tokens;
        this.form.token = find.tokens[0].symbol;
      } else {
        this.pairData = find.pairs;
      }
      if (this.$route.query.trigger_type == "wallet_monitor") {
        this.form.mode = "send";
      } else if (this.$route.query.trigger_type == "anyswap") {
        this.form.mode = "swapin";
      }
      if (this.$route.query.id) {
        this.getDetailData();
      }
    });
    getChains().then((d) => {
      this.chainList = d;
      this.form.chain = d[0].chain;
    });
  },
  computed: {
    canSave() {
      return this.trigger_status === "Draft";
    },
    tokenData() {
      const find = this.tokenList.find((v) => v.symbol == this.form.token);
      if (!find) {
        return {};
      }
      return find;
    },

    scriptTemplate() {
      let self = this;
      if (
        self.trigger_type_data &&
        self.trigger_type_data.script_templates &&
        self.trigger_type_data.script_templates.length > 0
      ) {
        return self.trigger_type_data.script_templates[0];
      }
      return {};
    },
  },
  methods: {
    getDetailData() {
      const dataStr = localStorage.getItem("moonPushEditData");
      if (!dataStr) {
        return;
      }
      const data = JSON.parse(dataStr);
      console.log("get moonPushEditData from localStorage:", data);
      this.trigger_status = data.trigger.status || "Draft";

      const params = JSON.parse(data.trigger_parameter.parameter);
      this.form.address = params.address;
      this.form.Predicate = params.compare;
      this.form.mode = params.direction;

      this.form.num = this.$utils.backDecimals(
        params.amount_threshold,
        this.$route.query.trigger_type == "dex"
          ? params[`token${params.watched_token_index}_decimals`]
          : params.decimals
      );
      this.form.token = params.symbol;
      this.form.alertName = data.trigger.name;
      this.form.dex_pair_contract_address_name =
        params.dex_pair_contract_address_name;
      this.form.watched_topic = params.watched_topic;
      this.form.watched_token_index = params.watched_token_index;
      data.notify_channels.forEach((v) => {
        if (v.channel_type == "email") {
          const target = JSON.parse(v.target);
          this.switchList[0].id = v.id;
          this.switchList[0].checked = v.enable;
          this.switchList[0].email = target.email;
          this.switchList[0].format_subject = target.format_subject;
          this.switchList[0].format_content = target.format_content;
        } else if (v.channel_type == "telegram") {
          const target = JSON.parse(v.target);
          this.switchList[1].id = v.id;
          this.switchList[1].checked = v.enable;
          this.switchList[1].bot_token = target.bot_token;
          this.switchList[1].chat_id = target.chat_id;
          this.switchList[1].format_content = target.format_content;
        } else if (v.channel_type == "webhook") {
          const target = JSON.parse(v.target);
          this.switchList[2].id = v.id;
          this.switchList[2].checked = v.enable;
          this.switchList[2].webhookApi = target.api;
          this.switchList[2].format_content = target.format_content;
        }
      });
    },
    done() {
      let trigger_parameter;
      if (this.$route.query.trigger_type == "wallet_monitor") {
        trigger_parameter = {
          symbol: this.tokenData.symbol,
          decimals: this.tokenData.decimals,
          amount_threshold: this.$utils.toDecimals(
            this.form.num,
            this.tokenData.decimals
          ),
          compare: this.form.Predicate, // >=   or  <=
          direction: this.form.mode,
          address: this.form.address,
        };
      } else if (this.$route.query.trigger_type == "gas") {
        trigger_parameter = {
          symbol: this.tokenData.symbol,
          decimals: this.tokenData.decimals,
          amount_threshold: this.$utils.toDecimals(
            this.form.num,
            this.tokenData.decimals
          ),
          compare: this.form.Predicate, // >=   or  <=
        };
      } else if (this.$route.query.trigger_type == "anyswap") {
        trigger_parameter = {
          contract_address_name: this.tokenData.contract_address_name,
          contract_address: this.tokenData.contract_address,
          symbol: this.tokenData.symbol,
          decimals: this.tokenData.decimals,
          amount_threshold: this.$utils.toDecimals(
            this.form.num,
            this.tokenData.decimals
          ),
          compare: this.form.Predicate, // >=   or  <=
          direction: this.form.mode,
          address: this.form.address,
        };
      } else if (this.$route.query.trigger_type == "dex") {
        const currentPair = this.$refs.triggerParams.currentPair;
        trigger_parameter = {
          dex_pair_contract_address_name:
            currentPair.dex_pair_contract_address_name,
          dex_pair_contract_address: currentPair.dex_pair_contract_address,
          watched_topic: this.form.watched_topic,
          watched_token_index: this.form.watched_token_index,
          amount_threshold: this.$utils.toDecimals(
            this.form.num,
            currentPair[`token${this.form.watched_token_index}_decimals`]
          ),
          compare: this.form.Predicate,
          token0_decimals: currentPair.token0_decimals,
          token0_symbol: currentPair.token0_symbol,
          token1_decimals: currentPair.token1_decimals,
          token1_symbol: currentPair.token1_symbol,
        };
      }
      const notify_channels = this.getNotifyChannels();
      const params = {
        id: this.$route.query.id || undefined,
        name: this.form.alertName,
        trigger_type: this.$route.query.trigger_type,
        script_template_id: this.scriptTemplate.id,
        chain: "moonriver",
        trigger_parameter,
        notify_channels: notify_channels,
        publish_at_once: this.ifAlert ? true : false,
      };
      createTrigger(params).then((d) => {
        this.$message.success(
          `Successful! Alert ${this.$route.query.id ? "Changed" : "Created"}`
        );
        this.$router.push({
          name: "moonPushMyMonitor",
        });
        this.visible = false;
      });
    },
    getNotifyChannels() {
      const arr = [];
      this.switchList.forEach((v, i) => {
        if (JSON.stringify(v) == JSON.stringify(this.initialSwitchList[i])) {
          return;
        }
        if (v.name == "Email") {
          arr.push({
            id: v.id,
            enable: v.checked,
            channel_type: "email",
            target: {
              email: v.email,
              format_subject: v.format_subject,
              format_content: v.format_content,
            },
          });
        } else if (v.name == "Telegram") {
          arr.push({
            id: v.id,
            enable: v.checked,
            channel_type: "telegram",
            target: {
              bot_token: v.bot_token,
              chat_id: v.chat_id,
              parse_mode: "HTML",
              format_content: v.format_content,
            },
          });
        } else if (v.name == "Webhook") {
          arr.push({
            id: v.id,
            enable: v.checked,
            channel_type: "webhook",
            target: {
              api: v.webhookApi,
              format_content: v.format_content,
            },
          });
        }
      });
      return arr;
    },
    save() {
      this.ifAlert = false;
      if (!this.$route.query.id) {
        this.form.alertName =
          this.$utils.formatTriggerType(this.$route.query.trigger_type) +
          "_" +
          this.$moment().format("YYYY-MM-DD");
      }
      this.visible = true;
    },
    alert() {
      this.ifAlert = true;
      if (!this.$route.query.id) {
        this.form.alertName =
          this.$utils.formatTriggerType(this.$route.query.trigger_type) +
          "_" +
          this.$moment().format("YYYY-MM-DD");
      }
      this.visible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  padding-bottom: 90px;
  .header {
    margin-top: 40px;
    font-size: 50px;
    margin-bottom: 25px;
  }
  .footer {
    z-index: 4;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #21272a;
    box-shadow: 0px -40px 58px -20px rgba(0, 0, 0, 0.8);
    .cancel {
      width: 140px;
      height: 46px;
    }
    .save {
      margin-left: 16px;
      width: 140px;
      height: 46px;
    }
    .alert {
      margin-left: 16px;
      width: 140px;
      height: 46px;
    }
  }
}
</style>
<style lang="less">
.moon-push-edit-save-modal {
  background: #121619 !important;
  border-radius: 20px;
  color: #ffffff;
  text-align: center;
  padding: 24px !important;
  padding-bottom: 50px !important;
  .arco-modal-header {
    display: none;
  }
  .head {
    display: flex;
    justify-content: flex-end;
    .icon-wrap {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #343a3f;
      cursor: pointer;
      &:hover {
        opacity: 0.8;
      }
      .close {
        font-size: 14px;
        color: white;
      }
    }
  }
  .title {
    margin-top: 8px;
    margin-bottom: 20px;
    font-size: 24px;
    color: #ffffff;
  }
  .input-wrap {
    .arco-input {
      font-size: 16px;
    }
  }
  .btn-wrap {
    margin-top: 28px;
    .cancel,
    .done {
      width: 97px;
      height: 32px;
      .linear-btn-content {
        padding: 5px 0;
      }
    }
    .cancel {
      margin-right: 12px;
    }
  }
}
</style>