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
    const existngUser = await User.findOne({
      email,
    });
    if (existngUser) {
      return res.status(409).json({ message: "User already exists" });
    }
    //two functions given one hashed and other comapre, in  hash one password is hashed using salt and in compare password is compared with hashed password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt); // here salt can be simply 10 or 12 but more the salt more secure the password but takes more time to hash

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
    const userRes = {
      _id: userValidation._id,
      username: userValidation.username,
      email: userValidation.email,
      role: userValidation.role,
    };
    const accessToken = jwt.sign(
      { _id: userValidation._id, role: userValidation.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken= jwt.sign(
      { _id: userValidation._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );
    await User.findByIdAndUpdate(userValidation._id, {refreshToken: refreshToken});
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    });
    return res
      .status(200)
      .json({ message: "Login successful", userData: userRes });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const refreshAccessToken = async (req, res) => {
try {
  const incomingRefreshToken = req.cookies.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(401).json({ message: "No refresh token provided" });
  }
  const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
  const user = await User.findById(decodedToken.userId);
  if (!user || user.refreshToken !==incomingRefreshToken) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
  const newAccessToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "1h" }
  );
  const newRefreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
  await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: true,
  });
  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
  });
  res.status(200).json({ message: "Access token refreshed successfully" });
} catch (error) {
  res.status(500).json({ message: "Internal server error" });
}
}

const logoutUser = async (req, res) => {
// const { refreshToken } = req.cookies;
// if (!refreshToken) {
//   return res.status(400).json({ message: "No refresh token provided" });
// }
await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )
    res.status(200)
.clearCookie("accessToken", { httpOnly: true, secure: true })
.clearCookie("refreshToken", { httpOnly: true, secure: true })
.json({ message: "Logged out successfully" });
}


export { registerUser, loginUser, refreshAccessToken , logoutUser };






// import bcrypt from "bcryptjs";
// import { User } from "../models/user.model.js";
// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// dotenv.config();

// // Helper to generate a token with the role included
// const generateAccessToken = (user) => {
//     return jwt.sign(
//         { userId: user._id, role: user.role }, // Include role here!
//         process.env.JWT_ACCESS_SECRET,
//         { expiresIn: "1h" }
//     );
// };
// const generateRefreshToken = (user) => {
//     return jwt.sign(
//         { userId: user._id },
//         process.env.JWT_REFRESH_SECRET,
//         { expiresIn: "7d" }
//     );
// };

// // =======================================================
// // 1. PUBLIC: Register Normal User (Role defaults to 'user')
// // =======================================================
// const registerUser = async (req, res) => {
//     try {
//         const { username, email, password } = req.body;
//         if (!username || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }
        
//         // Use a better variable name
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ message: "User already exists" });
//         }
        
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // --- KEY UPDATE: Set the role to 'user' ---
//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//             role: 'user', // Explicitly set default role
//         });
        
//         await newUser.save();
        
//         const userRes = {
//             _id: newUser._id,
//             username: newUser.username,
//             email: newUser.email,
//             role: newUser.role, // Include role in response
//         };
        
//         // OPTIONAL: Log in the user immediately after registration
//         const accessToken = generateAccessToken(newUser);
//         const refreshToken = generateRefreshToken(newUser);
//         await User.findByIdAndUpdate(newUser._id, { refreshToken: refreshToken });
        
//         res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
//         res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, sameSite: 'strict' });

//         return res
//             .status(201)
//             .json({ message: "User registered successfully", userData: userRes });
//     } catch (error) {
//         console.error("Registration error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// // =======================================================
// // 2. PROTECTED: Register Admin User (Requires existing Admin to create)
// // =======================================================
// const registerAdmin = async (req, res) => {
//     // This function will only be reached if the request passes the 'authMiddleware' and 'adminMiddleware'
//     try {
//         const { username, email, password } = req.body;
//         if (!username || !email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }
        
//         const existingAdmin = await User.findOne({ email });
//         if (existingAdmin) {
//             return res.status(409).json({ message: "User/Admin already exists" });
//         }
        
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // --- KEY UPDATE: Explicitly set the role to 'admin' ---
//         const newAdmin = new User({
//             username,
//             email,
//             password: hashedPassword,
//             role: 'admin', 
//         });
        
