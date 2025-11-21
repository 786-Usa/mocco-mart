import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

const authMiddleware = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
      console.log("Access Token:", token);

    // console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    console.log("Decoded Token:", decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
     return res.status(401).json({ message: "Unauthorized request" });
    }

    req.user = user;
    console.log("Authenticated user:", req.user);
    next();
  } catch (error) {
    return res.status(401).json({ message: error?.message || "Invalid access token" });
  }
};

export default authMiddleware;
