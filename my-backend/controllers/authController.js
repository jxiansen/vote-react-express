import User from "./../models/user.js";
import jwt from "jsonwebtoken";

/**
 * 生成一个本地token,并返回
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * 用户注册
 */

const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const newUser = await User.create(req.body);
    // 将用户的存储在mongodb中的_id存储在payload中,传入 payload,secret,和过期时间来创建令牌
    const token = generateToken(newUser._id);

    res.status(201).json({
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: "用户注册失败！",
      err: err,
    });
  }
};

/**
 * 用户登录
 */
const login = async (req, res, next) => {
  const { username, password } = req.body;
  // 1. 检查请求中是否存在用户名和密码
  if (!username || !password) {
    return res.status(404).json({
      status: "failed",
      message: "请提供用户名或密码",
    });
  }

  // 2.检查是否存在该用户名
  const user = await User.findOne({ username }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    // 检查数据库中的密码和用户输入的密码是否匹配
    return res.status(401).json({
      status: "failed",
      message: "登录失败,错误的用户名或密码！",
    });
  }

  // 3. 如果用户名和密码都匹配成功,则发送token给客户端
  const token = generateToken(user._id);
  return res.status(200).json({
    status: "Success",
    message: "登录成功",
    token,
  });
};

export default {
  signup,
  login,
};
