<template>
  <div class="info">
    <div class="info-title">Let Me Know Through</div>
    <div class="info-content">
      <div class="switch-wrap">
        <div
          class="item"
          v-for="(v, i) in switchList"
          :key="i"
          :class="{ active: currentTab.name == v.name, disabled: v.disabled }"
          @click="clickTab(v)"
        >
          <div class="circle">
            <img class="icon" :src="v.checked ? v.icon : v.iconGray" alt="" />
          </div>
          <div class="text">{{ v.name }}</div>
          <a-switch
            :disabled="v.disabled"
            v-model="v.checked"
            class="switch"
            @click.stop
          />
        </div>
      </div>
      <div class="gray-bg email" v-if="currentTab.name == 'Email'">
        <div class="bottom">
          <div class="btn" @click="jumpToHelp">How to use</div>
        </div>
        <div class="gray-form-item">
          <div class="label">From</div>
          <div class="value text">info@web3go.xyz</div>
        </div>
        <div class="gray-form-item">
          <div class="label">To</div>
          <div class="value">
            <a-input
              :disabled="!switchList[0].checked"
              v-model="switchList[0].email"
            />
          </div>
        </div>
        <div class="gray-form-item">
          <div class="label">Subject</div>
          <div class="value">
            <a-textarea
              :disabled="!switchList[0].checked"
              v-model="switchList[0].format_subject"
              class="textarea"
              auto-size
            />
          </div>
        </div>
        <div class="gray-form-item">
          <div class="label">Content</div>
          <div class="value">
            <message-format-editor
              :config="switchList[0]"
              :scriptTemplate="scriptTemplate"
            />
          </div>
        </div>
      </div>
      <div class="gray-bg telegram" v-else-if="currentTab.name == 'Telegram'">
        <div class="bottom">
          <div class="btn">How to use</div>
        </div>
        <div class="gray-form-item">
          <div class="label">BOT Token</div>
          <div class="value">
            <a-textarea
              :disabled="!switchList[1].checked"
              v-model="switchList[1].bot_token"
              class="textarea"
              auto-size
            />
          </div>
        </div>
        <div class="gray-form-item">
          <div class="label">Chat ID</div>
          <div class="value">
            <a-input
              :disabled="!switchList[1].checked"
              v-model="switchList[1].chat_id"
            />
          </div>
        </div>
        <div class="gray-form-item">
          <div class="label">Message</div>
          <div class="value">
            <message-format-editor
              :config="switchList[1]"
              :scriptTemplate="scriptTemplate"
            />
          </div>
        </div>
      </div>
      <div class="gray-bg webhook" v-else-if="currentTab.name == 'Webhook'">
        <div class="bottom">
          <div class="btn">How to use</div>
        </div>
        <div class="gray-form-item">
          <div class="label">API</div>
          <div class="value">
            <a-textarea
              :disabled="!switchList[2].checked"
              @input="refreshPreview"
              v-model="switchList[2].webhookApi"
              class="textarea"
              auto-size
            />
          </div>
        </div>
        <div class="gray-form-item">
          <div class="label">Message</div>
          <div class="value">
            <message-format-editor
              :config="switchList[2]"
              :scriptTemplate="scriptTemplate"
            />
          </div>
        </div>
      </div>

      <div class="gray-bg" v-else>
        <div class="bottom">
          <div class="btn">How to use</div>
        </div>
        <div class="gray-form-item">
          <div class="label">From</div>
          <div class="value text">guoyy814@hotmail.com</div>
        </div>
        <div class="gray-form-item">
          <div class="label">To</div>
          <div class="value">
            <a-input />
          </div>
        </div>
        <div class="gray-form-item">
          <div class="label">Subject</div>
          <div class="value">
            <a-textarea class="textarea" auto-size />
          </div>
        </div>
        <div class="gray-form-item">
          <div class="label">Content</div>
          <div class="value">
            <a-textarea class="textarea" auto-size />
          </div>
        </div>
      </div>
      <div class="white-bg email" v-if="currentTab.name == 'Email'">
        <div class="box">
          <div class="icon-wrap">
            <img class="left-icon" src="@/assets/images/sound.svg" alt="" />
            <img class="arrow" src="@/assets/images/arrow2.png" alt="" />
            <img class="right-icon" :src="currentTab.iconRight" alt="" />
          </div>
          <div class="result">
            <div class="r-title">
              {{ switchList[0].format_subject }}
            </div>
            <div class="r-content">
              <img
                class="headicon"
                src="@/assets/images/Frame-104.png"
                alt=""
              />
              <div class="right-main">
                <div class="row">
                  <span class="email">info@web3go.xyz</span>
                  <span class="time">{{ this.time }}</span>
                </div>
                <div class="to">to {{ switchList[0].email }}</div>
                <div class="message">
                  {{ switchList[0].format_content }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-bg">
          <img src="@/assets/images/MaskGroup.png" alt="" />
        </div>
      </div>
      <div class="white-bg telegram" v-else-if="currentTab.name == 'Telegram'">
        <div class="box">
          <div class="icon-wrap">
            <img class="left-icon" src="@/assets/images/sound.svg" alt="" />
            <img class="arrow" src="@/assets/images/arrow2.png" alt="" />
            <img class="right-icon" :src="currentTab.iconRight" alt="" />
          </div>
          <div class="result">
            <div class="r-content">
              <img
                class="headicon"
                src="@/assets/images/Frame-104.png"
                alt=""
              />
              <div class="right-main">
                <div class="row">
                  <span class="email">{{ switchList[1].bot_token }}</span>
                  <span class="time">{{ this.time }}</span>
                </div>
                <div class="to">to {{ switchList[1].chat_id }}</div>
                <div class="message">
                  {{ switchList[1].format_content }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bottom-bg">
          <img src="@/assets/images/MaskGroup.png" alt="" />
        </div>
      </div>
      <div class="white-bg webhook" v-else-if="currentTab.name == 'Webhook'">
        <div class="box">
          <div class="icon-wrap">
            <img class="left-icon" src="@/assets/images/sound.svg" alt="" />
            <img class="arrow" src="@/assets/images/arrow2.png" alt="" />
            <img class="right-icon" :src="currentTab.iconRight" alt="" />
          </div>
          <div class="result">
            <a-textarea
              :default-value="webhookSamplePreview()"
              readonly
              class="textarea"
            />
          </div>
        </div>
        <div class="bottom-bg">
          <img src="@/assets/images/MaskGroup.png" alt="" />
        </div>
      </div>
      <div class="white-bg" v-else>
        <div class="box">
          <div class="icon-wrap">
            <img class="left-icon" src="@/assets/images/sound.svg" alt="" />
            <img class="arrow" src="@/assets/images/arrow2.png" alt="" />
            <img class="right-icon" :src="currentTab.iconRight" alt="" />
          </div>
          <div class="result"></div>
        </div>
        <div class="bottom-bg">
          <img src="@/assets/images/MaskGroup.png" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MessageFormatEditor from "./MessageFormatEditor";

export default {
  props: ["switchList", "scriptTemplate"],
  components: {
    MessageFormatEditor,
  },
  data() {
    return {
      timer: null,
      time: null,
      currentTab: {},
    };
  },
  computed: {},
  created() {
    this.time = this.$moment().format("ddd, MMM D, hh:mm A");
    this.timer = setInterval(() => {
      this.time = this.$moment().format("ddd, MMM D, hh:mm A");
    }, 10000);
    this.currentTab = this.switchList[0];
  },
  beforeUnmount() {
    clearInterval(this.timer);
  },
  methods: {
    jumpToHelp() {
      window.open("https://doc.web3go.xyz/");
    },
    clickTab(v) {
      if (v.disabled) {
        return;
      }
      this.currentTab = v;
    },
    webhookSamplePreview() {
      let obj;
      if (this.$route.query.trigger_type == "wallet_monitor") {
        obj = {
          timestamp: "2022-04-20T02:44:06.002Z",
          source: "[moonriver] Demo Wallet 1",
          msg: {
            timestamp: "2022-04-20T02:44:04.075Z",
            notify_channels: [
              {
                channel_type: "webhook",
                target: "http://16.163.5.216:40000/api/v1/webhook",
              },
            ],
            trigger_info: {
              name: "Demo Wallet 1",
              trigger_type: "wallet_monitor",
              chain: "moonriver",
            },
            data: {
              matched: true,
              result: {
                chain: "Moonbeam",
                blockNumber: 1697673,
                timestamp: "2022-04-12T02:16:18.472Z",
                from: "0x03aea3108203781407b1d9b8f85b9a3ab8d39483",
                to: "0xd57e28773c92e6fb9d9fb164889886cd360074be",
                direction: "transfer-out",
                amount: 15000000000000000,
                tx: "0x39485532318a6bf18c8ecbd5e68d7b2badde9e65f31a98186562f95b1f1ce99a",
              },
            },
          },
        };
      } else if (this.$route.query.trigger_type == "gas") {
        obj = {
          timestamp: "2022-04-20T02:45:26.002Z",
          source: "[moonriver] gas > 0.05 MOVR",
          msg: {
            timestamp: "2022-04-20T02:45:24.006Z",
            notify_channels: [
              {
                channel_type: "webhook",
                target: "http://16.163.5.216:40000/api/v1/webhook",
              },
            ],
            trigger_info: {
              name: "gas > 0.05 MOVR",
              trigger_type: "gas",
              chain: "moonriver",
            },
            data: {
              matched: true,
              result: {
                blockNumber: 1697678,
                timestamp: "2022-04-12T02:18:30.536Z",
                fees: 51809311217275656,
              },
            },
          },
        };
      } else if (this.$route.query.trigger_type == "anyswap") {
        obj = {
          timestamp: "2022-04-20T03:20:00.002Z",
          source: "[moonriver] anyswap-usdc-swapin > 1",
          msg: {
            timestamp: "2022-04-20T03:19:58.170Z",
            notify_channels: [
              {
                channel_type: "webhook",
                target: "http://16.163.5.216:40000/api/v1/webhook",
              },
            ],
            trigger_info: {
              name: "anyswap-usdc-swapin > 1",
              trigger_type: "anyswap",
              chain: "moonriver",
            },
            data: {
              matched: true,
              result: {
                chain: "Moonbeam",
                blockNumber: 1724402,
                timestamp: "2022-04-20T00:58:00.474Z",
                address: "0x685ad774d18d86094d73c1f1cc2ce906f6a79a7a",
                symbol: "USDC",
                contract_address: "0xe3f5a90f9cb311505cd691a46596599aa1a0ad7d",
                direction: "swapin",
                amount: 5000000000,
                tx: "0x2c6a16765468a9eb30c31a6f54e248d9f8ee1fa466d6d466d676905b34fc3d92",
              },
            },
          },
        };
      } else if (this.$route.query.trigger_type == "dex") {
        obj = {
          timestamp: "2022-04-20T03:20:00.002Z",
          source: "[moonriver] dex-solarbeam-WMOVR-MFAM-test MFAM>1000",
          msg: {
            timestamp: "2022-04-20T03:19:58.170Z",
            notify_channels: [
              {
                channel_type: "webhook",
                target: "http://16.163.5.216:40000/api/v1/webhook",
              },
            ],
            trigger_info: {
              name: "dex-solarbeam-WMOVR-MFAM-test MFAM>1000",
              trigger_type: "dex",
              chain: "moonriver",
            },
            data: {
              matched: true,
              result: {
                chain: "Moonbeam",
                blockNumber: 1751782,
                timestamp: "2022-04-27T09:30:48.303Z",
                dex_pair_contract_address_name: "WMOVR-MFAM",
                dex_pair_contract_address:
                  "0xe6bfc609a2e58530310d6964ccdd236fc93b4adb",
                topic: "swap",
                topic_hash:
                  "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822",
                token0_value_formatted: 20.597926346255313,
                token0_symbol: "WMOVR",
                token0_decimals: "18",
                token1_value_formatted: 38929.40488763088,
                token1_symbol: "MFAM",
                token1_decimals: "18",
                from_address: "0xd220d187d5cc56ef262fb02f381a06a7bc69f3ee",
                tx: "0x356903512e95ac9b8f728c7010661ee1d6da7ecdf6dd731adc253fecb8148feb",
              },
            },
          },
        };
      }
      return JSON.stringify(obj, null, 2);
    },
  },
};
</script>

<style lang="less" scoped>
.info {
  margin-top: 32px;
  .info-title {
    font-size: 16px;
    color: #878d96;
    margin-bottom: 8px;
  }
  .info-content {
    display: flex;
    .switch-wrap {
      background: #21272a;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      padding: 23px 0 23px 30px;
      .item {
        cursor: pointer;
        padding: 5px 14px 5px 6px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        &.disabled {
          cursor: not-allowed;
        }
        &:last-child {
          margin-bottom: 0;
        }
        &.active {
          background: #343a3f;
          border-radius: 40px 0px 0px 40px;
        }
        .circle {
          width: 40px;
          height: 40px;
          line-height: 40px;
          border-radius: 50%;
          text-align: center;
          background: linear-gradient(90deg, #b3ffab 0%, #12fff7 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          .icon {
            width: 40px;
            height: 40px;
          }
        }
        .text {
          margin-left: 8px;
          display: inline-block;
          width: 84px;
          font-size: 16px;
        }
        .switch {
          transform: scale(1.2);
          width: 47px;
        }
      }
    }
    .gray-bg {
      padding: 20px 24px;
      width: 567px;
      background: #343a3f;
      border-radius: 0px 20px 20px 0px;
      position: relative;
      padding-bottom: 60px;
      &.telegram {
        .gray-form-item {
          .label {
            width: 85px;
          }
        }
      }
      &.webhook {
        .gray-form-item {
          .label {
            width: 85px;
          }
          .value {
            min-height: 46px;
            flex: 1;
            ::v-deep(.arco-textarea) {
              min-height: 150px;
            }
          }
        }
      }
      .bottom {
        position: absolute;
        left: 22px;
        bottom: 20px;
        .btn {
          box-sizing: border-box;
          cursor: pointer;
          width: 96px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border: 1px solid #e0e5f2;
          border-radius: 70px;
          &:hover {
            opacity: 0.8;
          }
        }
      }
      .gray-form-item {
        margin-bottom: 24px;
        &:last-child {
          margin-bottom: 0;
        }
        display: flex;
        .label {
          font-weight: 500;
          margin-right: 20px;
          text-align: right;
          line-height: 46px;
          font-size: 16px;
          color: #878d96;
          flex: none;
          width: 58px;
        }
        .value {
          min-height: 46px;
          flex: 1;
          &.text {
            line-height: 46px;
          }
          .textarea {
            ::v-deep(textarea) {
              min-height: 76px;
            }
          }
        }
      }
    }
    .white-bg {
      margin-bottom: -10px;
      margin-left: 20px;
      width: 456px;
      &.email {
        .result {
          padding: 24px;
          .r-title {
            word-break: break-all;
            margin-top: 15px;
            padding-left: 53px;
            font-size: 16px;
          }
          .r-content {
            margin-top: 20px;
            display: flex;
            .headicon {
              padding-top: 5px;
              flex: none;
              width: 32px;
              height: 32px;
              margin-right: 12px;
            }
            .right-main {
              flex: 1;
              .row {
                margin-top: 5px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                .email {
                  word-break: break-all;
                  width: 150px;
                  flex: 1;
                  font-size: 14px;
                }
                .time {
                  line-height: 16px;
                  flex: none;
                  width: 130px;
                  text-align: right;
                  font-size: 12px;
                }
              }
              .to {
                margin-top: 5px;
                font-size: 12px;
              }
              .message {
                margin-top: 15px;
                word-break: break-all;
                font-size: 12px;
              }
            }
          }
        }
      }
      &.telegram {
        .result {
          padding: 24px;
          .r-title {
            word-break: break-all;
            margin-top: 15px;
            padding-left: 53px;
            font-size: 16px;
          }
          .r-content {
            margin-top: 20px;
            display: flex;
            .headicon {
              padding-top: 5px;
              flex: none;
              width: 32px;
              height: 32px;
              margin-right: 12px;
            }
            .right-main {
              flex: 1;
              .row {
                margin-top: 5px;
                display: flex;
                justify-content: space-between;
                .email {
                  word-break: break-all;
                  width: 150px;
                  flex: 1;
                  font-size: 14px;
                }
                .time {
                  line-height: 16px;
                  flex: none;
                  width: 130px;
                  text-align: right;
                  font-size: 12px;
                }
              }
              .to {
                margin-top: 5px;
                font-size: 12px;
              }
              .message {
                margin-top: 15px;
                word-break: break-all;
                font-size: 12px;
              }
            }
          }
        }
      }
      &.webhook {
        .box {
          background: #343a3f;
          box-shadow: 0px 40px 58px -20px rgba(0, 0, 0, 0.4);
          .result {
            .textarea {
              display: block;
              font-size: 12px;
              border: 0;
              ::v-deep(.arco-textarea) {
                height: 265px;
                resize: none;
                line-height: 17px !important;
                font-size: 12px !important;
              }
            }
          }
        }
      }
      .box {
        background: #343a3f;
        box-shadow: 0px 40px 58px -20px rgba(0, 0, 0, 0.4);
        border-radius: 20px;
        padding-top: 30px;
        padding-bottom: 27px;
        .result {
          min-height: 215px;
          margin: 24px;
          margin-bottom: 0;
          background: #21272a;
          border-radius: 10px;
          color: white;
        }
      }
      .icon-wrap {
        display: flex;
        justify-content: center;
        align-items: center;

        .arrow {
          width: 26px;
          height: auto;
          padding: 0 13px;
        }
      }
      .bottom-bg {
        height: 22px;
        overflow: hidden;
        img {
          width: 100%;
          height: auto;
        }
      }
    }
  }
}
</style>