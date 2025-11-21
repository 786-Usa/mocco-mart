import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProducts,
  singleProduct,
  updateProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import adminMiddleware from "../middlewares/admin.middleware.js";

const productRouter = Router();

productRouter.get("/",authMiddleware,adminMiddleware, getProducts);
productRouter.post("/", authMiddleware, adminMiddleware, createProduct);
productRouter.put("/:id", authMiddleware, adminMiddleware, updateProduct);
productRouter.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);
productRouter.get("/:id", singleProduct);

export default productRouter;
