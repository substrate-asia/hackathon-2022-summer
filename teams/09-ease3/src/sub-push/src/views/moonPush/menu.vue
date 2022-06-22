<template>
  <div class="page">
    <div class="menu-list">
      <div class="item" v-for="(v, i) in menuList" :key="i">
        <div class="img-wrap">
          <img :src="v.image" alt="" />
        </div>
        <div class="title">{{ $utils.formatTriggerType(v.trigger_type) }}</div>
        <div class="text">{{ v.text }}</div>
        <div class="btn-wrap">
          <Button class="btn" @click="goToEdit(v)">
            <span class="text">Create your alert</span>
            <div class="icon"></div>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      menuList: [
        {
          image: require("@/assets/images/icon2.png"),
          trigger_type: "wallet_monitor",
          text: "Keep an eye on token transfer on any account",
        },
        {
          image: require("@/assets/images/icon1.png"),
          trigger_type: "gas",
          text: "Learn to budget and save every penny",
        },
        {
          image: require("@/assets/images/icon3.png"),
          trigger_type: "anyswap",
          text: "Keep an eye on any swap on any account",
        },
        {
          image: require("@/assets/images/icon4.png"),
          trigger_type: "dex",
          text: "Spy on any asset trade",
        },
      ],
    };
  },
  methods: {
    goToEdit(v) {
      this.$router.push({
        name: "moonPushEdit",
        query: {
          trigger_type: v.trigger_type,
        },
      });
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  height: calc(100vh - 80px);
  display: flex;
  justify-content: center;
  align-items: center;
  .menu-list {
    display: flex;
    .item {
      margin-right: 20px;
      padding: 0 24px;
      padding-top: 40px;
      padding-bottom: 40px;
      background: #21272a;
      border-radius: 20px;
      text-align: center;
      transition: all 0.3s;
      &:hover {
        transform: translateY(-15px);
      }
      &:last-child {
        margin-right: 0;
      }
      .img-wrap {
        margin: 0 -24px;
        margin-bottom: -40px;
        img {
          width: 303px;
          height: auto;
        }
      }
      .title {
        text-align: left;
        margin-bottom: 16px;
        font-weight: 700;
        font-size: 36px;
      }
      & > .text {
        height: 52px;
        text-align: left;
        line-height: 26px;
        width: 260px;
        font-size: 18px;
        margin-bottom: 40px;
      }
      .btn-wrap {
        text-align: left;
        .btn {
          padding: 4px 0;
          width: 227px;
          background-image: linear-gradient(to right, #21272a, #21272a),
            linear-gradient(90deg, #b3ffab, #12fff7);
          &:hover {
            &::after {
              background-image: radial-gradient(
                circle,
                black 10%,
                transparent 11%
              );
            }
            background: #3965ff;
            .icon {
              background: url(~@/assets/images/whiteArrow.png);
              background-size: contain;
            }
          }
          ::v-deep(.linear-btn-content) {
            display: flex;
            align-items: center;
            padding: 15px 28px;
          }
          .text {
            font-weight: 500;
            font-size: 18px;
          }
          .icon {
            margin-left: 16px;
            width: 8px;
            height: 13px;
            background: url(~@/assets/images/blueArrow.png);
            background-repeat: no-repeat;
            background-size: contain;
          }
        }
      }
    }
  }
}
</style>