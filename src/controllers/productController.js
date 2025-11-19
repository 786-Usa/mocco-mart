import mongoose from "mongoose";
import { Product } from "../models/products.model.js";

const getProducts = async (req, res) => {
  // Implementation for getting products
  try {
      const products = await Product.find();
  if (!products) {
    return res.status(404).json({ message: "No products found" });
  }
  res.status(200).json({ message: "Products fetched successfully", products });
    
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }


};
const createProduct = async (req, res) => {
  // Implementation for creating a product
  const { name, price, description, categoryId, subCategoryId, stock } = req.body;
  try {
    if (!name || !price || !categoryId || !subCategoryId || !stock) {
      return res
        .status(400)
        .json({ message: "Name, Price, Category, SubCategory and Stock are required" });
    }
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid Category ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(subCategoryId)) {
      return res.status(400).json({ message: "Invalid SubCategory ID" });
    }
    const newProduct = new Product({
      name,
      price,
      description,
      categoryId,
      subCategoryId,
      stock,
    });
    if (!newProduct) {
      return res.status(400).json({ message: "Product not created" });
    }
     await newProduct.save();
    res
      .status(201)
      .json({ message: "Product created successfully", product: newProduct });
    
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const updateProduct = async (req, res) => {
  // Implementation for updating a product
  const { id } = req.params;
  const { name, price, description, categoryId, subCategoryId, stock } = req.body;
  try {
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
     const updatedProduct = await Product.findByIdAndUpdate(
        id,
        { name, price, description, categoryId, subCategoryId, stock },
        { new: true }
      );
      if (!updatedProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
      await updatedProduct.save();
      res
        .status(200)
        .json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  // Implementation for deleting a product
    const { id } = req.params;
    try {
        if (!id) {
            return res.status(400).json({ message: "Product ID is required" });
        }
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully", product: deletedProduct });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

export { getProducts, createProduct, updateProduct, deleteProduct };