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
    title: { type: String, trim: true },
    desc: { type: String, trim: true },
    deadLine: { type: String },
    options: [String],
    voteType: {
      type: Number,
      enum: { values: [0, 1], message: "voteType is must be 0 or 1" },
    },
    createdAt: { type: Date, default: Date.now },
    updateAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

/**
 * 根据约束生成投票模型实例
 */
const Vote = mongoose.model("Vote", VoteSchema);

export default Vote;
