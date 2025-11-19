import mongoose, { Schema } from "mongoose";


const productSchema = new Schema({
name:{
    type: String,
    required: true,
},
description:{
    type: String,
},

price:{
    type: Number,
    required: true,
},
brand:{
    type: String,
},
isActive:{
    type: Boolean,
    default: true,
},
categoryId: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
},
subCategoryId: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
    required: true, 
},
stock:{
    type: Number,
    required: true,
},
// image:{
//     type: String,
// },
// variants: [{
//     name: { type: String, required: true },
//     options: [{ type: String, required: true }],
// }],
// costPrice:{
//     type: Number,
//     required: true,
// },

// stockStatus:{
//     type: String,
//     enum: ["in stock", "out of stock", "preorder"],
//     default: "in stock",
// },


}, { timestamps: true });

export const Product = mongoose.model("Product", productSchema);