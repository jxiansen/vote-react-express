import { Router } from "express";
const router = Router();
import authController from "../controllers/authController.js";
import voteController from "../controllers/voteController.js";

router
  .route("/")
  .get(authController.protect, voteController.getAllVote) // 获取所有投票信息
  .post(voteController.createVote); // 创建新投票

// 根据投票id获取投票内容详情
router
  .route("/:id")
  .get(voteController.getVote) // 获取指定id的投票详情
  .post(voteController.processVote) //更新投票数信息
  .delete(voteController.deleteVoteById) // 删除投票信息
  .put(voteController.updateVote); // 更新投票信息

export default router;
