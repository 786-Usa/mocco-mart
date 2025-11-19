import mongoose, { Schema } from "mongoose";

const subCategorySchema = new Schema({

    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    isActive:{
        type: Boolean,
        default: true,
    },
    categoryId:{
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    }


}, { timestamps: true });

export const SubCategory = mongoose.model("SubCategory", subCategorySchema);