import mongoose,{ Schema } from "mongoose";

const wishlistSchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    }],
}, { timestamps: true });

const Wishlist = mongoose.model("Wishlist", wishlistSchema);

export default Wishlist;