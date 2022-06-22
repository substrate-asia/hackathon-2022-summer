import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ECharts from 'vue-echarts'
import "echarts";
import '@arco-design/web-vue/es/index.less';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import Button from '@/components/Button'
import '@/assets/font/font.css';
import '@/assets/css/index.less';
import 'element-plus/es/components/table/style/css'
import 'element-plus/es/components/table-column/style/css'
import { ElTable, ElTableColumn } from 'element-plus'
import moment from 'moment';
import * as utils from '@/utils'

document.body.setAttribute('arco-theme', 'dark');

// 获取保存的用户信息
const savedUserDataStr = localStorage.getItem('userData');
if (savedUserDataStr) {
    const savedUserData = JSON.parse(savedUserDataStr);
    store.commit('changeUserData', savedUserData);
}
const app = createApp(App);

app.config.globalProperties.$utils = utils;
app.config.globalProperties.$moment = moment;

app.component('Button', Button)
app.component('v-chart', ECharts)
app.component(ElTable.name, ElTable);
app.component(ElTableColumn.name, ElTableColumn);
app.use(store).use(router).use(ArcoVue).use(ArcoVueIcon).mount('#app')