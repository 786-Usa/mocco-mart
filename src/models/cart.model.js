import mongoose,{ Schema } from "mongoose";
const cartSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true, 
    }
},{
    timestamps: true,
});
export const Cart = mongoose.model("Cart", cartSchema);