import express from "express";
const app = express();
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from "./routes/userRoutes.js";
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
app.get("/", (req, res) => {
  res.send("hello world");
});

//  解析UTF-8的编码的数据
app.use(bodyParser.urlencoded({ extended: false }));
// 对post请求体做解析
app.use(bodyParser.json());

/**
 * 所有的api路由处理
 */

app.use("/users", userRouter);
export default app;
