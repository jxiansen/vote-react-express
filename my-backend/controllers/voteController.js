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
      code: 1,
      message: `创建投票成功！🎉`,
      res: newVote,
    });
  } catch (err) {
    res.status(400).json({
      code: 0,
      message: `创建投票失败`,
      err,
    });
  }
};

export default {
  createVote,
};
