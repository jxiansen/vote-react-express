import { Router } from "express";
const router = Router();
import authController from "./../controllers/authController.js";
/**
 * 用户注册
 */
router.post("/signup", authController.signup);

/**
 * 用户登录
 */
router.post("/login", authController.login);

export default router;
