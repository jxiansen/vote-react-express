import { Router } from "express";
const router = Router();
import userController from "./controllers/userController.js";
import VoteController from "./controllers/VoteController.js";

router.get("/name", (req, res) => {
  res.send("hello");
});

/**
 * 用户注册
 */
router.post("/register", userController.createUser);

/**
 * 用户登录
 */

// router.post("/login", (req, res) => {});

/**
 * 创建投票,根据投票id查询投票详情
 */

router.route("/vote").post(VoteController.createVote);

export default router;
