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
  // 将用户的存储在mongodb中的_id存储在payload中,传入 payload,secret,和过期时间来创建令牌
  return jwt.sign({ userId: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

/**
 * 用户注册
 */

const signup = async (req, res, next) => {
  try {
    const newUser = await User.create(req.body);
    // 201状态码,成功请求并创建了新的资源
    res.status(201).json({
      code: 1,
      status: "success",
      message: "用户注册成功",
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    res.status(403).json({
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

/**
 * 对关键路由进行用户验证保护
 */

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

export default {
  signup,
  login,
  protect,
};
