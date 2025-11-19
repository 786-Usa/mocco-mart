import mongoose from "mongoose";
import { Category } from "../models/category.model.js";



const createCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;
    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const newCategory = new Category({
      name,
      description,
      isActive,
    });
    if (!newCategory) {
      return res.status(400).json({ message: "Category not created" });
    }
    const savedCategory = await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: savedCategory });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


const getAllCategories = async (req, res) => {  
    try {
        const categories = await Category.find();
        if (!categories) {
            return res.status(404).json({ message: "No categories found" });
        }
        res.status(200).json({ message: "Categories fetched successfully",  categories });
        
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });            
    }
};

const updateCategory = async (req, res) => {
    // Implementation for updating a category
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const { name, description, isActive } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(id, { name, description, isActive }, { new: true });
        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const deleteCategory = async (req, res) => {
    // Implementation for deleting a category

    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Category ID is required" });
        }
        const deletedCategory = await Category.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }
        res.status(200).json({ message: "Category deleted successfully", category: deletedCategory });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
}

const getCategoryWithSubCategories = async (req, res) => {
    // Implementation for fetching a category along with its sub-categories
    try {
        const getAllCategories = await Category.aggregate([
            {
                $lookup: {
                    from: "subcategories",
                    localField: "_id",
                    foreignField: "categoryId",
                    as: "subCategories"
                }
    }])
    if(!getAllCategories){
        return res.status(404).json({message: "No categories found"});
    }
    res.status(200).json({message: "Categories fetched successfully",  getAllCategories});  
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
        
    }
};


export { createCategory,getAllCategories,updateCategory,deleteCategory, getCategoryWithSubCategories };