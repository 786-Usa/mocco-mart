import { Router } from "express";
import { createSubCategory, deleteSubCategory, getAllSubCategories, getAllSubCategoriesWithProducts, updateSubCategory } from "../controllers/subCategoryController.js";

const subCategoryRouter = Router();

subCategoryRouter.post("/", createSubCategory);
subCategoryRouter.get("/", getAllSubCategories);
subCategoryRouter.put("/:id", updateSubCategory);
subCategoryRouter.delete("/:id", deleteSubCategory);
subCategoryRouter.get("/with-products", getAllSubCategoriesWithProducts);


export default subCategoryRouter;