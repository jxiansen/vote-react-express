/**
 * 导入投票模型
 */
import Vote from "../models/voteModel.js";
import UserController from "./userController.js";

/**
 * 创建投票
 */
const createVote = async (req, res) => {
  try {
    const newVote = await Vote.create(req.body);
    res.status(200).json({
      code: 1,
      message: `创建投票成功！🎉`,
      voteId: newVote._id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      code: 0,
      message: `创建投票失败`,
      err,
    });
  }
};

/**
 * 获取当前用户创建的所有投票
 */
const getAllVote = async (req, res) => {
  console.log(req.body);
  // const { userId } = req.body;
  // try {
  //   Vote.findOne({
  //     userId,
  //   });
  //   res.status(200).json({
  //     message: `获取用户所有投票成功`,
  //   });
  // } catch (err) {
  //   res.status(400).json({
  //     code: 0,
  //     message: `获取用户所有投票失败`,
  //     err,
  //   });
  // }
};

/**
 * 根据voteId获取相关信息
 */
const getVote = async (req, res) => {
  console.log(req.params);
  try {
    const _id = req.params.id;
    const data = await Vote.findById({ _id });
    res.status(200).json({
      code: 1,
      message: "获取投票信息成功！",
      data,
    });
  } catch (err) {
    res.status(404).json({
      code: 0,
      message: "获取投票信息失败",
      err,
    });
  }
};

export default {
  createVote,
  getAllVote,
  getVote,
};
