# React-vote

模仿腾讯投票小程序做的前后端分离的投票小程序。

### 前端

本项目使用 `vite` 创建，具体开发过程使用了以下依赖包

- `react`
- `react-router`: 路由导航
- `antd-mobile` : 蚂蚁金服开源的 `react` 移动端 `ui` 框架
- `axios`: 网络请求库，前后端交互使用
- `immer`: `mobx` 作者写的一个库，用来实现 `js` 的不可变数据结构
- `typescript`

### 后端

- `bcryptjs` 对原始密码进行哈希加盐处理
- `cors` 解决浏览器跨域问题
- `jsonwebtoken` 使用 jwt 验证鉴权
- `mongoose` 连接并操作数据库
- `multer` 实现用户头像上传功能
- `nodemon` 开发时热更新提高效率
- `validator` 包含多种验证函数，包括邮箱验证，哈希验证，日期验证。。。
- `lodash` 函数库方便操作

## 功能

- 创建投票（单选投票，多选投票）
- 用户登录
- 用户注册
- 投票详情查看
- 编辑投票

## 使用逻辑

1. 应用打开默认显示新建界面，如果想要查看其他信息，需要判断用户是否登录
2. 如果未登录跳转到用户登录界面，如果用户尚未注册，跳转到用户注册界面
3. 注册成功后直接跳转到登录界面进行登录
4. 登录成功后可以随便查看所有的路由

## 应用截图

### 创建投票

