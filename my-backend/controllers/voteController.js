/**
 * 导入投票模型
 */
import Vote from "./../models/vote.js";

/**
 * 创建投票
 */
const createVote = async (req, res) => {
  try {
    const newVote = await Vote.create(req.body);
    res.status(200).json({
      status: 1,
      message: `创建投票成功！🎉`,
      data: newVote,
    });
  } catch (err) {
    res.status(400).json({
      status: -1,
      message: `创建投票失败`,
      err: err,
    });
  }
};

export default {
  createVote,
};
