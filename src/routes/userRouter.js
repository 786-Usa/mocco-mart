import { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/refresh-token", refreshAccessToken);
userRouter.post("/logout", authMiddleware, logoutUser);

export default userRouter;
