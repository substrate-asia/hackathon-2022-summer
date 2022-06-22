<template>
  <div class="header">
    <div class="logo" @click="$router.push({ name: 'moonPushHome' })">
      <img src="@/assets/images/newLogo.png" alt="" />
      <span class="medium">SubPush</span>
    </div>
    <Button v-if="!userData.address" class="connect" @click="connect"
      >Connect wallet</Button
    >
    <a-dropdown v-else @select="handleSelect">
      <div class="account-wrap">
        <div class="account-inner medium">
          <img :src="makeIcon4Ethereum(userData.address)" alt="" />
          <span>{{ $utils.shortAccount(userData.address) }}</span>
        </div>
      </div>
      <template #content>
        <div class="dropdown-content">
          <a-doption :value="1">
            <div class="icon-wrap">
              <img class="icon" src="@/assets/images/icon16.svg" alt="" />
            </div>
            <span class="text">Switch Wallet</span>
          </a-doption>
          <a-doption :value="2">
            <div class="icon-wrap">
              <img class="icon" src="@/assets/images/icon11.svg" alt="" />
            </div>
            <span class="text">My Monitor</span>
          </a-doption>
          <a-doption :value="3">
            <div class="icon-wrap">
              <img class="icon" src="@/assets/images/icon-person.svg" alt="" />
            </div>
            <span class="text">Disconnect</span>
          </a-doption>
        </div>
      </template>
    </a-dropdown>
  </div>
  <a-modal
    modal-class="moon-push-connect-wallet-modal"
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
      {{ ifConnect ? "Connect Wallet" : "Switch Wallet" }}
    </div>
    <div class="wallet-list-wrap">
      <div class="wallet-list">
        <div
          class="item"
          :class="{ active: userData.wallet == 'metamask' }"
          @click="connectMetaMask"
        >
          <img src="@/assets/images/Frame-2.svg" alt="" />
          <img class="icon" src="@/assets/images/image-10.svg" alt="" />
        </div>
        <div
          class="item disabled"
          :class="{ active: userData.wallet == 'polkadot.js' }"
        >
          <img src="@/assets/images/Frame_33.svg" alt="" />
          <!-- <img class="icon" src="@/assets/images/image-10-1.png" alt="" /> -->
        </div>
      </div>
    </div>
  </a-modal>
  <router-view v-slot="{ Component }">
    <component :is="Component" ref="routeComponent" />
  </router-view>
</template>
 
<script>
import { ref } from "vue";

import makeBlockie from "ethereum-blockies-base64";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import {
  getSupportedWallet,
  web3_nonce,
  web3_challenge,
  web3_sign_out,
} from "@/api/wallet";
import store from "@/store";
import myMonitor from "./myMonitor.vue";
export default {
  components: { myMonitor },
  data() {
    return {
      // 模态框是切换钱包还是连接钱包
      ifConnect: true,
      visible: false,
      domain: "",
      origin: "",
      provider: null,
      signer: null,
      connected_address: "",
      msg: "you are wanted to sign this message to validate the wallet address",
      signature: "",
      siweMessage: "",
      challenge_result: "",
    };
  },
  created() {},
  mounted() {
    this.domain = window.location.host;
    this.origin = window.location.origin;
    if (!window.ethereum) {
      return;
    }
    this.provider = new ethers.providers.Web3Provider(window.ethereum);
    this.signer = this.provider.getSigner();
  },
  computed: {
    userData() {
      return store.state.userData;
    },
  },
  methods: {
    makeIcon4Ethereum(address) {
      return makeBlockie(address);
    },
    handleSelect(value) {
      if (value == 1) {
        this.ifConnect = false;
        this.visible = true;
      } else if (value == 2) {
        this.$router.push({
          name: "moonPushMyMonitor",
        });
      } else if (value == 3) {
        this.disconnect();
      }
    },
    connect() {
      this.ifConnect = true;
      this.visible = true;
    },
    disconnect() {
      web3_sign_out()
        .then((d) => {
          localStorage.removeItem("userData");
          store.commit("changeUserData", {});
          this.$message.success("disconnected");
          this.$router.push({
            name: "moonPushHome",
          });
        })
        .catch((e) => {
          this.$message.success("disconnected");
          this.$router.push({
            name: "moonPushHome",
          });
        });
    },
    connectMetaMask() {
      if (this.userData.wallet == "metamask") {
        return;
      }
      this.connectWallet();
    },
    connectWallet() {
      let self = this;
      this.provider
        .send("eth_requestAccounts", [])
        .then((resp) => {
          console.log("connected,", resp);
          if (resp && resp.length > 0) {
            self.connected_address = resp[0];
          }
          this.signInWithEthereum();
        })
        .catch(() => console.log("user rejected request"));
    },
    async createSiweMessage(address, statement) {
      const res = await web3_nonce({
        identityNetwork: "ethereum",
        wallet: "metamask",
      });
      console.log("res:", res);
      let challenge = await res.challenge;
      let sign_id = await res.sign_id;
      console.log("challenge:", challenge);
      console.log("sign_id:", sign_id);
      const message = new SiweMessage({
        domain: this.domain,
        address: address,
        statement: statement,
        uri: this.origin,
        version: "1",
        chainId: "1",
        nonce: challenge,
        sign_id: sign_id,
      });
      let msg = message.prepareMessage();
      return { sign_id: sign_id, msg: msg };
    },
    async signInWithEthereum() {
      let self = this;
      if (!self.msg) {
        return;
      }
      let address = await self.signer.getAddress();
      console.log("address:", address);
      let msg = self.msg.trim();
      console.log("msg:", msg);
      const message = await self.createSiweMessage(address, msg);
      console.log("createSiweMessage:", message);
      let signature = await this.signer.signMessage(message.msg);
      self.siweMessage = message.msg;
      self.signature = signature;
      console.log(signature);
      const challenge_res = await web3_challenge({
        identityNetwork: "ethereum",
        wallet: "metamask",
        address: address,
        sign_id: message.sign_id,
        challenge: JSON.stringify(message),
        signature: signature,
      });
      let result = await challenge_res;
      console.log(result);
      store.commit("changeUserData", result);
      localStorage.setItem("userData", JSON.stringify(result));
      this.$message.success("connected");
      if (this.$refs.routeComponent.connectWalletSuccess) {
        this.$refs.routeComponent.connectWalletSuccess();
      }
      this.visible = false;
    },
  },
};
</script>

