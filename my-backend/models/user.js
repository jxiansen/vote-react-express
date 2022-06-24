/**
 * 用户模型
 */
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

/**
 * 用户模型约束
 */
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true },
    password: { type: String, required: true, select: false },
    email: { type: String, validate: [validator.isEmail, "邮箱不合法"] },
    avatar: { type: String },
    createTime: { type: Date, default: Date.now() },
    updateTime: { type: Date, default: Date.now() },
  },
  { versionKey: false }
);

// 对用户密码进行哈希加密
UserSchema.pre("save", async function (next) {
  // 密码已经被哈希加密过,调用下一个中间件函数
  if (validator.isHash(this.password)) return next();
  // 没有被加密，进行加密
  this.password = await bcrypt.hash(this.password, 12); // 使用hash加密，第二个参数是salt值的长度
  next();
});

/**
 * 异步的比较原始密码是否是可以加密成第二个哈希值
 */

UserSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/**
 * 根据约束生成用户实例
 */

const User = mongoose.model("User", UserSchema);

export default User;
