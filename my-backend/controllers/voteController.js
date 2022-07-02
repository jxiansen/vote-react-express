/**
 * 导入投票模型
 */
import Vote from "../models/voteModel.js";
import _ from "lodash";
import { promisify } from "util";
import jwt from "jsonwebtoken";
import userController from "./userController.js";
/**
 * 从请求头对象中的authorization字段中读取用户ID
 */
const getUserIdFromReq = async (req) => {
  const token = req.headers.authorization.split(" ")[1];
  const { userId } = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  return userId;
};

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
  try {
    const allVote = await Vote.find({
      createrId: req.query.userId,
    });
    const responseData = allVote.map((i) =>
      _.pick(i, ["_id", "title", "allCounter"])
    );
    res.status(200).json({
      code: 1,
      message: `获取用户投票列表成功`,
      data: responseData,
    });
  } catch (err) {
    res.status(400).json({
      code: 0,
      message: `获取用户投票列表失败`,
      err,
    });
  }
};

/**
 * 根据voteId查看投票详细信息
 */
const getVote = async (req, res) => {
  try {
    // 从head中读取用户id
    const userId = await getUserIdFromReq(req);
    const _id = req.params.id;
    const data = await Vote.findById({ _id });
    const allSupporter = [
      ...new Set(
        data.options
          .map((i) => i.supporterId)
          .flat()
          .map((i) => `${i}`)
      ),
    ];
    const responseData = _.pick(data, [
      "title",
      "desc",
      "deadLine",
      "voteType",
      "options",
      "allCounter",
    ]);

    // 判断用户是否已经投票过
    if (allSupporter.includes(userId)) {
      return res.status(200).json({
        code: 1,
        message: "你已经投票过",
        hasVoted: true,
        data: responseData,
      });
    }
    res.status(200).json({
      code: 1,
      message: "获取投票信息成功！",
      data: responseData,
    });
  } catch (err) {
    res.status(404).json({
      code: 0,
      message: "获取投票信息失败",
      err,
    });
  }
};

/**
 * 根据voteId删除投票数记录
 */
const deleteVoteById = async (req, res) => {
  try {
    await Vote.findByIdAndDelete(req.params.id);
    res.status(200).json({
      code: 1,
      message: "删除当前投票成功",
    });
  } catch (err) {
    res.status(404).json({
      code: 0,
      message: "删除当前投票失败",
      err,
    });
  }
};

/**
 * 根据用户传入的索引和投票id来更新投票的计数
 */
const processVote = async (req, res) => {
  try {
    const { id } = req.params; // 获取投票参数
    const { checkedIdx, curLoginUser } = req.body;
    const copy = await Vote.findById(id);
    const allSupporter = [
      ...new Set(
        copy.options
          .map((i) => i.supporterId)
          .flat()
          .map((i) => `${i}`)
      ),
    ];
    if (allSupporter.includes(curLoginUser)) {
      return res.status(200).json({
        code: 1,
        message: "您已经投票过",
      });
    }
    const avatar = await userController.getAvatarById(curLoginUser);
    copy.allCounter++;
    copy.options[checkedIdx].count++;
    copy.options[checkedIdx].avatar.push(avatar);
    copy.options[checkedIdx].supporterId.push(curLoginUser);
    const responseData = await Vote.findByIdAndUpdate(id, copy, { new: true });
    res.status(200).json({
      code: 1,
      message: "投票成功",
      data: responseData,
    });
  } catch (err) {
    res.status(404).json({
      code: 0,
      message: "投票失败",
      err,
    });
  }
};

/**
 * 更新投票信息
 */
const updateVote = async (req, res) => {
  try {
    const { id } = req.params;
    var newVote = req.body;
    const queryRes = await Vote.findById(id);
    const storeData = _.assign(queryRes, newVote);
    for (let key in newVote.options) {
      storeData.options[key] = {
        ...storeData.options,
        content: newVote.options[key],
      };
    }
    const resp = await Vote.findByIdAndUpdate(id, storeData, { new: true });
    res.status(200).json({
      code: 1,
      message: "修改投票信息成功",
    });
  } catch (err) {
    res.status(404).json({
      code: 0,
      message: "修改投票信息失败",
      err,
    });
  }
};

export default {
  createVote,
  getAllVote,
  getVote,
  deleteVoteById,
  processVote,
  updateVote,
};
