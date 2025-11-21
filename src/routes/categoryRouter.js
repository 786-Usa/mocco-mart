import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryWithSubCategories, updateCategory } from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const categoryRouter = Router();

//  PUBLIC ROUTES
categoryRouter.get("/", getAllCategories);
categoryRouter.get("/with-subcategories", getCategoryWithSubCategories);

//  ADMIN ONLY ROUTES
categoryRouter.post("/", authMiddleware, adminMiddleware, createCategory);
categoryRouter.put("/:id", authMiddleware, adminMiddleware, updateCategory);
categoryRouter.delete("/:id", authMiddleware, adminMiddleware, deleteCategory);
export default categoryRouter;