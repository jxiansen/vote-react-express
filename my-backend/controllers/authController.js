import User from "./../models/userModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";

/**
 * 创建并生成一个token
 */
const createSendToken = (id, statusCode, res) => {
  const token = generateToken(id);

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: true, // 只允许在https上使用
    httpOnly: true,
  });

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

/**
 * 根据传入的userId生成一个本地token
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
      code: 1,
      status: "success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(404).json({
      code: 0,
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
      code: 0,
      status: "failed",
      message: "请提供用户名或密码",
    });
  }

  // 2.检查是否存在该用户名
  const user = await User.findOne({ username }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    // 检查数据库中的密码和用户输入的密码是否匹配
    return res.status(401).json({
      code: 0,
      status: "failed",
      message: "登录失败,错误的用户名或密码！",
    });
  }

  // 3. 如果用户名和密码都匹配成功,则发送token给客户端
  const token = generateToken(user._id);
  return res.status(200).json({
    code: 1,
    status: "Success",
    message: "登录成功",
    token,
    userId: user._id,
  });
};

const authRouter = async (req, res, next) => {
  // 1. 检查请求头中是否存在token,并获取到该值
  let token;
  if (
    req.headers.Authorization &&
    req.headers.Authorization.startsWith("jing")
  ) {
    token = req.headers.Authorization.split(" ")[1];
  }
  if (!token) {
    return res.status(401).json({
      message: `你还没有登录,请登录后再重新访问`,
    });
  }

  // 2. 验证token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);
};

export default {
  signup,
  login,
  authRouter,
};
