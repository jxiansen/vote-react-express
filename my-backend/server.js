import mongoose from "mongoose";
import app from "./app.js";
import "dotenv/config";
/**
 * 监听服务端口
 */
function listen() {
  console.log(`数据库成功连接`);
  app.listen(process.env.PORT, () => {
    console.log(`后台api服务运行在 http://localhost:${process.env.PORT}`);
  });
}

/**
 * 连接mongodb数据库
 */

function connect() {
  mongoose.connection
    .on("err", console.log)
    .on("disconnected", connect)
    .on("open", listen);
  return mongoose.connect(process.env.MONGO_URI);
}

connect();

console.log(process.env.PORT);
