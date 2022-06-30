/**
 * 导入投票模型
 */
import Vote from "../models/voteModel.js";
import _ from "lodash";
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
 * 根据voteId获取相关信息
 */
const getVote = async (req, res) => {
  console.log(req.params);
  try {
    const _id = req.params.id;
    const data = await Vote.findById({ _id });
    const responseData = _.pick(data, [
      "title",
      "desc",
      "deadLine",
      "voteType",
      "options",
    ]);
    console.log(responseData);
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
    console.log(req.body);
    const copy = await Vote.findById(id);
    copy.options[checkedIdx].count++;
    copy.options[checkedIdx].supporterId.push(curLoginUser);
    const responseData = await Vote.findByIdAndUpdate(id, copy, { new: true });
    res.status(200).json({
      code: 1,
      message: "投票成功",
    });
  } catch (err) {
    res.status(404).json({
      code: 0,
      message: "投票失败",
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
};
