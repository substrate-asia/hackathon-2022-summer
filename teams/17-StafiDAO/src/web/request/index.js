import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
// import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: "https://api.subquery.network/sq", // url = base url + request url
});

service.interceptors.response.use(
  (response) => {
    const res = response.data.data;
    console.log(res);
    return res;
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
