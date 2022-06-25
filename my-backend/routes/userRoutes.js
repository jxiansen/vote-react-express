import { Router } from "express";
const router = Router();
import authController from "./../controllers/authController.js";
import userController from "./../controllers/userController.js";
import multer from "multer";
const upload = multer({ dest: "./public/upload" });
/**
 * 用户注册
 */
router.post("/signup", authController.signup);

/**
 * 用户登录
 */
router.post("/login", authController.login);

/**
 * 上传头像
 */

router
  .route("/avatar")
  .post(upload.single("avatar"), userController.uploadAvatar);

export default router;