//         await newAdmin.save();
        
//         const adminRes = {
//             _id: newAdmin._id,
//             username: newAdmin.username,
//             email: newAdmin.email,
//             role: newAdmin.role,
//         };
        
//         // Note: We typically do NOT return a token here, as the *currently logged-in Admin* is creating 
//         // a new account, not logging into it.
        
//         return res
//             .status(201)
//             .json({ message: "Admin user registered successfully", userData: adminRes });
//     } catch (error) {
//         console.error("Admin registration error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };


// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({ message: "All fields are required" });
//         }
//         const userValidation = await User.findOne({ email });
//         if (!userValidation) {
//             return res.status(404).json({ message: "User not found" });
//         }
//         const isPasswordValid = await bcrypt.compare(
//             password,
//             userValidation.password
//         );
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Invalid credentials" });
//         }
        
//         // --- KEY UPDATE: Include role in the response and use the helper functions ---
//         const userRes = {
//             _id: userValidation._id,
//             username: userValidation.username,
//             email: userValidation.email,
//             role: userValidation.role, // Include the role
//         };

//         const accessToken = generateAccessToken(userValidation);
//         const refreshToken = generateRefreshToken(userValidation);

//         await User.findByIdAndUpdate(userValidation._id, {refreshToken: refreshToken});
        
//         // --- BEST PRACTICE: Add sameSite to cookies ---
//         res.cookie("refreshToken", refreshToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict', 
//         });
//         res.cookie("accessToken", accessToken, {
//             httpOnly: true,
//             secure: true,
//             sameSite: 'strict', 
//         });
        
//         return res
//             .status(200)
//             .json({ message: "Login successful", userData: userRes });
//     } catch (error) {
//         console.error("Login error:", error);
//         return res.status(500).json({ message: "Internal server error" });
//     }
// };

// const refreshAccessToken = async (req, res) => {
//     try {
//         const incomingRefreshToken = req.cookies.refreshToken;
//         if (!incomingRefreshToken) {
//             return res.status(401).json({ message: "No refresh token provided" });
//         }
//         const decodedToken = jwt.verify(incomingRefreshToken, process.env.JWT_REFRESH_SECRET);
//         const user = await User.findById(decodedToken.userId);
        
//         // --- VALIDATION UPDATE: Check if the refresh token in the database matches the incoming one ---
//         if (!user || user.refreshToken !== incomingRefreshToken) {
//             // Potential refresh token theft detected! Clear all tokens and force log out.
//             if (user) {
//                 user.refreshToken = null;
//                 await user.save();
//             }
//             res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: 'strict' });
//             res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: 'strict' });
//             return res.status(403).json({ message: "Invalid or revoked refresh token" });
//         }

//         // --- KEY UPDATE: Use helper functions and ensure role is in new access token ---
//         const newAccessToken = generateAccessToken(user);
//         const newRefreshToken = generateRefreshToken(user);

//         await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
        
//         res.cookie("accessToken", newAccessToken, { httpOnly: true, secure: true, sameSite: 'strict' });
//         res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, sameSite: 'strict' });
        
//         res.status(200).json({ message: "Access token refreshed successfully", userData: {
//             _id: user._id,
//             username: user.username,
//             email: user.email,
//             role: user.role, 
//         }});
//     } catch (error) {
//         console.error("Token refresh error:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// const logoutUser = async (req, res) => {
//     const { refreshToken } = req.cookies;
//     if (!refreshToken) {
//         return res.status(400).json({ message: "No refresh token provided" });
//     }
//     await User.findOneAndUpdate({ refreshToken }, { refreshToken: null });
    
//     // --- BEST PRACTICE: Clear cookies with same settings they were set with ---
//     res.clearCookie("accessToken", { httpOnly: true, secure: true, sameSite: 'strict' });
//     res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: 'strict' });
    
//     res.status(200).json({ message: "Logged out successfully" });
// }

// export { 
//     registerUser, 
//     registerAdmin, // Export the new function
//     loginUser, 
//     refreshAccessToken, 
//     logoutUser 
// };