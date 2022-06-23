/**
 * 用户模型
 */
import mongoose from "mongoose";

/**
 * 用户模型约束
 */

const UserSchema = new mongoose.Schema(
  {
    userId: { type: Number },
    username: { type: String },
    password: { type: String },
    email: { type: String },
    avatar: { type: String },
  },
  { versionKey: false }
);

/**
 * 根据约束生成用户实例
 */

const User = mongoose.model("User", UserSchema);

export default User;
