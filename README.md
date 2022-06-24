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

2. 用户鉴权和认证

本次使用的方案较为现代和简单，`Json Web Tokens` `(JWT)` , jwt是一种无状态的解决方案，不需要在服务器上存储任何会话状态，对于构建 `restful` 风格的 api来说是一种很完美的方案， `restful api` 应该始终是无状态的。[jwt官网]([JSON Web Tokens - jwt.io](https://jwt.io/))

**流程**

前提： 客户端已经存储了用户之前注册的个人信息，

![image-20220624174019813](http://i0.hdslb.com/bfs/album/8b0028478a306415322c7dd5d7a9b97eea97eee6.png)

* 用户将用户名和密码和密码发送给后台
* 如果验证通过有这个账号，创建一个唯一的 `JWT` 密钥
* 服务端返回密钥给用户
* 客户端使用 `cookie` 或者 `localstorage` 来存储 `JWT` 密钥
* 用户浏览需要权限的内容时，自身携带 `JWT` 密钥来访问

简单来说就是后台给用户发送一个护照来证明自己的访问权限 

![image-20220624175133819](http://i0.hdslb.com/bfs/album/08f63b3700470bf120e339d7080817f56f3ac494.png)

`JWT` 本质上来说就是一串字符串，由三部分组成： `HEADER` `PAYLOAD` `VERIFY SIGNATURE` 

* 标头中包含着令牌的一些元数据，包括：加密算法，令牌类型
* 载荷中包含着我们可以编码的数据，载荷中的数据越大最后的 `token` 就越大，这两部分都是可以公开的，不能存储任何敏感信息
* 最终的签名使用 标头，载荷 和存储在服务器端的 secret 组成。

 ![image-20220624180316640](http://i0.hdslb.com/bfs/album/ce7124a69170e8d7b28206df2d0183244dd6f456.png)

用户携带的 `JWT` 发送给后台，后台根据他携带的 `header` 和 `payload` 加上自己本地存储的 `secret` 共同计算出一个本地测试签名，这个签名如果和 `JWT` 中用户自己计算出来的签名不同则说明 `header` 和 `payload` 被篡改了，则没有访问路径的权限。

![image-20220624180620851](http://i0.hdslb.com/bfs/album/49cf1b190a49d491ad1e8f54406d2d9cec97582e.png)

总结： **没有secret任何人都无法操作 JWT数据，因为无法获得有效的签名**