/**
 * 从json数据导入到mongodb中
 */
import fs from "fs";
import mongoose from "mongoose";
import { config } from "dotenv";
config({ path: "./../.env" });
import User from "./../models/user.js";

// 读取 JSON 文件
const users = fs.readFileSync("./users.json", "utf-8");

// 连接数据库
function connect() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log(`数据库连接成功`));
}

// 导入数据库
const importData = async () => {
  try {
    await User.create(users);
    console.log(`数据库导入成功！`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// 从数据库中删除所有数据
const deleteData = async () => {
  try {
    await User.deleteMany();
    console.log(`数据删除成功`);
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

根据命令行参数来导入测试数据或者删除原来的数据库
if (process.argv[2] === "--import") {
  connect();
  importData();
} else if (process.argv[2] === "--delete") {
  connect();
  deleteData();
}