![image-20220621203555796](http://i0.hdslb.com/bfs/album/9e8b2cbd9a0957da8d96ea77b31b87b6efbcea53.png)

### 用户登录

![image-20220621203623297](http://i0.hdslb.com/bfs/album/4e8acec40c62b2f12d0b8fb54cf67325986360cc.png)

### 创建投票

<img src="http://i0.hdslb.com/bfs/album/e6e314e9b9b51e704e0923f904af8b9b92a927d5.png" alt="image-20220702213014269" style="zoom:80%;" />

### 投票详情

<img src="http://i0.hdslb.com/bfs/album/7f925014901956fd6b5f0de3a7c3931ddccdb94d.png" alt="image-20220704150829819" style="zoom:80%;" />

### 投票列表

<img src="http://i0.hdslb.com/bfs/album/bc56298c7220dce631699b889d2459fffc43d6c2.png" alt="image-20220704150936548" style="zoom:80%;" />

## 前端

### 用户注册功能

- 用户先上传头像，后端接收头像后返回响应的头像地址
- 用户填写其他个人信息
- 点击注册用户将之前返回的头像地址和用户名，密码，邮箱等信息共同返回

## 后端

### 技术栈

body-parser: http 请求中间件，这个模块可以解析 `json` ,`Raw` ,`txt` 和 `url-encoded` 格式的请求体，在 `Express` 中使用该模块用作请求解析中间件

返回的接口数据中状态`code` 如果为 1 代表成功，0 为失败

## 遇到的问题

### 跨域

本地开发的时候，前端项目启动在 3000 端口，后端启动在 5000 端口，使用 `Axios` 发送数据的时候，一直报错。研究了一下发现是浏览器不支持跨域请求。

![image-20220623222206731](http://i0.hdslb.com/bfs/album/72c9c3b9432c25c431eefa62ad258595bb6fc6fb.png)

两个服务之间通信的时候，只要协议，域名，端口号，任意一项不同就会存在跨域问题。

目前有两种解决跨域问题的方案：

- `cors` 本次解决使用的方案，较为主流（推荐使用）
- `jsonp` 有缺陷的解决方案（只支持 get 请求）

**具体实现**

使用 `cors` 中间件，并配置使用，可以解决跨域问题

```js
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

### 用户鉴权和认证

本次使用的方案较为现代和简单，`Json Web Tokens` `(JWT)` , jwt 是一种无状态的解决方案，不需要在服务器上存储任何会话状态，对于构建 `restful` 风格的 api 来说是一种很完美的方案， `restful api` 应该始终是无状态的。[jwt 官网]([JSON Web Tokens - jwt.io](https://jwt.io/))

**流程**

前提： 客户端已经存储了用户之前注册的个人信息，

![image-20220624174019813](http://i0.hdslb.com/bfs/album/8b0028478a306415322c7dd5d7a9b97eea97eee6.png)

- 用户将用户名和密码和密码发送给后台
- 如果验证通过有这个账号，创建一个唯一的 `JWT` 密钥
- 服务端返回密钥给用户
- 客户端使用 `cookie` 或者 `localstorage` 来存储 `JWT` 密钥
- 用户浏览需要权限的内容时，自身携带 `JWT` 密钥来访问

简单来说就是后台给用户发送一个护照来证明自己的访问权限

![image-20220624175133819](http://i0.hdslb.com/bfs/album/08f63b3700470bf120e339d7080817f56f3ac494.png)

`JWT` 本质上来说就是一串字符串，由三部分组成： `HEADER` `PAYLOAD` `VERIFY SIGNATURE`

- 标头中包含着令牌的一些元数据，包括：加密算法，令牌类型
- 载荷中包含着我们可以编码的数据，载荷中的数据越大最后的 `token` 就越大，这两部分都是可以公开的，不能存储任何敏感信息
- 最终的签名使用 标头，载荷 和存储在服务器端的 secret 组成。

![image-20220624180316640](http://i0.hdslb.com/bfs/album/ce7124a69170e8d7b28206df2d0183244dd6f456.png)

用户携带的 `JWT` 发送给后台，后台根据他携带的 `header` 和 `payload` 加上自己本地存储的 `secret` 共同计算出一个本地测试签名，这个签名如果和 `JWT` 中用户自己计算出来的签名不同则说明 `header` 和 `payload` 被篡改了，则没有访问路径的权限。

![image-20220624180620851](http://i0.hdslb.com/bfs/album/49cf1b190a49d491ad1e8f54406d2d9cec97582e.png)

总结： **没有 secret 任何人都无法操作 JWT 数据，因为无法获得有效的签名**

**具体实现**

1. 后端方面

在接口设计时，用户在访问涉及到加密信息的接口时，需要先对用户的请求进行权限验证。

```js
router
  .route("/")
  .get(authController.protect, voteController.getAllVote) // 获取所有投票信息
  .post(authController.protect, voteController.createVote); // 创建新投票
```

比如这里的获取所有投票信息，和创建新投票两个接口，很明显这是只有注册用户才可以访问的信息。那么就需要在获取所有投票信息前增加一个验证的中间件函数。即这里的 `protect`,如果经过 `protect` 函数认证后有执行权限才可以进行后面的访问。

下面是 `protect` 中间件的具体实现。

```js
const protect = async (req, res, next) => {
  try {
    // 1. 检查请求头中是否存在token,并获取到该值
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("jing")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({
        message: `你还没有登录,请登录后再重新访问`,
      });
    }
    // 2. 验证token的正确性,判断令牌过期了没？还是被人篡改了？
    // 这个verify验证函数是异步的,为了使用await用一层promisefy来包裹来返回一个promise
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // 3. 检查用户是否依然存在
    const freshUser = await User.findById(decoded.userId);
    if (!freshUser) {
      return res.status(401).json({
        code: 0,
        message: `用户令牌正确，但账户已经被删除了`,
      });
    }
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(404).json({
        code: 0,
        message: "jwt令牌错误,认证失败",
      });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        code: 0,
        message: "你的jwt令牌已经过期,请重新登录",
      });
    }
    return res.status(400).json({
      code: 0,
      message: "验证错误",
    });
  }
  next();
};
```

## 安装运行

### 前端

页面默认运行在 `localhost:3000` 

1. 下载源代码

``` sh
git clone git@github.com:jxiansen/vote-react-express.git
```

2. 进入目录并安装相关依赖，建议使用 `pnpm` 依赖安装快更好用

``` sh
cd Fontend
pnpm i 
```

3. 本地启动项目

``` sh
pnpm dev
```

4. 打包出资源文件，上传到 `nginx` 指定文件夹就完成了部署

``` sh
pnpm build
```

### 后端

启动前先修改 `.env` 文件中的环境变量, `api` 服务运行在 `5000`端口

```sh
pnpm start
```

![image-20220704144805536](http://i0.hdslb.com/bfs/album/fc88e93319878c6c59a20966b97be998868417cb.png)

## 项目总结

* 功能逻辑的理解不足

自己写项目的时候，代码要添加什么功能，达到什么样的要求其实都没有明确，很多都是在开发的过程中现写现加的，所有经常会把昨天的功能否定掉。觉得难度太大或者没有添加的必要。

* 接口约定不规范

前后端都是自己写的，经常遇到前端的页面的修改了需求字段后端接口又要随之改变，调试的过程中还经常出现bug,浪费了很多时间。可以说真正写代码的时间只占三分之一，大部分时候都是在测试页面。对于接口的设计，必须仔细推敲减少后面重新修改的的可能，严格限定格式规范。

* 代码审查？ 重写？

随着自己的代码越写越大发现之前写的逻辑不够优化，过于累赘，或者逻辑混乱， 刚开始的时候还愿意积极修改优化，可以随着代码量越来越大，每次重写逻辑都需要浪费很多精力。自己也经常会想又不是不能用用。😂

* 错误处理 

对代码运行过程中可能遇到的问题要求充分的预见性，比如从 `localstorage` 中读取存储的用户信息操作时，没有对读取不到的情况进行考虑。导致后期发请求一直报错。

* 文档和注释

有时候自己几天前写的代码，过了一段时间后自己读起来都很费劲，要花很长时间才能理解其作用。这时候文档的重要性就体现出来了。代码编写过程中要注意，对重要的函数关键的逻辑进行注释。

* 解耦的思想

代码的编写也需要积极使用软件工程解耦的思想，宏观上需要把每个整个项目拆分成组件或者模块，微观上重复的代码想办法将其封装成公有的函数或者接口方法。防止代码写成 “一坨”

