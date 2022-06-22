<template>
  <a-config-provider :locale="enUS">
    <router-view />
  </a-config-provider>
</template>
<script>
import enUS from "@arco-design/web-vue/es/locale/lang/en-us";
import { start_animation } from "@/utils/star-animation";
export default {
  data() {
    return {
      enUS,
    };
  },
  mounted() {
    setTimeout(() => {
      console.log("start_animation");
      start_animation("start_canvas");
    }, 10);
  },
};
</script>
<style>
.bg-animation {
  position: fixed;
  z-index: -1;
  width: 100vw;
}
#app {
}
</style>