<style lang="less" scoped>
.header {
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .logo {
    display: flex;
    align-items: center;
    cursor: pointer;
    img {
      width: 40px;
      margin-right: 11px;
    }
    span {
      color: #3965ff;
      font-weight: 600;
      font-size: 32px;
    }
  }
  .connect {
  }
  .account-wrap {
    border: 1px solid #878d96;
    border-radius: 70px;
    padding: 7px;
    cursor: pointer;
    &:hover {
      border: 1px solid #88a8ff;
    }
    .account-inner {
      display: flex;
      align-items: center;
      img {
        border-radius: 50%;
        width: 32px;
        height: 32px;
        margin-right: 8px;
      }
      span {
        margin-right: 8px;
        color: #88a8ff;
        font-size: 14px;
      }
    }
  }
}
.dropdown-content {
  padding: 15px 0;
  ::v-deep(.arco-dropdown-option) {
    margin-bottom: 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  ::v-deep(.arco-dropdown-option-content) {
    height: 40px;
    display: flex;
    align-items: center;
    padding: 0 15px;
    .icon-wrap {
      width: 20px;
      margin-right: 14px;
      display: flex;
      align-items: center;
      .icon {
      }
    }
    .text {
      font-size: 16px;
    }
  }
}
</style>

<style lang="less">
.moon-push-connect-wallet-modal {
  background: white !important;
  border-radius: 20px;
  color: #ffffff;
  text-align: center;
  padding: 24px !important;
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
      background: #dde1e6;
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
    font-weight: 700;
    font-size: 34px;
    color: #121619;
  }
  .wallet-list-wrap {
    display: flex;
    justify-content: center;
    margin-top: 35px;
    margin-bottom: 30px;
    .wallet-list {
      width: 336px;
      .item {
        cursor: pointer;
        overflow: hidden;
        position: relative;
        &.active {
          border-radius: 100px;
          border: 3px solid transparent;
          background-clip: padding-box, border-box;
          background-origin: padding-box, border-box;
          background-image: linear-gradient(to right, transparent, transparent),
            linear-gradient(90deg, #b3ffab, #12fff7);
        }
        &.disabled {
          cursor: not-allowed;
        }
        &:not(.disabled):hover {
          box-shadow: 0px 40px 58px -20px #ffd8b5;
          .icon {
            transform: rotateZ(30deg);
          }
        }
        & + .item {
          margin-top: 20px;
        }
        img {
          display: block;
        }
        .icon {
          transition: all 0.2s;
          position: absolute;
          right: 18px;
          top: 0;
        }
      }
    }
  }
}
</style>