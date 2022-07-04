// @ts-nocheck
import axios from "axios";
import { useState } from "react";
import resso from "resso";
import { Toast } from "antd-mobile";

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
    // 如果本地存储了token就给请求头添加token
    if (localStorage.token) {
      config.headers.Authorization = `jing ${localStorage.token}`;
    }
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

/**
 * 如果本地没有用户数据就跳转重定向
 */

export const Redirect = () => {
  if (!localStorage.token) {
    Toast.show({
      icon: "fail",
      content: "你还没没有登录(⊙o⊙),请先登录。。。",
      afterClose: () => {
        navigate("/login");
      },
    });
  }
};

// 定义axios响应对象接口
export interface RespData {
  code: number;
  message: string;
  data?: object;
  err?: object;
}

// 自定义复制粘贴板hook

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return success

export function useCopyToClipboard(): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = async (text) => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard not supported");
      return false;
    }

    // Try to save to clipboard then save it in the state if worked
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      return true;
    } catch (error) {
      console.warn("Copy failed", error);
      setCopiedText(null);
      return false;
    }
  };

  return [copiedText, copy];
}
