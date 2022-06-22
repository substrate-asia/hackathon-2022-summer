<template>
  <div id="app wrap" class="wrapone">
    <div class="head">
      <div class="cot">
        <div class="logo">
          <img
            src="./assets/image/login.png"
            width="250"
            height="58"
            alt="StaFiDAO"
          />
        </div>

        <div class="nav">
          <el-button class="btn_" @click="linkMatemask"
            >CONNECT MetaMask</el-button
          >
          <div class="li">
            <router-link to="/">MAIN</router-link>
            <!-- <a href="./index.html">MAIN</a> -->
          </div>
          <div class="li">
            <router-link to="about">WHAT IS</router-link>
          </div>
          <!-- <a href="./about.html">WHAT IS</a></div> -->
          <div class="li">
            <!-- <a href="./governance.html">GOVERNANCE</a> -->
            <router-link to="governance">GOVERNANCE</router-link>
          </div>
          <!-- <div class="li"><a href="./docs.html">DOCS</a></div>
          <div class="li"><a href="./contact.html">CONTACT US</a></div> -->
        </div>
      </div>
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" class="sub" />
    <foot></foot>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header.vue";
import Foot from "@/components/Foot.vue";

export default {
  name: "Home",
  components: {
    Header,
    Foot,
  },
  methods: {
    linkMatemask() {
      this.$getAccounts();
    },
  },
  mounted() {
    let beginTime = 0; //开始时间
    let differTime = 0; //时间差
    window.onunload = function () {
      //这是关闭
      differTime = new Date().getTime() - beginTime;
      if (differTime <= 5) {
        localStorage.clear();
      } else {
        //这是刷新
      }
    };

    window.onbeforeunload = function () {
      beginTime = new Date().getTime();
    };
  },
  async beforeCreate() {
    (await ethereum.chainId) != "0x507" && this.$cutNetwork(); //切换网络
    console.log("beforeCreate");
  },
};
</script>

<style >
.wrapone {
  background: url(./assets/image/bg.jpg) top center no-repeat #f3f3f3;
}
.btn_ {
  margin-top: -50px !important;
  background-color: #ff5f00 !important;
  color: #fff !important;
  margin-left: 20px !important;
}
</style>
