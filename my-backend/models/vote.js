/**
 * 投票模型
 */
import mongoose from "mongoose";

/**
 * 投票模型约束
 */
const VoteSchema = new mongoose.Schema(
  {
    voteId: { type: Number },
    userId: { type: Number },
    title: { type: String },
    desc: { type: String },
    deadLine: { type: String },
    options: { type: Array },
    voteType: { type: Number },
  },
  { versionKey: false }
);

/**
 * 根据约束生成投票模型实例
 */
const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;
