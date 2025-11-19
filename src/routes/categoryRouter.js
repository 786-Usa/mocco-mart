import { Router } from "express";
import { createCategory, deleteCategory, getAllCategories, getCategoryWithSubCategories, updateCategory } from "../controllers/categoryController.js";

const categoryRouter = Router();

categoryRouter.get("/", getAllCategories);
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);
categoryRouter.get("/with-subcategories", getCategoryWithSubCategories);
export default categoryRouter;