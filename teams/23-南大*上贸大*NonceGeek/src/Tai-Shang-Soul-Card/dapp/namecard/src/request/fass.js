import axios from "../utils/axiosUtils";
export const rand_msg = (data) => axios.post('/api/v1/run?name=UserManager&func_name=rand_msg', data)
export const create_user = (data) => axios.post('/api/v1/run?name=UserManager&func_name=create_user', data)
export const get_user = (data) => axios.post('/api/v1/run?name=UserManager&func_name=get_user', data)
export const get_role_list = (data) => axios.post('/api/v1/run?name=UserManager&func_name=get_role_list', data)
