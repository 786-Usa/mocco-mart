import { Router } from "express";
import { createSubCategory, deleteSubCategory, getAllSubCategories, getAllSubCategoriesWithProducts, updateSubCategory } from "../controllers/subCategoryController.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const subCategoryRouter = Router();

//public route
subCategoryRouter.get("/", getAllSubCategories);
subCategoryRouter.get("/with-products", getAllSubCategoriesWithProducts);

//admin route
subCategoryRouter.delete("/:id",authMiddleware,adminMiddleware, deleteSubCategory);
subCategoryRouter.put("/:id",authMiddleware,adminMiddleware, updateSubCategory);
subCategoryRouter.post("/",authMiddleware,adminMiddleware, createSubCategory);





export default subCategoryRouter;