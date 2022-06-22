import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/landing' },
    { path: '/dao', component: '@/pages/dao' },
    { path: '/detail', component: '@/pages/detail' },
    { path: '/field', component: '@/pages/field' },
    { path: '/link', component: '@/pages/link' },
    { path: '/gist', component: '@/pages/gist' },
    { path: '/home', component: '@/pages/home' },
  ],
  theme:{
    "@primary-color":"#7AD6A8",
  },
  dva:{
    immer:true
  },
  fastRefresh: {},
  proxy:{},
  chainWebpack(config){
    config.module // 配置 file-loader
      .rule('otf')
      .test(/.otf$/)
      .use('file-loader')
      .loader('file-loader');
  },
});
