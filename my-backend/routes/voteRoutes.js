import { Router } from "express";
import authController from "../controllers/authController.js";
const router = Router();
import voteController from "../controllers/voteController.js";

router
  .route("/")
  .get(voteController.getAllVote)
  .post(voteController.createVote);
router.route("/test").get(authController.authRouter);
// 根据投票id获取投票内容详情
router.route("/:id").get(voteController.getVote);

export default router;
