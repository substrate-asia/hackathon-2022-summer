import Vue from "vue";
import VueRouter from "vue-router";
import Index from "../views/index.vue";
import About from "../views/About.vue";
import Governance from "../views/governance.vue";
// import GoverDetails from "../views/goverDetails.vue";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Index",
    component: Index,
    // meta: {
    //   keepAlive: true, // 需要缓存
    // },
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/governance",
    name: "Governance",
    component: Governance,
    meta: {
      keepAlive: true, // 需要缓存
    },
  },
  {
    path: "/goverDetails",
    name: "GoverDetails",
    // component: GoverDetails,

    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/goverDetails.vue"),
  },
];

const router = new VueRouter({
  mode: "hash",
  // mode: "history",

  base: process.env.BASE_URL,
  routes,
});

export default router;
