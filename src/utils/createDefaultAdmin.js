import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { User } from "../models/user.model.js";

dotenv.config();

 const createDefaultAdmin = async () => {
  try {
    const adminExists = await User.findOne({ role: "admin" });

    if (adminExists) {
      console.log("Admin already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    const admin = new User({
      username: "Admin",
      email: process.env.ADMIN_EMAIL,
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();
    console.log("Default admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
};
export default createDefaultAdmin;