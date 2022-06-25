import express from "express";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
import voteRouter from "./routes/voteRoutes.js";

/**
 * 解决跨域问题
 */

app.use(
  cors({
    // maxAge: 86400, // 预检请求的有效期
    origin: true, // 写为true让响应头的Access-Control-Allow-Origin为请求者的域
    credentials: true, // 让预检请求的响应中有Access-Control-Allow-Credentials: true这个头，以允许跨域请求带上cookie
  })
);

//  解析UTF-8的编码的数据
app.use(bodyParser.urlencoded({ extended: false }));
// 对post请求体做解析
app.use(bodyParser.json());
/**
 * 静态文件服务
 */
app.use(express.static("public"));

/**
 * 用户处理相关的api
 */

app.use("/users", userRouter);

/**
 * 投票相关的api
 */

app.use("/vote", voteRouter);
export default app;
