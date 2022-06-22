<template>
  <div class="container">
    <div class="layout">
      <router-view />
    </div>
  </div>
</template>

<script>
import { h } from "vue";
import notifyHistoryApi from "@/api/notify-history";
import BigNumber from "bignumber.js";
export default {
  name: "layout",
  data() {
    return {
      enable_query_notify_history: true,
      query_notify_history_interval: 10000,
      notification_duration: 10000,
      last_history_time: new Date(),
    };
  },
  mounted() {
    let self = this;
    console.log("start timer");
    self.timer = setInterval(() => {
      self.getNotifyHistories();
    }, this.query_notify_history_interval);
  },
  destroyed() {
    let self = this;
    if (self.timer) {
      console.log("destroyed timer");
      clearInterval(self.timer);
    }
  },
  methods: {
    changeMenu(sv) {
      this.$router.push({
        name: sv.routeName,
      });
    },

    getNotifyHistories() {
      let self = this;

      let userData = localStorage.getItem("userData");
      if (!userData) {
        console.log("user not connect, ignore getNotifyHistories");
        return;
      }
      let params = {
        take: 1,
        last_history_time: self.last_history_time,
      };
      notifyHistoryApi.getNotifyHistories(params).then((resp) => {
        if (resp) {
          // console.log("getWebhookMessage:", resp);

          if (resp && resp.notify_histories) {
            for (const record of resp.notify_histories) {
              let notify = this.buildNotify(record);
              console.log(notify);
              this.$notification.info({
                ...notify,
                position: "bottomRight",
                duration: this.notification_duration,
                closable: true,
              });

              self.last_history_time = record.created_time;
            }
          }
        }
      });
    },
    buildNotify(resp) {
      let notify = {
        content: "",
        title: "",
      };
      if (resp) {
        notify.title = `${resp.trigger_type}`;

        let content = JSON.parse(resp.msg.content);
        let result = content.result;
        let htmlString = "";
        htmlString += `${resp.created_time}`;
        htmlString += `<br>`;
        htmlString += `${resp.source}`;
        for (const key in result) {
          if (Object.hasOwnProperty.call(result, key)) {
            const value = result[key];

            if (htmlString) {
              htmlString += `<br>`;
            }
            htmlString += `${key}:&nbsp;${value}`;
          }
        }

        notify.content = h("div", {
          innerHTML: `${htmlString}`,
        });
      }
      return notify;
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  // background: #121619;
  height: 100vh;
  overflow: auto;
  color: white;
}
</style>
<style>
.arco-notification {
  width: 400px;
}
</style>