# React-vote

### 依赖模块

本项目使用 `vite` 创建，具体开发过程使用了以下依赖包

* `react`
* `react-router`: 路由导航
* `antd-mobile` : 蚂蚁金服开源的 `react` 移动端 `ui` 框架
* `axios`: 网络请求库，前后端交互使用
* `immer`: `mobx` 作者写的一个库，用来实现 `js` 的不可变数据结构
* `typescript`

## 功能

* 创建投票（单选投票，多选投票）
* 用户登录
* 投票详情查看
* 编辑投票

## 应用截图

### 创建投票

![image-20220621203555796](http://i0.hdslb.com/bfs/album/9e8b2cbd9a0957da8d96ea77b31b87b6efbcea53.png)

### 用户登录

![image-20220621203623297](http://i0.hdslb.com/bfs/album/4e8acec40c62b2f12d0b8fb54cf67325986360cc.png)

## 后端

### 技术栈

body-parser: http请求中间件，这个模块可以解析 `json` ,`Raw` ,`txt` 和 `url-encoded` 格式的请求体，在 `Express` 中使用该模块用作请求解析中间件

## 遇到的问题

1. 跨域

本地开发的时候，前端项目启动在3000端口，后端启动在5000端口，使用 `Axios` 发送数据的时候，一直报错。研究了一下发现是浏览器不支持跨域请求。

![image-20220623222206731](http://i0.hdslb.com/bfs/album/72c9c3b9432c25c431eefa62ad258595bb6fc6fb.png)

两个服务之间通信的时候，只要协议，域名，端口号，任意一项不同就会存在跨域问题。

目前有两种解决跨域问题的方案：

* `cors` 本次解决使用的方案，较为主流（推荐使用）
* `jsonp` 有缺陷的解决方案（只支持 get 请求）

**具体实现**

使用 `cors` 中间件，并配置使用，可以解决跨域问题

``` js
// 安装模块
pnpm i cors
// 导入
import cors from "cors";
// 使用
app.use(
  cors({
    // maxAge: 86400, // 预检请求的有效期
    origin: true, // 写为true让响应头的Access-Control-Allow-Origin为请求者的域
    credentials: true, // 让预检请求的响应中有Access-Control-Allow-Credentials: true这个头，以允许跨域请求带上cookie
  })
);
```

