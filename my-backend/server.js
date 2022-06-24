import mongoose from "mongoose";
import app from "./app.js";
import "dotenv/config";
/**
 * 监听服务端口
 */
function listen(port) {
  app.listen(port, () => {
    console.log(`后台api服务运行在 http://localhost:${port}`);
  });
}

/**
 * 连接mongodb数据库
 */

function connect(url) {
  return mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log(`数据库连接成功`));
}

connect(process.env.MONGO_URI);
listen(process.env.PORT);
