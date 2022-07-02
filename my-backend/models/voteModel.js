/**
 * 投票模型
 */
import mongoose from "mongoose";

/**
 * 投票模型约束
 */
const VoteSchema = new mongoose.Schema(
  {
    createrId: mongoose.ObjectId, // 投票创建者的id
    title: { type: String, trim: true }, // 投票标题
    desc: { type: String, trim: true }, // 投票描述
    deadLine: { type: String }, // 投票截至日期
    options: [
      // 所有投票选项
      {
        content: { type: String }, // 投票选项
        count: { type: Number, default: 0 }, // 当前选项支持数
        supporterId: [mongoose.ObjectId], // 当前选项支持者的id
        avatar: [{ type: String }],
      },
    ],
    allCounter: { type: Number, default: 0 }, // 选项中所有投过票的人数
    voteType: { type: Boolean }, // 如果是单选投票为 false,多选投票为 true
  },
  { versionKey: false }
);

/**
 * 根据约束生成投票模型实例
 */
const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;
