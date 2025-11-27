import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();

    const userRes = {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    };

    return res
      .status(201)
      .json({ message: "User registered successfully", userData: userRes });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userValidation = await User.findOne({ email });
    if (!userValidation) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      userValidation.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { _id: userValidation._id, role: userValidation.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { _id: userValidation._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    await User.findByIdAndUpdate(userValidation._id, {
      refreshToken: refreshToken,
    });

    const userRes = {
      _id: userValidation._id,
      username: userValidation.username,
      email: userValidation.email,
      role: userValidation.role,
    };

    return res
      .status(200)
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
      })
      .json({ message: "Login successful", userData: userRes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};



const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decodedToken._id);

    if (!user || user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
    );
      const newRefreshToken = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );


   

    return res.status(200)
     .cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
    })

    .cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
    })
    .json({
      message: "Access token refreshed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};



const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $unset: { refreshToken: 1 } },
    { new: true }
  );

  return res
    .status(200)
    .clearCookie("accessToken", { httpOnly: true, secure: true })
    .clearCookie("refreshToken", { httpOnly: true, secure: true })
    .json({ message: "Logged out successfully" });
};

export { registerUser, loginUser, refreshAccessToken, logoutUser };
