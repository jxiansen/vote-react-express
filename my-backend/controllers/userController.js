/**
 * 导入User模型
 */
import User from "./../models/user.js";
/**
 * 创建用户信息
 */
const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    console.log(newUser);
    res.status(200).json({
      status: "scuscess",
      message: `创建用户成功！🎉`,
    });
  } catch (err) {
    // 创建失败，捕获错误并返回错误信息到前台
    console.log(err);
    res.status(404).json({
      status: "failed",
      message: `创建用户失败`,
      err: err,
    });
  }
};

/**
 * 获取所有用户
 */
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find();

    res.status(200).json({
      status: "scuscess",
      message: `查询所有用户成功！🎉`,
      data: allUsers,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: `查询所有用户失败${err}`,
    });
  }
};

/**
 * 根据id获取用户
 */
const getUserById = async (req, res) => {
  try {
    const data = await User.findById(req.params.id);
    // 这种写法是 User.findOne({ _id: req.params.id }) 的简写
    res.status(200).json({
      status: "scuscess",
      message: `查询当前用户成功！🎉`,
      data: data,
    });
  } catch (err) {
    res.status(404).json({
      status: "faild",
      message: `用户查询失败${err}`,
    });
  }
};

/**
 * 更新用户信息
 */
const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // 返回更新后的文件
      runValidators: true, // 运行验证器
    });

    res.status(200).json({
      status: "scuscess",
      message: "用户信息修改成功！",
      data: user,
    });
  } catch (err) {
    res.status(404).json({
      status: "faild",
      message: `用户信息修改失败${err}`,
    });
  }
};

/**
 * 根据用户id,删除其信息
 */
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id); // REST API中删除操作不返回信息到客户端
    res.status(200).json({
      status: "scuscess",
      message: `删除用户成功！🎉`,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: `删除用户失败！🎉${err}`,
    });
  }
};

/**
 * 根据用户信息参数来查询信息
 */
const searchUser = async (req, res) => {
  try {
    const data = await User.find(req.query);
    res.status(200).json({
      status: "scuscess",
      message: `查询用户成功！🎉`,
      data,
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: `查询用户失败！🎉${err}`,
    });
  }
};

export default {
  searchUser,
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUser,
};
