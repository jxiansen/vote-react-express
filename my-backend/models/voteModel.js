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
        supporterId: mongoose.ObjectId, // 当前选项支持者的id
        avatar: { type: String }, // 支持该选项的用户头像
      },
    ],
    voteType: { type: Boolean }, // 如果是单选投票为 false,多选投票为 true
    createdAt: { type: Date, default: Date.now }, // 创建时间
    updateAt: { type: Date, default: Date.now }, // 更新时间
  },
  { versionKey: false }
);

/**
 * 根据约束生成投票模型实例
 */
const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;
