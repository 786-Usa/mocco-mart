import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";


const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existngUser = await User.findOne({
            email
        })
        if (existngUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        //two functions given one hashed and other comapre, in  hash one password is hashed using salt and in compare password is compared with hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); // here salt can be simply 10 or 12 but more the salt more secure the password but takes more time to hash

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });
        await newUser.save();
        const userRes = {
            _id: newUser._id,
            username: newUser.username,
            email: newUser.email
        }
        return res.status(201).json({ message: "User registered successfully", userData: userRes });

    }

    catch (error) {
        return res.status(500).json({ message: "Internal server error" });
    }

}
export { registerUser };