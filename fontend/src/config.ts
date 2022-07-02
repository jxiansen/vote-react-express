// @ts-nocheck
import axios from "axios";
import resso from "resso";

export const axiosInstance = axios.create({
  // 后端服务地址
  baseURL: "http://81.68.209.144:5000/",
  // baseURL: "http://localhost:5000/",
  headers: {
    Authorization: "",
  },
});

// 添加请求拦截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 注册和登录页面的请求可以不携带token
    if (
      location.pathname.includes("signup") ||
      location.pathname.includes("login")
    ) {
      return config;
    }
    // 判断本地是否存储有用户信息,不存在则跳转到登录界面
    if (!localStorage.UserInfo) {
      window.navigate("/login");
    }
    // 如果本地存储了token就给请求头添加token
    const { token } = JSON.parse(localStorage.UserInfo);
    config.headers.Authorization = `jing ${token}`;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

// 添加响应拦截器
axiosInstance.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

/**
 * resso本地状态管理
 */
export const store = resso({ curLoginUser: "", token: "" });
