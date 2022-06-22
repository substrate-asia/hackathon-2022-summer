<template>
  <div class="main">
    <div class="bg">
      <img class="bg-img" src="@/assets/images/bigBg.png" alt="" />
      <div class="big-text">
        Push the notifications<br />for your concerned data
      </div>
      <div class="small-text">
        A blockchain data listening and automation platform on Moonriver.
      </div>
    </div>
    <div class="btn-wrap">
      <Button class="push" @click="goMenu">Set push</Button>
    </div>
    
  </div>
</template>
 
<script>
export default {
  methods: {
    openLink(url) {
      window.open(url);
    },
    goMenu() {
      this.$router.push({
        name: "moonPushMenu",
      });
    },
  },
};
</script>

<style lang="less" scoped>
@media screen and (max-width: 1400px) {
  .main {
    margin-top: 6% !important;
  }
}
.main {
  margin-top: 15%;
  .bg {
    text-align: center;
    position: relative;
    .bg-img {
      width: 1091px;
      height: 630px;
      z-index: -1;
      position: absolute;
      top: -160px;
      left: 145px;
    }
    .big-text {
      display: inline-block;
      width: 941px;
      font-weight: 700;
      font-size: 80px;
    }
    .small-text {
      display: inline-block;
      margin-top: 29px;
      width: 670px;
      font-size: 32px;
      font-weight: 300;
    }
  }
  .btn-wrap {
    text-align: center;
    .push {
      margin-top: 140px;
      width: 489px;
      font-size: 24px;
    }
  }
  .page-footer {
    background: #121619;
    z-index: 2;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 17px 0;
    .layout {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .logo {
        display: flex;
        align-items: center;
        cursor: pointer;
        img {
          width: 40px;
          margin-top: -8px;
          margin-right: 11px;
        }
        span {
          background: linear-gradient(90deg, #b3ffab 0%, #12fff7 100%);
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 600;
          font-size: 25px;
        }
      }
      .f-right {
        color: #ffffff;
        display: flex;
        align-items: center;
        span {
          line-height: 16px;
          font-size: 16px;
        }
        .web3go {
          cursor: pointer;
          margin-left: 8px;
          height: 20px;
          width: auto;
          &:hover {
            opacity: 0.8;
          }
        }
        .split {
          margin: 0 16px;
          width: 1px;
          height: 14px;
          background: white;
        }
        .channel {
          cursor: pointer;
          height: 20px;
          width: auto;
          margin-left: 20px;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>