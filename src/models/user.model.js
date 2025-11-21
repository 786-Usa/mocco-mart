import mongoose, { Schema } from "mongoose";


const userSchema = new Schema({

    username: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}

})

export const User = mongoose.model("User", userSchema);
