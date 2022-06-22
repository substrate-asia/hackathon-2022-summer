<template>
  <div class="message-format-editor">
    <div
      class="view"
      @click="enterEdit"
      v-if="viewOnly"
      v-html="beauty_format_content"
    ></div>
    <div class="edit" v-if="!viewOnly">
      <div class="edit-area">
        <a-textarea
          @blur="exitEdit"
          :disabled="!config.checked"
          v-model="config.format_content"
          class="textarea"
          auto-size
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MessageFormatEditor",
  props: ["config", "scriptTemplate"],

  data() {
    return {
      viewOnly: true,
    };
  },
  computed: {
    defaultFormatContent() {
      if (this.scriptTemplate && this.scriptTemplate.default_format_content) {
        return this.scriptTemplate.default_format_content;
      }
      return "";
    },

    beauty_format_content() {
      if (!this.config.format_content) {
        return "";
      }

      let format_content = this.config.format_content;
      console.log("format_content", format_content);
      let reg = /\$\{([0-9a-zA-Z_]*)\}/g;
      let variables = format_content.match(reg);
      console.log("variables", variables);
      if (variables) {
        for (const variable of variables) {
          let format = `<span class="variable-display">${variable
            .replace("${", "")
            .replace("}", "")}</span>`;
          format_content = format_content.replace(variable, format);
        }
      }
      console.log("beauty_format_content", format_content);
      return format_content;
    },
  },
  watch: {
    scriptTemplate(newValue, oldValue) {
      this.setDefault();
    },
  },
  created() {
    // console.log("MessageFormatEditor created:", this.config);
    this.setDefault();
  },

  methods: {
    setDefault() {
      if (!this.config.format_content) {
        //  console.log('defaultFormatContent:',this.defaultFormatContent);
        setTimeout(() => {
          this.config.format_content = this.defaultFormatContent;
        }, 100);
      }
    },
    enterEdit() {
      if (this.config.checked) {
        this.viewOnly = false;
      }
    },
    exitEdit() {
      this.viewOnly = true;
    },
  },
};
</script>
<style lang="less" scoped>
.message-format-editor {
  .view {
    padding: 5px 5px;
    border: solid 1px #21272a;
    padding: 15px 10px;
    border-radius: 9px;
    cursor: pointer;
  }

  .edit {
    .edit-area {
      position: relative;
    }
  }
}
</style>
<style lang="less">
.message-format-editor {
  .view {
    .variable-display {
      display: inline-block;
      margin: 2px 3px;
      padding: 2px 4px;
      border-radius: 3px;
      background: rgb(107, 109, 109);
    }
  }
}
</style>