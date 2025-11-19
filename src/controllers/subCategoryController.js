import mongoose from "mongoose";
import { SubCategory } from "../models/subCategory.model.js";

const createSubCategory = async (req, res) => {
try {
    const { name, categoryId, description, isActive } = req.body;
    if(!name || !categoryId){
        return res.status(400).json({ message: "Name and Category ID are required" });    
    }
    if(!mongoose.Types.ObjectId.isValid(categoryId)){
        return res.status(400).json({ message: "Invalid Category ID" });
    }
    const newSubCategory = new SubCategory({
        name,
        categoryId,
        description,
        isActive,
    });
    if (!newSubCategory) {
        return res.status(400).json({ message: "SubCategory not created" });
    }
    const savedSubCategory = await newSubCategory.save();
    res.status(201).json({ message: "SubCategory created successfully", subCategory: savedSubCategory });
} catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
}



};

const getAllSubCategories = async (req, res) => {
    try {
        const subCategory =await SubCategory.find();
        if (!subCategory) {
            return res.status(404).json({ message: "No sub-categories found" });
        }
        res.status(200).json({ message: "SubCategories fetched successfully",  subCategory });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "SubCategory ID is required" });
        }
        const { name, categoryId, description, isActive } = req.body;
        const updatedSubCategory = await SubCategory.findByIdAndUpdate(id, { name, categoryId, description, isActive }, { new: true });
        if (!updatedSubCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }
        res.status(200).json({ message: "SubCategory updated successfully", subCategory: updatedSubCategory });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};
const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "SubCategory ID is required" });
        }
        const deletedSubCategory = await SubCategory.findByIdAndDelete(id);
        if (!deletedSubCategory) {
            return res.status(404).json({ message: "SubCategory not found" });
        }
        res.status(200).json({ message: "SubCategory deleted successfully", subCategory: deletedSubCategory });
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const getAllSubCategoriesWithProducts = async (req, res) => {
    
  try {
      const gettingproducts = await SubCategory.aggregate([
          {
              $lookup:{
                  from:"products",
                  localField:"_id",
                  foreignField:"subCategoryId",
                  as:"products"
              }
          }
      ]);
      if(!gettingproducts){
          return res.status(404).json({ message: "No sub-categories found" });
      }
      res.status(200).json({ message: "SubCategories with products fetched successfully",  gettingproducts });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

export {
  createSubCategory,
  getAllSubCategories,
  updateSubCategory,
  deleteSubCategory,
  getAllSubCategoriesWithProducts
};
