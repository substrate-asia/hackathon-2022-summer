import axios  from "axios";
// 创建一个axios对象
const newAxios = axios.create({
    // baseURL: "http://localhost:4000/", // local
    baseURL:"http://172.20.10.2:8888", // online
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
})

export default newAxios

