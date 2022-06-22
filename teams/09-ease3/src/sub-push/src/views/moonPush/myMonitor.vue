<template>
  <div class="page">
    <div class="big-title">
      <span class="title-text"> My Monitor </span>
      <Button class="create" @click="create">Create</Button>
    </div>
    <div id="table-wrap">
      <el-table
        :data="tableData"
        style="width: 100%; background: transparent !important"
      >
        <template #empty>
          <div class="empty-wrap">
            <div class="img-wrap">
              <img src="@/assets/images/Frame_96.png" alt="" />
            </div>
            <div v-if="!loadingInstance" class="btn-wrap">
              <div class="btn" @click="goAdd">
                <span class="text"> Create my first alert </span>
                <icon-right class="arrow" />
              </div>
            </div>
          </div>
        </template>
        <el-table-column prop="date" label="Alert Name">
          <template #default="scope">
            <span class="green" @click="goEdit(scope.row)">{{
              scope.row.trigger.name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="Category" width="140">
          <template #default="scope">
            <span>{{
              $utils.formatTriggerType(scope.row.trigger.trigger_type)
            }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="Content" width="250" /> -->
        <el-table-column prop="trigger.chain" label="Chain" width="150" />
        <el-table-column prop="trigger.status" label="Status" width="120" />
        <el-table-column prop="name" label="Trigger" width="120">
          <template #default="scope">
            <div class="table-trigger-icon-wrap">
              <a-tooltip
                v-for="v in filterChannels(scope.row.notify_channels)"
                :key="v.channel_type"
                :content="getTriggerContent(v)"
              >
                <img class="icon" :src="getTriggerIcon(v.channel_type)" />
              </a-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="trigger.last_updated_time"
          label="Last edited"
          width="170"
        >
          <template #default="scope">
            <span>{{
              $moment(scope.row.trigger.last_updated_time).format(
                "YYYY-MM-DD HH:mm"
              )
            }}</span>
          </template>
        </el-table-column>
        <el-table-column align="right" width="110">
          <template #default="scope">
            <a-dropdown @select="handleSelect($event, scope.row)">
              <div class="dropdown-btn">
                <span> Manage </span>
                <icon-down />
              </div>
              <template #content>
                <a-doption
                  v-show="scope.row.trigger.status == 'Draft'"
                  value="Publish"
                  >Publish</a-doption
                >
                <a-doption
                  v-show="scope.row.trigger.status == 'Ongoing'"
                  value="Deactive"
                  >Deactive</a-doption
                >
                <a-doption value="Edit">Edit</a-doption>
                <a-doption value="Delete">Delete</a-doption>
              </template>
            </a-dropdown>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <a-modal
      modal-class="moon-push-confirm-modal"
      v-model:visible="visible"
      simple
      :footer="false"
    >
      <div class="title">
        Are you sure to delete current alert? It will be deactived and removed
        from app.
      </div>

      <div class="btn-wrap">
        <Button class="cancel" @click="visible = false">Cancel</Button>
        <Button class="done" type="primary" @click="sure">Sure</Button>
      </div>
    </a-modal>
    <a-modal
      modal-class="moon-push-confirm-modal"
      v-model:visible="publishConfirmVisible"
      simple
      :footer="false"
    >
      <div class="title">
        {{
          this.ifPublish
            ? "Are you sure to activate current alert?"
            : "Are you sure to deactive the current alert?"
        }}
        <br />
        {{
          this.ifPublish
            ? "You will get notified when this alert is triggered."
            : "After deactive you will not get notified for this alert."
        }}
      </div>

      <div class="btn-wrap">
        <Button class="cancel" @click="publishConfirmVisible = false"
          >Cancel</Button
        >
        <Button v-if="ifPublish" class="done" type="primary" @click="publish"
          >Sure</Button
        >
        <Button v-else class="done" type="primary" @click="deactive"
          >Sure</Button
        >
      </div>
    </a-modal>
  </div>
</template>

<script>
import { ElLoading } from "element-plus";
import {
  getMyTriggers,
  removeTrigger,
  publishTrigger,
  deactiveTrigger,
} from "@/api/moonPush";
import { Modal } from "@arco-design/web-vue";
export default {
  name: "myMonitor",
  data() {
    return {
      publishConfirmVisible: false,
      ifPublish: false,
      loadingInstance: null,
      visible: false,
      tableData: [],
      currentRow: {},
    };
  },
  created() {
    this.getList();
  },
  mounted() {},
  computed: {},
  methods: {
    filterChannels(arr) {
      return arr.filter((v) => v.enable);
    },
    create() {
      this.$router.push({
        name: "moonPushMenu",
      });
    },
    connectWalletSuccess() {
      this.getList();
    },
    getList() {
      this.$nextTick(() => {
        if (this.loadingInstance) {
          this.loadingInstance.close();
        }
        this.loadingInstance = ElLoading.service({
          target: "#table-wrap",
          fullscreen: false,
          background: "rgba(72, 75, 77, 0.8)",
        });
      });
      getMyTriggers().then((d) => {
        if (this.loadingInstance) {
          this.loadingInstance.close();
        }
        this.loadingInstance = null;
        this.tableData = d;
      });
    },
    getTriggerContent(channel) {
      const type = channel.channel_type;
      if (!type) {
        return "";
      }
      const result = type[0].toUpperCase() + type.slice(1);
      return result;
    },
    getTriggerIcon(channel) {
      switch (channel) {
        case "email":
          return require("@/assets/images/Vector21.svg");
        case "twitter":
          return require("@/assets/images/Vector22.svg");
        case "discord":
          return require("@/assets/images/Vector23.svg");
        case "telegram":
          return require("@/assets/images/Vector24.svg");
        case "slack":
          return require("@/assets/images/Vector25.svg");
        case "webhook":
          return require("@/assets/images/Vector26.svg");
      }
    },
    goAdd() {
      this.$router.push({
        name: "moonPushMenu",
      });
    },
    goEdit(row) {
      this.$router.push({
        name: "moonPushEdit",
        query: {
          trigger_type: row.trigger.trigger_type,
          id: row.trigger.id,
        },
      });
      localStorage.setItem("moonPushEditData", JSON.stringify(row));
    },
    publish() {
      publishTrigger({
        trigger_id: this.currentRow.trigger.id,
      }).then((d) => {
        this.publishConfirmVisible = false;
        this.$message.success("Publish Successful");
        this.getList();
      });
    },
    deactive() {
      deactiveTrigger({
        trigger_id: this.currentRow.trigger.id,
      }).then((d) => {
        this.publishConfirmVisible = false;
        this.$message.success("Deactive Successful");
        this.getList();
      });
    },
    handleSelect(type, row) {
      if (type == "Publish") {
        this.currentRow = row;
        this.ifPublish = true;
        this.publishConfirmVisible = true;
      } else if (type == "Deactive") {
        this.currentRow = row;
        this.ifPublish = false;
        this.publishConfirmVisible = true;
      }
      if (type == "Edit") {
        if (row.trigger.status == "Ongoing") {
          this.$message.error({
            content: "Please deactive first",
            duration: 5 * 1000,
          });
          return;
        } else {
          this.goEdit(row);
        }
      } else if (type == "Delete") {
        this.del(row);
      }
    },
    sure() {
      removeTrigger({
        trigger_id: this.currentRow.trigger.id,
        back_to_draft: false,
      }).then((d) => {
        this.getList();
        this.visible = false;
      });
    },
    del(row) {
      this.currentRow = row;
      this.visible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.page {
  .big-title {
    font-size: 50px;
    color: #ffffff;
    margin-top: 40px;
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .create {
      ::v-deep(.linear-btn-content) {
        padding: 10px 22px;
      }
    }
  }
  .dropdown-btn {
    cursor: pointer;
    display: inline-block;
    color: #3965FF;
    font-size: 16px;
  }
  .green {
    color: #3965FF;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  .empty-wrap {
    padding-top: 100px;
    background: transparent;
    .img-wrap {
      img {
        width: 264px;
        height: auto;
      }
    }
    .btn-wrap {
      .btn {
        & + .btn {
          margin-left: 10px;
        }
        display: inline-block;
        cursor: pointer;
        font-size: 16px;
        color: #ffffff;
        &:hover {
          opacity: 0.8;
        }
      }
    }
  }
  .table-trigger-icon-wrap {
    display: flex;
    align-items: center;
    .icon {
      height: 15px;
      width: auto;
      cursor: pointer;
      & + .icon {
        margin-left: 6px;
      }
    }
  }
}
</style>